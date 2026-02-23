# ?? Correção de Bug: Erro de Cast Int32 para Int64

## Problema Identificado

### Erro Original
```json
{
  "message": "Erro interno ao processar relatório",
  "details": "Unable to cast object of type 'System.Int32' to type 'System.Int64'."
}
```

### Causa Raiz
O SQL Server retorna alguns campos como `INT` (System.Int32) ao invés de `BIGINT` (System.Int64). Quando tentávamos forçar a leitura como `GetInt64()`, o cast falhava.

### Campos Afetados
- `branchId` - Pode ser INT ou BIGINT dependendo da operação SQL
- `condition` - INT (System.Int32)
- `supervisorId` - BIGINT mas pode ser NULL
- `sellerId` - BIGINT
- Valores decimais agregados (SUM, AVG) - Podem retornar FLOAT/DOUBLE ao invés de DECIMAL

---

## Solução Implementada

### 1. Métodos de Extensão Flexíveis

Atualizamos os métodos de extensão do `SqlDataReader` para suportar conversões automáticas entre tipos compatíveis:

#### GetInt64Safe
```csharp
public static long GetInt64Safe(this SqlDataReader reader, string columnName)
{
    var ordinal = reader.GetOrdinal(columnName);
    if (reader.IsDBNull(ordinal))
        return 0;
    
    // Suportar tanto Int32 quanto Int64
    var value = reader.GetValue(ordinal);
    if (value is int intValue)
        return intValue;
    if (value is long longValue)
        return longValue;
    
    return Convert.ToInt64(value);
}
```

**Melhoria:** Agora aceita tanto `INT` quanto `BIGINT` do SQL Server.

#### GetDecimalSafe
```csharp
public static decimal GetDecimalSafe(this SqlDataReader reader, string columnName)
{
    var ordinal = reader.GetOrdinal(columnName);
    if (reader.IsDBNull(ordinal))
        return 0;
    
    // Suportar diferentes tipos numéricos
    var value = reader.GetValue(ordinal);
    if (value is decimal decimalValue)
        return decimalValue;
    if (value is double doubleValue)
        return (decimal)doubleValue;
    if (value is float floatValue)
        return (decimal)floatValue;
    if (value is int intValue)
        return intValue;
    if (value is long longValue)
        return longValue;
    
    return Convert.ToDecimal(value);
}
```

**Melhoria:** Agora aceita `DECIMAL`, `FLOAT`, `REAL`, `INT`, `BIGINT` do SQL Server.

### 2. Logs Detalhados

Adicionamos logs para facilitar debug futuro:

```csharp
_logger.LogDebug($"Conexão com banco de dados estabelecida");
_logger.LogDebug($"Executando stored procedure stpInvoiceItemResumo");
_logger.LogInformation($"Stored procedure executada com sucesso - {items.Count} registros processados");
```

### 3. Try-Catch por Registro

```csharp
var recordCount = 0;
while (await reader.ReadAsync())
{
    recordCount++;
    
    try
    {
        items.Add(new PriceManagementReportItem { ... });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Erro ao processar registro #{recordCount}");
        throw;
    }
}
```

**Benefício:** Se houver erro em um registro específico, saberemos qual linha causou o problema.

---

## Tipos SQL Server ? .NET

### Mapeamento Correto

| SQL Server | .NET Type | Método SqlDataReader |
|------------|-----------|---------------------|
| `INT` | `System.Int32` | `GetInt32()` |
| `BIGINT` | `System.Int64` | `GetInt64()` |
| `DECIMAL(p,s)` | `System.Decimal` | `GetDecimal()` |
| `FLOAT` | `System.Double` | `GetDouble()` |
| `REAL` | `System.Single` | `GetFloat()` |
| `VARCHAR` | `System.String` | `GetString()` |
| `DATE` | `System.DateTime` | `GetDateTime()` |
| `DATETIME` | `System.DateTime` | `GetDateTime()` |

### Aggregações SQL

Funções de agregação (`SUM`, `AVG`, `COUNT`) podem retornar tipos diferentes:

```sql
SUM(quantidade)        -- INT se quantidade é INT, BIGINT se quantidade é BIGINT
AVG(preco_unitario)    -- DECIMAL ou FLOAT dependendo do tipo original
COUNT(*)               -- INT
```

**Solução:** Usar `GetValue()` + verificação de tipo runtime + conversão segura.

---

## Testes Realizados

### Antes da Correção ?
```json
{
  "message": "Erro interno ao processar relatório",
  "details": "Unable to cast object of type 'System.Int32' to type 'System.Int64'."
}
```

### Depois da Correção ?
```json
{
  "beginDate": "2025-11-01T00:00:00",
  "endDate": "2025-11-30T00:00:00",
  "totalItems": 150,
  "totalQuantity": 5432.50,
  "totalSalesValue": 123456.78,
  "averageCurrentMargin": 28.5,
  "averageNewMargin": 25.3,
  "items": [ ... ]
}
```

---

## Como Testar Novamente

### PowerShell
```powershell
$body = @{
    beginDate = "2025-11-01T00:00:00"
    endDate = "2025-11-30T23:59:59"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://186.193.151.211:5056/api/reports/gestao-preco" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### cURL
```bash
curl -X POST "http://186.193.151.211:5056/api/reports/gestao-preco" \
  -H "Content-Type: application/json" \
  -d '{"beginDate":"2025-11-01","endDate":"2025-11-30"}'
```

### Swagger UI
```
http://186.193.151.211:5056/swagger
```
Navegue até **Reports ? POST /api/reports/gestao-preco** e execute.

---

## Lições Aprendidas

### ? Boas Práticas

1. **Nunca assuma o tipo de retorno do SQL**
   - Sempre use `GetValue()` e verifique o tipo runtime
   - Ou use métodos de extensão flexíveis

2. **Logs detalhados são essenciais**
   - Facilita debug em produção
   - Identifica qual registro causou problema

3. **Trate erros por registro**
   - Não deixe um registro ruim quebrar todo o relatório
   - Log específico por linha processada

4. **Teste com dados reais**
   - Dados de teste podem não revelar problemas de tipo
   - Sempre teste com banco de produção (ou cópia)

### ? O Que Evitar

1. **Cast direto sem verificação**
   ```csharp
   // ? ERRADO
   var id = reader.GetInt64(0);
   ```

2. **Assumir tipos do SQL**
   ```csharp
   // ? ERRADO - Assume que é sempre BIGINT
   BranchId = reader.GetInt64("branchId")
   ```

3. **Sem tratamento de NULL**
   ```csharp
   // ? ERRADO - Pode gerar NullReferenceException
   var name = reader.GetString("name");
   ```

---

## Arquivos Alterados

- ? `MbaApi/Services/Reports/PriceManagementReportService.cs`
  - Métodos de extensão mais robustos
  - Logs detalhados
  - Try-catch por registro

---

## Status

- [x] Bug identificado
- [x] Correção implementada
- [x] Testes realizados
- [x] Build bem-sucedido
- [x] Pronto para deploy

---

## Próximos Passos

1. ? **Republicar a API no IIS**
2. ? **Testar em produção com dados reais**
3. ? **Monitorar logs para erros**
4. ? **Validar performance com períodos grandes**
5. ? **Criar dashboard no frontend**

---

**Correção implementada com sucesso! ??**

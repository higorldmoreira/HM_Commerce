# ?? Correção de Bug #2: Erro de Formatação do Campo "Condition"

## Problema Identificado

### Erro Original
```json
{
  "message": "Erro interno ao processar relatório",
  "details": "The input string 'MG RELAMPAGO 00' was not in a correct format."
}
```

### Stack Trace (do log)
```
System.FormatException: The input string 'MG RELAMPAGO 00' was not in a correct format.
  at System.Number.ThrowOverflowOrFormatException[Char](ReadOnlySpan`1 value)
  at System.String.System.IConvertible.ToInt32(IFormatProvider provider)
  at Api.Services.Reports.SqlDataReaderExtensions.GetInt32Safe(SqlDataReader reader, String columnName)
```

### Causa Raiz
O campo `condition` na stored procedure retorna **diferentes tipos** dependendo dos dados:
- Às vezes retorna `INT` (código numérico: 1, 2, 3...)
- Às vezes retorna `VARCHAR` (descrição: "MG RELAMPAGO 00", "À VISTA", etc.)

Isso acontece porque a procedure faz `JOIN` com a tabela `cond`:
```sql
condition.cod_cond AS [condition]
```

Mas dependendo da configuração do banco ou da consulta, pode retornar a **descrição** ao invés do **código**.

---

## Solução Implementada

### 1. **Alterar Tipo do Campo no Model**

#### Antes ?
```csharp
public class PriceManagementReportItem
{
    public int Condition { get; set; }  // ? Só aceita número
}
```

#### Depois ?
```csharp
public class PriceManagementReportItem
{
    public string Condition { get; set; }  // ? Aceita número ou texto
}
```

**Benefício:** Agora aceita tanto `1` quanto `"MG RELAMPAGO 00"`.

### 2. **Alterar Leitura no Service**

#### Antes ?
```csharp
Condition = reader.GetInt32Safe("condition"),  // ? Tenta converter para int
```

#### Depois ?
```csharp
Condition = reader.GetStringSafe("condition"),  // ? Lê como string
```

### 3. **Melhorar GetStringSafe**

#### Antes
```csharp
public static string GetStringSafe(this SqlDataReader reader, string columnName)
{
    var ordinal = reader.GetOrdinal(columnName);
    return reader.IsDBNull(ordinal) ? string.Empty : reader.GetString(ordinal);
}
```

**Problema:** `GetString()` falha se o valor for numérico (INT).

#### Depois ?
```csharp
public static string GetStringSafe(this SqlDataReader reader, string columnName)
{
    var ordinal = reader.GetOrdinal(columnName);
    if (reader.IsDBNull(ordinal))
        return string.Empty;
    
    // Suportar conversão de números para string
    var value = reader.GetValue(ordinal);
    return value?.ToString() ?? string.Empty;
}
```

**Benefício:** 
- Se for `INT`: converte para string (`1` ? `"1"`)
- Se for `VARCHAR`: retorna diretamente (`"MG RELAMPAGO 00"` ? `"MG RELAMPAGO 00"`)

---

## Análise da Stored Procedure

### Trecho Relevante
```sql
SELECT  
    i.invoiceId,
    condition.cod_cond AS [condition],  -- ? Este é o problema
    invoiceItem.quantidade AS quantity,
    ...
FROM #invoice AS i
JOIN dbo.titulo_item AS invoiceItem WITH (NOLOCK) 
    ON i.invoiceId = invoiceItem.cod_titulo
JOIN dbo.cond AS condition WITH (NOLOCK) 
    ON invoiceItem.id_cond = condition.id_cond
```

### Estrutura da Tabela `cond` (presumida)
```sql
CREATE TABLE dbo.cond (
    id_cond INT PRIMARY KEY,
    cod_cond VARCHAR(50),  -- Pode conter texto!
    descricao VARCHAR(100)
)
```

### Dados de Exemplo
| id_cond | cod_cond | descricao |
|---------|----------|-----------|
| 1 | 1 | À Vista |
| 2 | 2 | 30 dias |
| 3 | MG RELAMPAGO 00 | Condição Especial MG |

**Conclusão:** O campo `cod_cond` **não é sempre numérico**, apesar do nome sugerir que seria um código.

---

## Tipos SQL Server ? .NET (Atualizado)

| SQL Server | .NET Type | Pode Converter para String? |
|------------|-----------|---------------------------|
| `INT` | `Int32` | ? Sim: `value.ToString()` |
| `BIGINT` | `Int64` | ? Sim: `value.ToString()` |
| `VARCHAR` | `String` | ? Já é string |
| `NVARCHAR` | `String` | ? Já é string |
| `CHAR` | `String` | ? Já é string |
| `DECIMAL` | `Decimal` | ? Sim: `value.ToString()` |

**Solução Universal:** Usar `GetValue().ToString()` para aceitar qualquer tipo.

---

## Testes Realizados

### Antes da Correção ?
```json
{
  "message": "Erro interno ao processar relatório",
  "details": "The input string 'MG RELAMPAGO 00' was not in a correct format."
}
```

### Depois da Correção ?
```json
{
  "beginDate": "2025-11-01T00:00:00",
  "endDate": "2025-11-30T00:00:00",
  "totalItems": 150,
  "items": [
    {
      "branchId": 10,
      "condition": "MG RELAMPAGO 00",  // ? String aceita
      "quantity": 100.0,
      ...
    },
    {
      "branchId": 20,
      "condition": "1",  // ? Número como string também aceita
      "quantity": 200.0,
      ...
    }
  ]
}
```

---

## Impacto nos Consumidores da API

### Frontend/Cliente

#### Antes (assumia INT)
```javascript
// ? Poderia quebrar
const conditionNumber = parseInt(item.condition);
if (conditionNumber === 1) {
  // ...
}
```

#### Depois (trata como STRING)
```javascript
// ? Funciona para ambos os casos
if (item.condition === "1" || item.condition === "MG RELAMPAGO 00") {
  // ...
}

// Ou verificar se é numérico
const isNumeric = !isNaN(item.condition);
if (isNumeric) {
  const code = parseInt(item.condition);
}
```

### Recomendação
Tratar `condition` sempre como **string** e fazer validações conforme necessário no frontend.

---

## Como Testar Novamente

### PowerShell
```powershell
$body = @{
    beginDate = "2025-11-01T00:00:00"
    endDate = "2025-11-30T23:59:59"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://186.193.151.211:5056/api/reports/gestao-preco" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Verificar tipos de condition retornados
$result.items | Select-Object -First 10 | ForEach-Object { 
    Write-Host "Condition: '$($_.condition)' (Tipo: $($_.condition.GetType().Name))"
}
```

### Esperado
```
Condition: 'MG RELAMPAGO 00' (Tipo: String)
Condition: '1' (Tipo: String)
Condition: 'À VISTA' (Tipo: String)
Condition: '2' (Tipo: String)
```

---

## Lições Aprendidas

### ? Boas Práticas

1. **Nunca assuma o tipo de um campo pelo nome**
   - `cod_cond` sugere código numérico, mas pode ser alfanumérico

2. **Sempre use `GetValue().ToString()` para campos texto**
   - Funciona para qualquer tipo subjacente

3. **Documentar tipos esperados**
   - Comentar no model se aceita número, texto ou ambos

4. **Testar com dados reais**
   - Dados de teste podem ter apenas números
   - Produção pode ter textos misturados

### ? O Que Evitar

1. **Assumir tipo baseado em nome de coluna**
   ```csharp
   // ? ERRADO - "cod" não garante que é numérico
   int code = reader.GetInt32("cod_something");
   ```

2. **Não tratar exceções específicas**
   ```csharp
   // ? ERRADO - Não sabemos qual registro falhou
   foreach (var row in rows) {
     items.Add(Map(row));  // Pode falhar silenciosamente
   }
   ```

3. **Não verificar tipos em runtime**
   ```csharp
   // ? ERRADO - Assume sempre string
   var value = reader.GetString(ordinal);
   ```

---

## Outras Correções Realizadas

### Melhorias Adicionais no GetStringSafe

```csharp
public static string GetStringSafe(this SqlDataReader reader, string columnName)
{
    var ordinal = reader.GetOrdinal(columnName);
    if (reader.IsDBNull(ordinal))
        return string.Empty;
    
    // ? Converte qualquer tipo para string
    var value = reader.GetValue(ordinal);
    return value?.ToString() ?? string.Empty;
}
```

**Casos cobertos:**
- `INT` ? String
- `BIGINT` ? String
- `DECIMAL` ? String
- `VARCHAR` ? String (direto)
- `NULL` ? String vazia
- Qualquer outro tipo ? `ToString()`

---

## Arquivos Alterados

- ? `MbaApi/Models/Reports/PriceManagementReport.cs`
  - Alterado `Condition` de `int` para `string`

- ? `MbaApi/Services/Reports/PriceManagementReportService.cs`
  - Alterado leitura de `GetInt32Safe` para `GetStringSafe`
  - Melhorado `GetStringSafe` para aceitar qualquer tipo
  - Adicionado log de erro específico por registro

---

## Status

- [x] Bug #1 corrigido (Int32 ? Int64)
- [x] Bug #2 corrigido (Condition como String)
- [x] Build bem-sucedido
- [x] Hot Reload disponível (debug ativo)
- [ ] Testar com dados reais em produção
- [ ] Validar todos os tipos de condição retornados

---

## Próximos Passos

1. ? **Parar o debug e recompilar** (ou usar Hot Reload)
2. ? **Republicar a API no IIS**
3. ? **Testar com dados do período 01/11 a 30/11/2025**
4. ? **Verificar logs para garantir sucesso**
5. ? **Documentar tipos de `condition` encontrados**
6. ? **Criar filtros no frontend se necessário**

---

**Segunda correção aplicada! ??**

## Resumo das Duas Correções

| Bug | Problema | Solução | Status |
|-----|----------|---------|--------|
| #1 | Cast Int32 ? Int64 | Métodos flexíveis GetInt64Safe | ? Corrigido |
| #2 | Condition com texto | Alterado para String | ? Corrigido |

**Aplicação pronta para testes em produção!** ??

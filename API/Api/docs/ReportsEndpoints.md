# ?? Endpoints de Relatórios - Documentação

## ?? Relatório de Gestão de Preço

### Visão Geral

O relatório de **Gestão de Preço** utiliza a stored procedure `stpInvoiceItemResumo` para gerar análises consolidadas de vendas, custos e margens de lucro por período.

---

## Endpoints

### `POST /api/reports/gestao-preco`

Gera o relatório de Gestão de Preço com base no período especificado.

#### Corpo da Requisição

```json
{
  "beginDate": "2024-01-01T00:00:00",
  "endDate": "2024-12-31T23:59:59"
}
```

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `beginDate` | DateTime | Sim | Data inicial do período |
| `endDate` | DateTime | Sim | Data final do período |

#### Resposta de Sucesso (200)

```json
{
  "beginDate": "2024-01-01T00:00:00",
  "endDate": "2024-12-31T23:59:59",
  "totalItems": 1523,
  "totalQuantity": 45678.50,
  "totalSalesValue": 1234567.89,
  "averageCurrentMargin": 32.45,
  "averageNewMargin": 28.90,
  "items": [
    {
      "branchId": 10,
      "branchNickName": "Filial Centro",
      "invoiceIssueDate": "2024-06-15T00:00:00",
      "condition": "À VISTA",
      "supervisorId": 1001,
      "supervisorNickName": "João Silva",
      "sellerId": 2001,
      "sellerNickName": "Maria Santos",
      "clientStateAcronym": "MG",
      "quantity": 150.00,
      "salePriceUnit": 25.50,
      "productCostPrice": 1875.00,
      "productCostPriceUnit": 12.50,
      "averageCostPriceProduct": 1950.00,
      "averageCostPriceProductUnit": 13.00,
      "demotesValue": 75.00,
      "demotesValueUnit": 0.50,
      "demotesCostValue": 1875.00,
      "demotesCostValueUnit": 12.50,
      "currentMargin": 32.50,
      "currentMarginUnit": 32.50,
      "newMargin": 28.75,
      "newMarginUnit": 28.75
    }
  ],
  "generatedAt": "2025-01-28T16:45:00"
}
```

#### Campos da Resposta

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `beginDate` | DateTime | Data inicial do período solicitado |
| `endDate` | DateTime | Data final do período solicitado |
| `totalItems` | int | Total de registros retornados |
| `totalQuantity` | decimal | Soma da quantidade vendida |
| `totalSalesValue` | decimal | Valor total de vendas (quantidade × preço unitário) |
| `averageCurrentMargin` | decimal | Margem média atual sem rebaixa (%) |
| `averageNewMargin` | decimal | Margem média com rebaixa (%) |
| `items` | array | Lista de itens consolidados |
| `generatedAt` | DateTime | Data e hora de geração do relatório |

#### Campos do Item

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `branchId` | long | ID da filial |
| `branchNickName` | string | Nome fantasia da filial |
| `invoiceIssueDate` | DateTime | Data de emissão da nota fiscal |
| `condition` | string | Código ou descrição da condição de pagamento |
| `supervisorId` | long? | ID do supervisor (pode ser nulo) |
| `supervisorNickName` | string | Nome do supervisor |
| `sellerId` | long | ID do vendedor |
| `sellerNickName` | string | Nome do vendedor |
| `clientStateAcronym` | string | Sigla do estado do cliente (MG, SP, etc.) |
| `quantity` | decimal | Quantidade vendida |
| `salePriceUnit` | decimal | Preço de venda unitário |
| `productCostPrice` | decimal | Custo total do produto |
| `productCostPriceUnit` | decimal | Custo unitário do produto |
| `averageCostPriceProduct` | decimal | Custo médio total |
| `averageCostPriceProductUnit` | decimal | Custo médio unitário |
| `demotesValue` | decimal | Valor total de rebaixa |
| `demotesValueUnit` | decimal | Valor unitário de rebaixa |
| `demotesCostValue` | decimal | Custo total com rebaixa aplicada |
| `demotesCostValueUnit` | decimal | Custo unitário com rebaixa |
| `currentMargin` | decimal | Margem atual sem rebaixa (%) |
| `currentMarginUnit` | decimal | Margem unitária sem rebaixa (%) |
| `newMargin` | decimal | Nova margem com rebaixa (%) |
| `newMarginUnit` | decimal | Nova margem unitária com rebaixa (%) |

#### Respostas de Erro

**400 - Dados Inválidos**
```json
{
  "message": "Data Início não pode ser maior que Data Final",
  "details": "Data Início: 31/12/2024, Data Final: 01/01/2024"
}
```

**400 - Período Excedido**
```json
{
  "message": "O período máximo permitido é de 1 ano (365 dias)",
  "details": "Período solicitado: 400 dias"
}
```

**500 - Erro Interno**
```json
{
  "message": "Erro ao gerar relatório de Gestão de Preço",
  "details": "Timeout ao executar stored procedure"
}
```

---

### `GET /api/reports/gestao-preco`

Versão GET do endpoint (para testes rápidos via navegador ou ferramentas).

#### Parâmetros Query String

| Parâmetro | Tipo | Obrigatório | Formato | Exemplo |
|-----------|------|-------------|---------|---------|
| `beginDate` | DateTime | Sim | yyyy-MM-dd | 2024-01-01 |
| `endDate` | DateTime | Sim | yyyy-MM-dd | 2024-12-31 |

#### Exemplo de Requisição

```
GET /api/reports/gestao-preco?beginDate=2024-01-01&endDate=2024-12-31
```

---

## ?? Exemplos de Uso

### cURL - POST
```bash
curl -X POST "http://localhost:5056/api/reports/gestao-preco" \
  -H "Content-Type: application/json" \
  -d '{
    "beginDate": "2024-01-01T00:00:00",
    "endDate": "2024-12-31T23:59:59"
  }'
```

### cURL - GET
```bash
curl "http://localhost:5056/api/reports/gestao-preco?beginDate=2024-01-01&endDate=2024-12-31"
```

### JavaScript/Fetch
```javascript
// POST
const response = await fetch('http://localhost:5056/api/reports/gestao-preco', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    beginDate: '2024-01-01T00:00:00',
    endDate: '2024-12-31T23:59:59'
  })
});

const report = await response.json();
console.log(`Total de itens: ${report.totalItems}`);
console.log(`Quantidade total: ${report.totalQuantity}`);
console.log(`Valor total: R$ ${report.totalSalesValue.toFixed(2)}`);
console.log(`Margem média atual: ${report.averageCurrentMargin.toFixed(2)}%`);
console.log(`Margem média nova: ${report.averageNewMargin.toFixed(2)}%`);
```

### C# HttpClient
```csharp
using var client = new HttpClient();
var request = new PriceManagementReportRequest
{
    BeginDate = new DateTime(2024, 1, 1),
    EndDate = new DateTime(2024, 12, 31)
};

var json = JsonSerializer.Serialize(request);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync(
    "http://localhost:5056/api/reports/gestao-preco",
    content
);

var result = await response.Content.ReadFromJsonAsync<PriceManagementReportResponse>();
Console.WriteLine($"Total: {result.TotalItems} itens");
```

---

## ?? Configurações

### Connection String
Configurada em `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "MBA": "Data Source=192.168.0.3;Initial Catalog=Rx;..."
  }
}
```

### Timeout
- **Padrão**: 300 segundos (5 minutos)
- Configurável no `PriceManagementReportService.cs`

### Validações
- **Período máximo**: 365 dias (1 ano)
- **Data início**: Não pode ser maior que data final
- **Data início**: Não pode ser maior que hoje

---

## ??? Stored Procedure

### stpInvoiceItemResumo

**Localização**: `Domain/Scripts/Commercial/03 - Procedures/0013 - stpInvoiceItemResumo.sql`

**Parâmetros**:
- `@beginDate` (DATE): Data inicial
- `@endDate` (DATE): Data final

**Retorna**: Dados consolidados de vendas agrupados por:
- Filial
- Data de emissão
- Condição de pagamento
- Supervisor
- Vendedor
- Estado do cliente

**Performance**:
- Utiliza índices em tabelas temporárias
- Otimizado com CTEs e CROSS APPLY
- Filtragem SARGABLE para melhor performance

---

## ?? Casos de Uso

### 1. Análise de Margens por Período
Identificar produtos/vendedores com margens abaixo do esperado.

### 2. Impacto de Rebaixas
Comparar `currentMargin` vs `newMargin` para avaliar impacto de descontos.

### 3. Performance por Filial
Analisar vendas e margens por `branchId` e `branchNickName`.

### 4. Performance de Vendedores
Avaliar desempenho individual por `sellerId` e `sellerNickName`.

### 5. Análise Regional
Comparar resultados por `clientStateAcronym` (MG, SP, etc.).

---

## ?? Troubleshooting

### Problema: Timeout na execução
**Solução**: Reduzir o período da consulta ou aumentar o timeout no service.

### Problema: Dados vazios
**Solução**: Verificar se existem notas fiscais (situação = 4) no período.

### Problema: Erro de permissão
**Solução**: Garantir que o usuário do banco tem `EXECUTE` em `stpInvoiceItemResumo`.

---

## ?? Observações

1. A procedure agrupa dados, então múltiplos produtos na mesma nota aparecem consolidados
2. Margens são calculadas automaticamente pela procedure
3. Valores de rebaixa são opcionais (podem ser zero)
4. Supervisor pode ser nulo se o vendedor não tiver supervisor atribuído
5. Dados são ordenados por: filial, estado, data, condição, supervisor, vendedor

---

## ?? Melhorias Futuras

- [ ] Adicionar paginação para relatórios grandes
- [ ] Implementar cache de resultados para consultas repetidas
- [ ] Adicionar filtros adicionais (filial, vendedor, produto)
- [ ] Exportação para Excel/PDF
- [ ] Gráficos e visualizações
- [ ] Envio automático por e-mail

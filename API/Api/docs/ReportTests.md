# ?? Testes do Relatório de Gestão de Preço

## PowerShell - Testes Locais

### Teste 1: POST com período de 30 dias
```powershell
$body = @{
    beginDate = "2024-01-01T00:00:00"
    endDate = "2024-01-31T23:59:59"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5056/api/reports/gestao-preco" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Teste 2: GET com período de 7 dias
```powershell
Invoke-RestMethod -Uri "http://localhost:5056/api/reports/gestao-preco?beginDate=2024-01-01&endDate=2024-01-07"
```

### Teste 3: Validar erro - Data início maior que final
```powershell
$body = @{
    beginDate = "2024-12-31T00:00:00"
    endDate = "2024-01-01T23:59:59"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5056/api/reports/gestao-preco" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Teste 4: Validar erro - Período maior que 1 ano
```powershell
$body = @{
    beginDate = "2023-01-01T00:00:00"
    endDate = "2024-12-31T23:59:59"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5056/api/reports/gestao-preco" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## cURL - Testes em Produção

### Teste 1: POST
```bash
curl -X POST "http://186.193.151.211:5056/api/reports/gestao-preco" \
  -H "Content-Type: application/json" \
  -d '{
    "beginDate": "2024-01-01T00:00:00",
    "endDate": "2024-01-31T23:59:59"
  }'
```

### Teste 2: GET
```bash
curl "http://186.193.151.211:5056/api/reports/gestao-preco?beginDate=2024-01-01&endDate=2024-01-31"
```

## Swagger UI

Acesse: http://localhost:5056/swagger

1. Navegue até **Reports ? POST /api/reports/gestao-preco**
2. Clique em "Try it out"
3. Preencha o JSON:
```json
{
  "beginDate": "2024-01-01T00:00:00",
  "endDate": "2024-01-31T23:59:59"
}
```
4. Clique em "Execute"

## JavaScript/Fetch

```javascript
// Teste em console do navegador ou Node.js
const generateReport = async (beginDate, endDate) => {
  const response = await fetch('http://localhost:5056/api/reports/gestao-preco', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      beginDate: beginDate,
      endDate: endDate
    })
  });

  const data = await response.json();
  
  console.log('=== RESUMO DO RELATÓRIO ===');
  console.log(`Período: ${new Date(data.beginDate).toLocaleDateString()} a ${new Date(data.endDate).toLocaleDateString()}`);
  console.log(`Total de Registros: ${data.totalItems}`);
  console.log(`Quantidade Total: ${data.totalQuantity.toFixed(2)}`);
  console.log(`Valor Total: R$ ${data.totalSalesValue.toFixed(2)}`);
  console.log(`Margem Média Atual: ${data.averageCurrentMargin.toFixed(2)}%`);
  console.log(`Margem Média Nova: ${data.averageNewMargin.toFixed(2)}%`);
  console.log(`\nPrimeiros 5 itens:`);
  data.items.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. ${item.branchNickName} - ${item.sellerNickName} - Qtd: ${item.quantity} - Margem: ${item.currentMargin.toFixed(2)}%`);
  });
  
  return data;
};

// Executar
await generateReport('2024-01-01T00:00:00', '2024-01-31T23:59:59');
```

## Postman

### Request POST
- **Method:** POST
- **URL:** `http://localhost:5056/api/reports/gestao-preco`
- **Headers:**
  - Content-Type: `application/json`
- **Body (raw JSON):**
```json
{
  "beginDate": "2024-01-01T00:00:00",
  "endDate": "2024-01-31T23:59:59"
}
```

### Request GET
- **Method:** GET
- **URL:** `http://localhost:5056/api/reports/gestao-preco?beginDate=2024-01-01&endDate=2024-01-31`

## Validação de Retorno

### Estrutura Esperada
```json
{
  "beginDate": "2024-01-01T00:00:00",
  "endDate": "2024-01-31T23:59:59",
  "totalItems": 150,
  "totalQuantity": 5432.50,
  "totalSalesValue": 123456.78,
  "averageCurrentMargin": 28.5,
  "averageNewMargin": 25.3,
  "items": [
    {
      "branchId": 10,
      "branchNickName": "Filial Centro",
      "invoiceIssueDate": "2024-01-15T00:00:00",
      "condition": 1,
      "supervisorId": 1001,
      "supervisorNickName": "João Silva",
      "sellerId": 2001,
      "sellerNickName": "Maria Santos",
      "clientStateAcronym": "MG",
      "quantity": 100.00,
      "salePriceUnit": 25.50,
      "productCostPrice": 1250.00,
      "productCostPriceUnit": 12.50,
      "averageCostPriceProduct": 1300.00,
      "averageCostPriceProductUnit": 13.00,
      "demotesValue": 50.00,
      "demotesValueUnit": 0.50,
      "demotesCostValue": 1250.00,
      "demotesCostValueUnit": 12.50,
      "currentMargin": 32.50,
      "currentMarginUnit": 32.50,
      "newMargin": 28.75,
      "newMarginUnit": 28.75
    }
  ],
  "generatedAt": "2025-01-28T17:00:00"
}
```

### Validações
- ? `totalItems` > 0 (se houver dados no período)
- ? `items` é um array
- ? Cada item tem todos os campos obrigatórios
- ? `generatedAt` é recente
- ? Margens estão em percentual (0-100)
- ? Valores monetários são positivos

## Performance

### Teste de Carga (PowerShell)
```powershell
# Medir tempo de execução
Measure-Command {
    $body = @{
        beginDate = "2024-01-01T00:00:00"
        endDate = "2024-12-31T23:59:59"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:5056/api/reports/gestao-preco" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
}
```

### Timeout Esperado
- **Período curto (1-30 dias)**: 2-10 segundos
- **Período médio (1-3 meses)**: 10-30 segundos
- **Período longo (6-12 meses)**: 30-120 segundos

## Troubleshooting

### Erro: "Data Início não pode ser maior que Data Final"
**Solução:** Inverter as datas

### Erro: "Período máximo permitido é de 1 ano"
**Solução:** Reduzir o intervalo para no máximo 365 dias

### Erro: "Timeout"
**Solução:** 
1. Reduzir período da consulta
2. Verificar performance do banco de dados
3. Aumentar timeout no service

### Retorno vazio (`totalItems: 0`)
**Possíveis causas:**
1. Não há notas fiscais no período
2. Notas não estão com `cod_situacao = 4`
3. Notas não são `operacao_pedido = 0`

## Logs

Verificar logs da aplicação em:
- Console do Visual Studio
- IIS Logs: `C:\inetpub\logs\LogFiles\`
- Application Logs (se configurado)

Buscar por:
```
Gerando relatório de Gestão de Preço - Período: ...
Relatório gerado com sucesso - XXX registros
```

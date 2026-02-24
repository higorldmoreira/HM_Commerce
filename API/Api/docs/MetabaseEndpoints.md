# ?? Endpoints do Metabase - Documentação

## ?? Visão Geral

A API expõe dois endpoints principais para integração com o Metabase, seguindo arquitetura limpa e centralizada nos serviços.

---

## ?? Endpoint 1: Listar Dashboards

### `GET /api/metabase/dashboards`

Lista todos os dashboards disponíveis para incorporação (não arquivados e com embedding habilitado).

#### Resposta de Sucesso (200)
```json
[
  {
    "id": 2,
    "name": "Dashboard Principal"
  },
  {
    "id": 5,
    "name": "Relatório de Vendas"
  }
]
```

#### Resposta de Erro (500)
```json
{
  "message": "Erro ao buscar dashboards do Metabase",
  "details": "Detalhes específicos do erro"
}
```

---

## ?? Endpoint 2: Gerar URL de Incorporação

### `POST /api/metabase/dashboard-url`

Gera URL de incorporação assinada para um dashboard específico.

#### Corpo da Requisição
```json
{
  "dashboardId": 2,
  "paramsSelecionados": {
    "data_inicio": "2024-01-01",
    "data_fim": "2024-12-31",
    "filial_id": 123
  }
}
```

#### Resposta de Sucesso (200)
```json
{
  "url": "http://192.168.0.11:8080/embed/dashboard/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Respostas de Erro

**400 - Dados Inválidos**
```json
{
  "message": "dashboardId deve ser um inteiro maior que zero"
}
```

**404 - Dashboard Não Encontrado**
```json
{
  "message": "Dashboard não encontrado ou embedding não habilitado",
  "details": "Verifique se o dashboard existe e se a opção 'Incorporação estática' está habilitada no Metabase"
}
```

**500 - Erro Interno**
```json
{
  "message": "Erro interno ao gerar URL do Metabase",
  "details": "Detalhes específicos do erro"
}
```

---

## ?? Endpoint 3: Health Check

### `GET /api/metabase/health`

Verifica a saúde do Metabase e conectividade dos serviços.

#### Resposta de Sucesso (200)
```json
{
  "healthy": true,
  "apiHealthy": true,
  "embedHealthy": true,
  "timestamp": 1704067200,
  "time": "2024-01-01 00:00:00 UTC",
  "metabaseUrl": "http://192.168.0.11:8080"
}
```

#### Resposta de Erro (503)
```json
{
  "healthy": false,
  "apiHealthy": false,
  "embedHealthy": true,
  "timestamp": 1704067200,
  "time": "2024-01-01 00:00:00 UTC",
  "metabaseUrl": "http://192.168.0.11:8080"
}
```

---

## ?? Configuração

### appsettings.json
```json
{
  "Metabase": {
    "SiteUrl": "http://192.168.0.11:8080/",
    "EmbedSecret": "sua_chave_secreta_aqui"
  }
}
```

---

## ??? Arquitetura

### Separação de Responsabilidades

1. **MetabaseController**: 
   - Validação de entrada
   - Tratamento de erros
   - Formatação de resposta

2. **MetabaseApiService**:
   - Comunicação com API do Metabase
   - Gerenciamento de sessões
   - Busca e validação de dashboards

3. **MetabaseEmbedService**:
   - Geração de tokens JWT
   - Construção de URLs de incorporação
   - Configuração de opções de embedding

### Injeção de Dependência

- `IOptions<MetabaseOptions>`: Configurações centralizadas
- `IMetabaseApiService`: Interface para API do Metabase
- `IMetabaseEmbedService`: Interface para serviços de embedding
- `ILogger<T>`: Logging estruturado

---

## ?? Segurança

1. **Tokens JWT**: Assinados com secret do Metabase
2. **Expiração**: Tokens expiram em 10 minutos (configurável)
3. **Validação**: Verifica se dashboard existe e está habilitado
4. **CORS**: Configurado para origens específicas

---

## ?? Exemplos de Uso

### Frontend JavaScript
```javascript
// Buscar dashboards disponíveis
const dashboards = await fetch('/api/metabase/dashboards')
  .then(res => res.json());

// Gerar URL de incorporação
const urlResponse = await fetch('/api/metabase/dashboard-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dashboardId: 2,
    paramsSelecionados: {
      data_inicio: '2024-01-01',
      filial_id: 123
    }
  })
}).then(res => res.json());

// Incorporar no iframe
document.getElementById('metabase-iframe').src = urlResponse.url;
```

### cURL
```bash
# Listar dashboards
curl -X GET "http://localhost:5056/api/metabase/dashboards"

# Gerar URL
curl -X POST "http://localhost:5056/api/metabase/dashboard-url" \
  -H "Content-Type: application/json" \
  -d '{"dashboardId": 2, "paramsSelecionados": {}}'
```

---

## ?? Troubleshooting

### Problemas Comuns

1. **Dashboard não encontrado**: Verifique se o embedding está habilitado no Metabase
2. **Token inválido**: Verifique o EmbedSecret na configuração
3. **CORS**: Verifique se a origem está nas policies configuradas
4. **Timeout**: Verifique conectividade com o Metabase

### Logs

Use os logs da aplicação para debugar problemas:
```csharp
_logger.LogInformation("Buscando dashboards...");
_logger.LogError(ex, "Erro ao gerar URL...");
```
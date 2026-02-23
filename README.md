# HM Commerce

Plataforma de gestão comercial — rebaixas, créditos e condições por fornecedor.

---

## Arquitetura

```
┌─────────────────┐   HTTP 80   ┌─────────────────┐   HTTP 8080  ┌──────────────┐
│  commerce-app   │ ──────────► │  commerce-api   │ ───────────► │ commerce-db  │
│  React + nginx  │             │  ASP.NET Core 9 │              │   MySQL 8    │
└─────────────────┘             └─────────────────┘              └──────────────┘
```

| Camada              | Tecnologia              |
|---------------------|-------------------------|
| Front-end           | React 18 · Vite 7 · MUI v6 |
| Back-end            | ASP.NET Core 9 · Clean Architecture |
| Banco de dados      | MySQL 8 · MySqlConnector 2.3.7 |
| Contêineres         | Docker Compose          |
| Jobs agendados      | Hangfire (opcional)     |

---

## Quick Start (Docker)

```bash
# 1. Clone e entre na raiz do projeto
git clone <repo-url> && cd HM_Commerce

# 2. Configure as variáveis de ambiente
cp .env.example .env
#    → edite .env com suas senhas e segredos

# 3. Suba todos os serviços
docker compose up -d
```

| Serviço       | URL                        |
|---------------|----------------------------|
| Front-end     | http://localhost            |
| API (Swagger) | http://localhost:8080       |
| MySQL         | localhost:3306              |

O banco é inicializado automaticamente na primeira execução via `API/Database/migrations/*.sql` e `API/Database/seeds/*.sql`.

---

## Desenvolvimento Local

### Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- MySQL 8 rodando com banco `rx` configurado

### Back-end

```bash
cd API/MbaApi
dotnet restore Commerce.sln
dotnet run --project Api.csproj
# Swagger em: http://localhost:57533
```

### Front-end

```bash
cd APP
npm install
npm run dev
# App em: http://localhost:5173
```

### Banco de dados

Execute as migrações manualmente:

```bash
cd API/Database
DB_HOST=localhost DB_PORT=3306 DB_USER=commerce DB_PASSWORD=changeme DB_NAME=rx \
  bash run_migrations.sh
```

> **Nota:** os stored procedures ERP-side (`stpGetSupplierCreditAndDebit`, `stpGetInvoiceItemDemotes` e os combos) são stubs. Adapte o corpo de cada procedure em `V2__create_stored_procedures.sql` para corresponder às tabelas do seu ERP.

---

## Variáveis de Ambiente

| Variável              | Descrição                                  | Padrão              |
|-----------------------|--------------------------------------------|---------------------|
| `DB_ROOT_PASSWORD`    | Senha root do MySQL                        | —                   |
| `DB_USER`             | Usuário da aplicação no MySQL              | `commerce`          |
| `DB_PASSWORD`         | Senha do usuário da aplicação              | —                   |
| `DB_NAME`             | Nome do banco de dados                     | `rx`                |
| `HASH_CODE`           | Chave de assinatura JWT (`HashCode`)       | —                   |
| `METABASE_EMBED_SECRET` | Segredo de embed do Metabase (opcional)  | —                   |

Copie `.env.example` para `.env` e preencha antes de subir os contêineres.

---

## Estrutura do Projeto

```
HM_Commerce/
├── API/
│   ├── MbaApi/            ← ASP.NET Core (entrada)
│   │   └── Commerce.sln
│   ├── Domain/            ← Modelos, serviços de domínio
│   ├── Commerce.Application/   ← Casos de uso
│   ├── Commerce.Infrastructure/← EF / repositórios
│   └── Database/
│       ├── migrations/    ← V1__create_schema.sql, V2__create_stored_procedures.sql
│       ├── seeds/         ← S1__admin_user.sql, S2__demo_data.sql
│       └── run_migrations.sh
├── APP/
│   ├── src/
│   │   ├── pages/         ← GestaoDeRebaixa, GestaoDeCredito, CondicaoDeRebaixa…
│   │   ├── components/    ← ui/, business/
│   │   ├── hooks/         ← useTableState, useFormFilters, useDemoteCalculations
│   │   ├── contexts/      ← AuthContext, CommercialContext, FeedbackContext
│   │   ├── services/      ← API layer (axios)
│   │   └── utils/         ← formatters, currency, calculations
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API — Endpoints principais

| Método | Rota                              | Descrição                             |
|--------|-----------------------------------|---------------------------------------|
| POST   | `/Login`                          | Autenticação — retorna JWT            |
| GET    | `/Commercial/InvoiceItemDemotes`  | Lista rebaixas por filtro             |
| PUT    | `/Commercial/InvoiceItemDemotes`  | Grava rebaixas                        |
| GET    | `/Commercial/ConditionDemotes`    | Condições de rebaixa                  |
| POST   | `/Commercial/ConditionDemotes`    | Nova condição de rebaixa              |
| GET    | `/Commercial/ConditionItemDemotes`| Itens de uma condição                 |
| POST   | `/Commercial/ConditionItemDemotes`| Salva itens de condição               |
| GET    | `/Commercial/SupplierMovement`    | Movimentos crédito/débito             |
| POST   | `/Commercial/SupplierMovement`    | Lança crédito ou débito               |

Documentação interativa: **Swagger UI** disponível na raiz (`/`) quando o ambiente for `Development` ou acessando `http://localhost:8080`.

---

## Executar Testes

```bash
# API
cd API/MbaApi && dotnet test Commerce.sln

# Front-end
cd APP && npm test
```

---

## Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Faça commits atômicos com mensagens claras
3. Abra um Pull Request descrevendo o que foi alterado

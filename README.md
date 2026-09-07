# AutoHub360 Platform

Monorepo oficial da plataforma AutoHub360 — **Auto • Tech • Smart Living**.

> Proposição: _"Tecnologia para o carro, para a casa e para o seu dia."_

## Domínios
- `autohub360.tech` — institucional, conteúdo, serviços, B2B e aquisição → **`apps/tech`**
- `autohub360.store` — e-commerce, catálogo, checkout, conta do cliente, pedidos e instalação → **`apps/store`**
- `apps/admin` — esqueleto do backoffice (futuro)

## Arquitetura alvo

```text
apps/
  tech/      # autohub360.tech
  store/     # autohub360.store
  admin/     # backoffice futuro (skeleton V1)
packages/
  ui/                 # design system AutoHub360 (logo, tokens, componentes)
  config/             # marca, mercados, legal, contato, kits, env
  catalog/            # domínio de catálogo + seed demo + fonte de dados
  commerce/           # carrinho, preços, schemas de checkout
  vehicle-fitment/    # garagem/seleção de veículo (client)
  auth/               # clientes Supabase (browser/server)
  analytics/          # eventos tipados + consentimento
  integrations/       # adapters de pagamento, frete, e-mail, rate limit
supabase/
  migrations/         # schema versionado (RLS em todas as tabelas)
  seed/               # seed determinístico (gerado)
docs/
```

## Stack
- Next.js (App Router) + TypeScript strict
- pnpm workspaces + Turborepo
- Tailwind CSS 4 (tokens em `packages/ui/src/styles/theme.css`)
- Supabase (PostgreSQL 17, Auth, RLS)
- Vercel · GitHub Actions

## Desenvolvimento local

```bash
# requisitos: Node 22+, pnpm 10 (corepack ready)
pnpm install

# rodar cada app
pnpm dev:store      # http://localhost:3001
pnpm dev:tech       # http://localhost:3002

# qualidade
pnpm lint
pnpm typecheck
pnpm build

# utilitários
pnpm seed:sql       # regenera supabase/seed/seed.sql a partir do JSON
node scripts/generate-icons.mjs   # regenera ícones PWA
```

Configure variáveis copiando `.env.example` → `.env.local` (por app). **Sem credenciais**, os
apps sobem em **modo demonstração**: catálogo embutido (53 SKUs), checkout demo sem cobrança
e nenhum dado gravado — perfeito para desenvolvimento e preview.

## Supabase
Project ref: `eivqvrfsreaopzlvhadu` (sa-east-1, PostgreSQL 17).

```bash
supabase db push                                   # aplica supabase/migrations
psql "$DATABASE_URL" -f supabase/seed/seed.sql     # seed demo
```

> Nunca versionar chaves privadas, service role keys, senhas ou outros segredos. Usar
> variáveis de ambiente na Vercel/GitHub/Supabase. Ver `docs/DATABASE_RLS.md` para o modelo
> de segurança.

## Entidades comerciais
### Brasil
AutoHub360 Brasil — CNPJ 66.991.513/0001-10
Av. Portugal, 1148, Setor Oeste, Goiânia - GO, 74140-020, Brasil.

### Europa
AutoHub360 Europe — operação comercial associada à Auto Lux Europe SAS.
SIREN 924 799 356 · RCS Paris · TVA FR06924799356.
> Dados jurídicos europeus obrigatórios ainda não fornecidos: ver `docs/PRODUCTION_GAPS.md`.
> Checkout europeu permanece desativado até conclusão.

## Contato inicial
WhatsApp Brasil / suporte inicial Europa: +55 (62) 99190-3462

## Diretriz
Um ecossistema, dois frontends e dados compartilhados. Não criar repositório separado
`autohub360-frontend` nesta fase.

## Documentação
- `docs/ARCHITECTURE.md` — decisões de arquitetura
- `docs/ZAI_MASTER_PROMPT_V1.md` — especificação autoritativa V1
- `docs/DATABASE_RLS.md` — modelo de dados e segurança
- `docs/VERCEL_DEPLOYMENT.md` — deploy (2 projetos, mesmos env vars)
- `docs/PRODUCTION_GAPS.md` — pendências reais (nada inventado)

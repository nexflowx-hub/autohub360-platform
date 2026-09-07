# AutoHub360 Platform

Monorepo oficial da plataforma AutoHub360.

## Domínios
- `autohub360.tech` — institucional, conteúdo, serviços, B2B e aquisição.
- `autohub360.store` — e-commerce, catálogo, checkout, conta do cliente, pedidos e instalação.

## Arquitetura alvo

```text
apps/
  tech/      # autohub360.tech
  store/     # autohub360.store
  admin/     # backoffice futuro
  api/       # API/core quando necessário
packages/
  ui/
  config/
  catalog/
  commerce/
  vehicle-fitment/
  auth/
  analytics/
  integrations/
supabase/
  migrations/
  seed/
docs/
```

## Stack alvo
- Next.js + TypeScript
- pnpm workspaces + Turborepo
- Tailwind CSS
- PostgreSQL / Supabase
- Vercel
- GitHub Actions

## Supabase
Project ref: `eivqvrfsreaopzlvhadu`

> Nunca versionar chaves privadas, service role keys, senhas ou outros segredos. Usar variáveis de ambiente na Vercel/GitHub/Supabase.

## Entidades comerciais
### Brasil
AutoHub360 Brasil — CNPJ 66.991.513/0001-10
Av. Portugal, 1148, Setor Oeste, Goiânia - GO, 74140-020, Brasil.

### Europa
AutoHub360 Europe — operação comercial associada à Auto Lux Europe SAS.
SIREN 924 799 356 · RCS Paris · TVA FR06924799356.

## Contato inicial
WhatsApp Brasil / suporte inicial Europa: +55 (62) 99190-3462

## Diretriz
Um ecossistema, dois frontends e dados compartilhados. Não criar repositório separado `autohub360-frontend` nesta fase.

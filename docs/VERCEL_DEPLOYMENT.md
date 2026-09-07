# Vercel Deployment — AutoHub360 Platform

Dois projetos Vercel a partir do **mesmo repositório** (monorepo). Não criar repositório
separado de frontend.

## 1. Projetos

| Projeto | Root Directory | Domínio | App |
|---|---|---|---|
| `AutoHub360 Tech` | `apps/tech` | `autohub360.tech` (+ `www`) | institucional |
| `AutoHub360 Store` | `apps/store` | `autohub360.store` (+ `www`) | comércio |

Opcional futuro: `AutoHub360 Admin` → root `apps/admin` (acesso restrito por allowed deploy
protection/SSO).

## 2. Passo a passo

1. **Importar projeto** (Vercel Dashboard → Add New → Project → `nexflowx-hub/autohub360-platform`).
2. **Root Directory**: `apps/tech` (ou `apps/store`). Vercel detecta Next.js automaticamente.
3. **Build settings** (padrão do Next.js são suficientes):
   - Install: `pnpm install` (Vercel detecta pnpm pelo `packageManager` da raiz)
   - Build: `next build`
4. **Framework preset**: Next.js.
5. **Node.js Version**: 22.x (Settings → General).
6. Repetir para o segundo projeto.
7. **Domínios**: Project → Settings → Domains → adicionar `autohub360.tech` / `autohub360.store`
   e apontar DNS conforme instrução da Vercel (CNAME `cname.vercel-dns.com` ou nameservers).
   Configurar redirect `www` → apex (ou vice-versa) e HTTPS automático.
8. **Git integration**: production branch = `main` (ou a branch que definirem), previews
   automáticos para `feat/*`.

## 3. Variáveis de ambiente

### Comuns aos dois projetos (Settings → Environment Variables)

| Variável | Exemplo | Ambientes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eivqvrfsreaopzlvhadu.supabase.co` | todos |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | chave anônima do projeto Supabase | todos |
| `NEXT_PUBLIC_TECH_URL` | `https://autohub360.tech` | todos |
| `NEXT_PUBLIC_STORE_URL` | `https://autohub360.store` | todos |
| `NEXT_PUBLIC_WHATSAPP_BR` | `5562991903462` | todos |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXX` (opcional) | todos |
| `NEXT_PUBLIC_META_PIXEL_ID` | opcional | todos |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | opcional | todos |

### Apenas Store

| Variável | Uso |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Gravação de pedidos/contatos/leads. Nunca expor no cliente. |
| `PAYMENT_PROVIDER` | `stripe` / `mercadopago` / … quando contratado |
| `PAYMENT_SECRET_KEY` | segredo do PSP (server-only) |
| `PAYMENT_WEBHOOK_SECRET` | verificação de webhook |
| `SHIPPING_PROVIDER` / `SHIPPING_API_KEY` | cotações reais de frete |
| `EMAIL_PROVIDER` / `EMAIL_API_KEY` | e-mails transacionais |

> Sem `PAYMENT_PROVIDER` a loja opera em **modo demonstração** (pedidos não cobram, selos de
> pagamento aparecem como prévia). Sem `SUPABASE_SERVICE_ROLE_KEY` nada é gravado no banco.

## 4. Supabase (uma vez, antes do go-live de compras)

```bash
# com Supabase CLI autenticado e linked ao projeto eivqvrfsreaopzlvhadu
supabase db push        # aplica supabase/migrations/*.sql
psql "$DATABASE_URL" -f supabase/seed/seed.sql   # seed determinístico (opcional/demo)
```

## 5. CI/CD

`.github/workflows/ci.yml` roda `pnpm install`, `lint`, `typecheck`, `build` em push/PR.
Deploys de preview da Vercel são automáticos por branch; production por push na branch de
produção.

## 6. Notas

- `outputFileTracingRoot`: em monorepo pnpm a Vercel resolve automaticamente; local o warning é inofensivo.
- Domínios devem ser adquiridos/configurados pelo dono do projeto — nada é assumido em código.
- Headers de segurança e no-store para checkout/conta já definidos em `next.config.ts` de cada app.

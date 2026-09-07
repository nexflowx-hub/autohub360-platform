# Database & RLS — Security Assumptions

Migrations: `supabase/migrations/*.sql` (PostgreSQL 17, projeto `eivqvrfsreaopzlvhadu`, sa-east-1).
Seed determinístico: `supabase/seed/seed.sql` (gerado por `scripts/generate-seed-sql.mjs` —
UUIDs estáveis via `public.stable_uuid(chave)`).

## Modelo de dados (V1)

- **Mercado/catálogo**: `markets`, `categories`, `brands`, `products`, `product_variants`,
  `product_market_offers`, `product_media`
- **Fitment (diferencial estrutural)**: `vehicles` (tipo/marca) → `vehicle_models` →
  `vehicle_versions` (ano, motor, soquete de farol, CANBUS) + `product_compatibility` (N:N).
  Compatibilidade nunca vive só em texto de descrição.
- **Inventário**: `inventory_locations` (CD Goiás não público; retirada/oficina públicos, só
  cidade/UF), `inventory_items` (saldo e reservado por local)
- **Comércio**: `carts`, `cart_items`, `orders`, `order_items`, `payments`, `shipments`, `coupons`
- **Serviços**: `installation_services`, `appointment_slots` (capacidade/reserva), `appointments`
- **Conteúdo/CRM**: `content_posts`, `leads`, `contact_requests` (protocolo + recibo)
- **Conta**: `profiles` (1:1 `auth.users`, trigger `handle_new_user`), `customer_addresses`,
  `customer_garage`, `favorites`, `reviews`

## Matriz de acesso (RLS habilitada em TODAS as tabelas)

| Superfície | anon | authenticated | service_role (server) |
|---|---|---|---|
| Catálogo publicado, posts, serviços ativos, vagas futuras, cupons ativos | SELECT | SELECT | full |
| `products.cost_cents` | ❌ nunca | ❌ nunca | ✅ |
| Inventário (linhas/locais) | ❌ (apenas `available_stock()` agregado) | ❌ | ✅ |
| `carts`/`cart_items` | token via server (service role) | próprios | ✅ |
| `orders`, `order_items`, `payments`, `shipments`, `appointments` | ❌ | SELECT apenas próprios (via `orders.profile_id = auth.uid()`) | ✅ |
| `addresses`, `garage`, `favorites` | ❌ | CRUD apenas próprios | ✅ |
| `reviews` | SELECT aprovadas | INSERT próprio `status='pending'` | ✅ moderação |
| `leads`, `contact_requests` | INSERT | INSERT | full (leitura p/ equipe) |

## Regras críticas implementadas

1. **Cliente não forja estado pago**: não existem policies de INSERT/UPDATE/DELETE para
   `orders`/`payments` a clientes. Toda mutação passa por rotas de servidor (route handlers)
   que usam `supabaseServiceRole()` apenas quando `SUPABASE_SERVICE_ROLE_KEY` está configurada.
2. **Papéis não vêm de metadata editável**: `profiles.role` só pode ser `'customer'` via
   self-update (CHECK na policy). Elevação é operação de staff via service role.
3. **Custo de produto nunca exposto**: view `catalog_products` (security_invoker=false) omitte
   `cost_cents`; anon/authenticated recebem grant apenas na view.
4. **Estoque seguro**: exposto por função `available_stock(product_id)` (security definer,
   soma `quantity - reserved`), sem revelar locais.
5. **Guest checkout obrigatório**: `orders.profile_id` é nullable; pedidos de convidado são
   recuperáveis por número + e-mail (índice em `lower(customer_email)`).
6. **Webhooks de pagamento**: assinatura verificada no adapter antes de qualquer mudança de
   status (ver `packages/integrations/src/payments.ts`).
7. **Idempotência**: `orders.idempotency_key` unique — retries de checkout não duplicam pedidos.

## Operação

```bash
supabase db push                     # aplica migrations
psql "$DATABASE_URL" -f supabase/seed/seed.sql
```

Novas mudanças de schema SEMPRE via migration versionada — nunca DDL manual em produção.

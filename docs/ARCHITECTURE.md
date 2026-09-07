# AutoHub360 Platform Architecture

## Decision
Use a single monorepo: `nexflowx-hub/autohub360-platform`.

Do not create a separate `autohub360-frontend` repository in V1.

## Apps
- `apps/tech`: public institutional, content, services, B2B and local installation website for `autohub360.tech`.
- `apps/store`: public commerce website for `autohub360.store`.
- `apps/admin`: future operational backoffice.
- `apps/api`: future dedicated API/core only when a separate runtime is justified.

## Shared packages
- `packages/ui`: design system and shared components.
- `packages/config`: lint, TS, environment and shared configuration.
- `packages/catalog`: catalog domain.
- `packages/commerce`: cart, order and checkout domain.
- `packages/vehicle-fitment`: vehicle compatibility model.
- `packages/auth`: shared authentication helpers.
- `packages/analytics`: analytics event contracts.
- `packages/integrations`: payment, shipping, CRM, marketplace and messaging adapters.

## Database
Supabase project ref: `eivqvrfsreaopzlvhadu`.
Region: `sa-east-1`.
PostgreSQL: 17.

All database changes must be represented as versioned migrations under `supabase/migrations`. Never make production-only schema changes without a migration checked into Git.

## Deployment
Create separate Vercel projects from the same repository:
- AutoHub360 Tech -> root directory `apps/tech` -> `autohub360.tech`
- AutoHub360 Store -> root directory `apps/store` -> `autohub360.store`

Future admin/API can be deployed independently from their app roots while preserving a single source repository.

## Security
Never commit secrets, Supabase service-role keys, provider API keys, webhook secrets or database passwords. Public browser configuration must be separated from privileged server configuration.

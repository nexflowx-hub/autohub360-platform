# Z.AI MASTER PROMPT V1 — AutoHub360 Platform

## ROLE
Act as a senior product engineer, UX/UI designer, commerce architect and technical SEO engineer. Build the first production-grade version of the AutoHub360 digital platform. Do not deliver a generic landing page. Deliver two polished public applications sharing one design system, one data model and one repository.

## REPOSITORY — NON-NEGOTIABLE
Repository: `nexflowx-hub/autohub360-platform`
Continue from branch `feat/platform-v1` unless explicitly instructed otherwise.
Do NOT create a separate `autohub360-frontend` repository.
This is a monorepo. The public frontends must live here.

Target structure:

```text
apps/
  tech/       # autohub360.tech
  store/      # autohub360.store
  admin/      # minimal V1 skeleton/future backoffice
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

Use Node.js 22+, pnpm workspaces and Turborepo. Use modern stable Next.js App Router, TypeScript strict mode and Tailwind CSS. Keep shared components in packages rather than duplicating them between apps.

## SUPABASE
Existing project:
- project ref: `eivqvrfsreaopzlvhadu`
- URL: `https://eivqvrfsreaopzlvhadu.supabase.co`
- region: South America / Sao Paulo (`sa-east-1`)

The database is intentionally new/empty. Create versioned SQL migrations under `supabase/migrations`. Create deterministic seed data separately. Never commit service-role keys, passwords, webhook secrets or other credentials. Browser code may only receive publishable/public configuration.

## PRODUCT VISION
AutoHub360 is NOT only an auto-parts website. It is a technology + mobility + smart-living commerce ecosystem born from real automotive electrical/electronic installation experience.

Brand positioning:
- AUTOHUB360
- `Auto • Tech • Smart Living`
- Main proposition: `Tecnologia para o carro, para a casa e para o seu dia.`
- Supporting line: `Tecnologia move melhores caminhos.`

The platform must comfortably sell automotive products today and later expand into electronics, gadgets, smart home, security, energy, mobility and professional/B2B products without looking incoherent.

## VISUAL DIRECTION
Treat the supplied AutoHub360 mockups and brand boards as the visual contract/reference. Reproduce the visual language, hierarchy and premium feeling, but do not paste screenshots into the UI.

Design language:
- deep navy / near-black foundation;
- electric blue as primary technology accent;
- orange as conversion/energy accent;
- white/silver typography and premium highlights;
- restrained glass/metal effects;
- cinematic imagery in hero/marketing sections;
- clean light commerce surfaces in dense product areas where readability is better;
- premium accessible, not luxury-exclusionary;
- automotive + electronics + connected-home visual vocabulary.

Use the FLAT official AutoHub360 logo for navigation, checkout, footer and small UI. The cinematic 3D logo treatment is marketing artwork only, not the primary UI logo. Provide dedicated assets/slots for horizontal logo, stacked logo, orbital icon, favicon and social avatar.

Do not use racing flags, tire-pattern clichés, random supercars, aggressive red/yellow workshop aesthetics or generic dropshipping styling.

Animations should feel refined and lightweight. Respect `prefers-reduced-motion`. Avoid heavy WebGL as a requirement.

## TWO DOMAINS, ONE ECOSYSTEM
### `autohub360.tech`
Purpose: brand authority, institutional information, technology, services, local installation, B2B, editorial/SEO and acquisition.

Required routes/pages:
- `/` Home
- `/auto-mobility`
- `/tech`
- `/smart-living`
- `/energy`
- `/vision-security`
- `/pro`
- `/instalacao-anapolis`
- `/sobre`
- `/hub`
- `/hub/[slug]`
- `/contato`
- `/go` mobile-first link hub for social bios
- legal/compliance pages

Home sections should follow the visual mockup direction:
1. cinematic hero with vehicle + automotive electronics + connected-home products;
2. CTAs `Explorar produtos` and `Instalação em Anápolis`;
3. universe/category cards: Auto, Moto, Truck, Tech, Casa Inteligente, Energy, Segurança/Vision, Pro;
4. explanation of the AutoHub360 ecosystem;
5. automotive technology feature section;
6. Smart Living feature section;
7. Energy feature section;
8. Generoso Auto Center installation section;
9. AutoHub360 Pro/B2B section;
10. editorial articles/guides;
11. trust + contact + newsletter;
12. complete institutional footer.

### `autohub360.store`
Purpose: commerce, catalog, fitment, cart, checkout, account, orders and installation conversion.

Required routes/pages:
- `/` Store home
- `/buscar`
- `/categoria/[slug]`
- `/produto/[slug]`
- `/veiculo`
- `/kits`
- `/ofertas`
- `/carrinho`
- `/checkout`
- `/conta`
- `/conta/pedidos`
- `/pedido/[id]`
- `/instalacao`
- `/atendimento`
- legal/compliance pages

Store navigation:
- AUTO
- MOTO
- TRUCK
- TECH
- CASA INTELIGENTE
- ENERGIA
- SEGURANÇA
- PRO
- OFERTAS

Store home must include:
1. high-conversion hero;
2. prominent search;
3. vehicle fitment selector;
4. universe/category cards;
5. featured products;
6. `Compra + Instalação em Anápolis`;
7. offers;
8. best sellers;
9. Tech/Gadgets block;
10. Smart Home block;
11. Energy block;
12. trust strip: nationwide delivery, local pickup, secure purchase, specialized support;
13. rich footer.

## VEHICLE FITMENT — CORE DIFFERENTIATOR
Implement a structured vehicle selector:
- vehicle type;
- make;
- model;
- year;
- engine/version.

A compatibility relationship must exist in the data model. Never encode fitment only as product-description text.

Data model must support at least:
- `vehicles`
- `vehicle_models`
- `vehicle_versions`
- `product_compatibility`

On product pages show clear states such as:
- compatible with selected vehicle;
- compatibility not confirmed;
- universal product.

Persist a user's selected vehicle locally and, when authenticated, optionally to their profile/garage.

## CATALOG
Create a realistic V1 demo catalog using neutral/generic product naming unless a real supplier/manufacturer relationship is provided. Do not imply official dealership or authorized-reseller relationships that have not been supplied.

Seed categories across:
- automotive lighting;
- electrical/electronics;
- cameras/dashcams;
- tracking/security;
- multimedia/connectivity;
- batteries/boosters/charging;
- moto;
- truck / 12V-24V;
- gadgets;
- charging/cables/power banks;
- smart home;
- cameras/sensors;
- portable energy;
- professional tools/equipment.

V1 preview can use roughly 30-50 high-quality seed SKUs so the experience looks complete. The architecture must support 100-150 launch SKUs and later tens of thousands.

Each product needs:
- slug;
- SKU;
- optional EAN;
- category/brand;
- title/subtitle;
- rich description;
- specifications;
- images/video slots;
- cost field server-only/admin-only;
- market price;
- currency;
- stock;
- weight/dimensions;
- warranty metadata;
- compatibility/universal flag;
- installation eligibility;
- published state.

## PRODUCT PAGE
Build a premium commerce PDP with:
- image/video gallery;
- title, rating placeholder, SKU;
- price and payment summary;
- stock/availability;
- shipping estimator;
- selected-vehicle compatibility;
- `Somente produto` versus `Produto + instalação` when eligible;
- installation schedule CTA;
- specifications;
- description;
- FAQ;
- warranty/returns;
- reviews architecture;
- complementary products;
- kits/bundles;
- share action.

## GENEROSO AUTO CENTER — LOCAL SERVICE PARTNER
Generoso Auto Center remains a distinct physical/service brand and is the initial AutoHub360 installation partner in Anápolis-GO.

Use wording such as:
`Generoso Auto Center — parceiro oficial de instalação AutoHub360 em Anápolis.`

Do NOT invent a CNPJ, exact street number, business hours or other legal/physical details not supplied. Until the complete service address is supplied, expose the city/region and a contact/scheduling CTA without fabricating map coordinates.

Build the flow:
Product -> choose `Produto + instalação` -> identify vehicle -> select installation service -> date/time -> customer details -> payment/reservation -> appointment confirmation.

Also support:
- nationwide shipping;
- local pickup in Anápolis when inventory permits;
- local pickup + installation;
- local delivery as a future configurable method.

## INSTITUTIONAL DATA — BRAZIL
Use the following supplied data exactly, without inventing additional legal information:

`AutoHub360 Brasil`
CNPJ: `66.991.513/0001-10`
Address: `Av. Portugal, 1148, Setor Oeste, Goiânia - GO, CEP 74140-020, Brasil`
WhatsApp/mobile: `+55 (62) 99190-3462`

The corporate address in Goiânia must NOT be presented as the Anápolis installation location.

## INSTITUTIONAL DATA — EUROPE
Brand presentation: `AutoHub360 Europe`.
The contracting/operator entity supplied is:

`Auto Lux Europe SAS`
SIREN: `924 799 356`
RCS: `Paris`
TVA: `FR06924799356`

Use wording such as:
`AutoHub360 Europe is a commercial brand operated by Auto Lux Europe SAS.`

The European registered-office address, share capital, publication director and designated consumer mediator have NOT been supplied. Do not invent them. Track them as production blockers in `docs/PRODUCTION_GAPS.md` and keep European checkout disabled until mandatory legal/operational data is complete.

For the moment, European support can route to the same WhatsApp `+55 (62) 99190-3462`, but the architecture must allow an EU number later.

## MARKET MODEL
Support at least `BR` and `EU` as explicit market contexts.

Brazil is the initial production commerce market. Europe can be preview-ready but must not silently use Brazilian legal/payment/shipping terms.

Do not auto-switch contracting entity invisibly. Geo/language detection may suggest a market, but the active market/operator must be visible and switchable.

Support market-specific:
- operator/legal footer;
- currency (`BRL`, `EUR`);
- prices;
- stock/availability;
- taxes/display rules;
- payment methods;
- shipping methods;
- returns/withdrawal copy;
- legal pages.

Externalize user-facing copy for localization. Primary V1 language: pt-BR. Prepare dictionaries/architecture for French and English rather than scattering hardcoded strings throughout components.

## EMAIL ALIASES / CONTACT ARCHITECTURE
Prepare UI/config for these departmental aliases. Do not assume a mailbox exists unless DNS/email provider is configured.

Institutional/tech:
- `contato@autohub360.tech`
- `comercial@autohub360.tech`
- `pro@autohub360.tech`
- `parcerias@autohub360.tech`
- `privacidade@autohub360.tech`
- `financeiro@autohub360.tech`

Commerce/store:
- `vendas@autohub360.store`
- `pedidos@autohub360.store`
- `suporte@autohub360.store`
- `trocas@autohub360.store`
- `garantia@autohub360.store`
- `reclamacoes@autohub360.store`
- `privacidade@autohub360.store`

Contact forms must be built behind a provider abstraction and include spam/rate-limit protection.

## WHATSAPP
Use `+55 (62) 99190-3462` as the current AutoHub360 contact number.

Do more than a floating WhatsApp button. Create contextual entry points:
- product consultation;
- compatibility help;
- installation scheduling;
- order support;
- B2B/Pro;
- general support.

Pre-fill messages with relevant context such as product SKU/URL or selected vehicle, but do not expose sensitive customer data in the URL.

## SOCIAL
Do not invent social handles that have not been confirmed. Centralize social URLs in configuration/env.

Create `/go` as the official mobile link-in-bio page with:
- Comprar;
- Ofertas;
- Instalação em Anápolis;
- WhatsApp;
- AutoHub360 Pro;
- Sobre;
- social icons.

Generate strong OpenGraph/Twitter-card metadata and image templates for articles/categories/products.

## AUTH / CUSTOMER ACCOUNT
Use Supabase Auth architecture. Guest checkout is mandatory; do not force account creation.

Prepare:
- email/password or passwordless architecture;
- customer profile;
- addresses;
- vehicle garage;
- order history;
- favorites;
- saved cart.

Authorization must not trust editable client metadata for privileged roles.

## DATABASE DOMAIN MODEL
Create normalized migrations for at least:
- profiles/customers;
- addresses;
- markets;
- categories;
- brands;
- products;
- product_variants;
- product_market_offers;
- product_media;
- inventory_locations;
- inventory_items;
- vehicles;
- vehicle_models;
- vehicle_versions;
- product_compatibility;
- carts;
- cart_items;
- orders;
- order_items;
- payments;
- shipments;
- installation_services;
- appointment_slots/appointments;
- coupons/promotions;
- favorites;
- reviews;
- content_posts;
- leads;
- contact_requests.

Use UUIDs and timestamps consistently. Add indexes and constraints. Use RLS deliberately:
- public reads only for published catalog/content as appropriate;
- customers can access only their own private records;
- customers must not directly forge paid order/payment states;
- privileged mutations occur via trusted server paths.

After DDL work, document RLS/security assumptions.

## CART / CHECKOUT
Build a real UI/state flow, not dead buttons.

Checkout stages:
1. cart review;
2. customer/contact;
3. delivery/pickup/installation;
4. address if needed;
5. payment;
6. review and explicit order confirmation;
7. confirmation page.

Support order states and failure/retry UX.

Do not collect/store raw card PAN/CVC. Payment integration must use the selected provider's secure integration.

## PAYMENT ABSTRACTION
No payment provider has been finalized for all markets. Build an adapter contract rather than coupling commerce logic to one gateway.

Prepare interfaces for providers such as Stripe, XPayments or a Brazilian PSP without implementing false credentials.

A provider adapter should support concepts such as:
- create payment/checkout intent;
- confirm/read status;
- webhook verification;
- refund request;
- idempotency;
- normalized payment method/status.

Payment logos must be driven by enabled configuration. Preview may demonstrate Pix/cards, but production must NOT advertise a payment method that is not actually enabled by the active provider/market.

Create a polished footer/checkout payment-method component ready for official Visa, Mastercard, Elo, Pix and other assets as actually enabled.

## SHIPPING / FISCAL ADAPTERS
Prepare adapters/configuration for Brazilian and European logistics. Do not hardcode a single carrier into domain logic.

Brazil architecture should be ready for Correios/aggregator/carriers and local pickup. Europe should remain configurable.

Prepare integration boundaries for fiscal documents/invoicing but do not fabricate fiscal issuance or tax rules without the required provider/accounting configuration.

## LEGAL / COMPLIANCE PAGES — BRAZIL
Create professional, editable and market-aware pages for:
- Terms of Use;
- Terms and Conditions of Sale;
- Privacy / LGPD;
- Cookie Policy;
- Exchanges, Returns and Right of Withdrawal;
- Warranty;
- Delivery and Shipping;
- Payments and Security;
- Customer Service and Complaints;
- Installation and Service Terms;
- Accessibility/contact.

The Brazilian storefront must visibly expose supplier identity, CNPJ, physical/electronic contact details, product/offer information, payment/delivery conditions and an electronic customer-service route.

Implement an online cancellation/withdrawal request path. Brazilian e-commerce copy must reflect the statutory 7-day withdrawal period for qualifying distance purchases. Build immediate receipt acknowledgement for support/cancellation requests and maintain ticket timestamps.

Create a generic `Canal de Reclamações` page/form. Integration with `Consumidor.gov.br` must be configurable and shown only after the company is actually enrolled/eligible; do not fake registration.

## LEGAL / COMPLIANCE — EUROPE / FRANCE
Prepare separate EU/France legal templates and NEVER reuse Brazilian terms as if they applied in Europe.

Create templates for:
- Mentions légales;
- CGV / Terms of Sale;
- Privacy / GDPR;
- Cookie Policy and consent management;
- Delivery/Returns;
- 14-day withdrawal information and model withdrawal form where applicable;
- legal conformity/warranty information;
- customer complaints;
- consumer mediation.

Do not invent the French consumer mediator. Add it as a production blocker until Auto Lux Europe SAS has selected/contracted the competent mediator.

Do not add the obsolete EU ODR-platform link.

A Portuguese `Livro de Reclamações Eletrónico` is NOT to be shown globally just because the business serves Europe. Build an optional market feature flag/URL for it and render it only if a Portuguese operation becomes legally subject to and registered with the service.

## COOKIES / PRIVACY
Implement a real cookie preference component with categories:
- necessary;
- analytics;
- marketing;
- optional personalization.

For EU visitors, non-essential trackers must not run before valid consent. Rejecting must be as easy as accepting, and preferences must be changeable later.

Do not load Meta/TikTok/marketing trackers before consent when consent is required.

Implement privacy-request/contact architecture for access/correction/deletion and related data-subject requests.

## SEO
Implement production-quality technical SEO:
- unique metadata per page;
- canonical URLs;
- sitemap;
- robots;
- OpenGraph;
- structured breadcrumbs;
- Product structured data;
- Organization structured data;
- LocalBusiness structured data only for accurate physical/service locations;
- Article structured data;
- FAQ schema only when matching visible content;
- hreflang/locale architecture for future market languages;
- clean slugs;
- semantic HTML.

Create strong local-search landing architecture for Anápolis without keyword stuffing, e.g. installation of camera, LED, tracker and automotive electronics.

Do not misrepresent the Goiânia corporate address as the Generoso service workshop.

## ANALYTICS
Create a typed analytics event layer independent of a single vendor.

Include events such as:
- `view_item`
- `search`
- `vehicle_selected`
- `fitment_checked`
- `add_to_cart`
- `view_cart`
- `begin_checkout`
- `select_delivery_method`
- `select_installation`
- `purchase`
- `whatsapp_click`
- `lead_pro`
- `contact_submit`

Prepare Google Analytics, Meta Pixel and TikTok Pixel adapters, but do not initialize marketing trackers before permitted consent.

## PWA / MOBILE / PERFORMANCE
Both public apps must be genuinely mobile-first. `autohub360.store` must be installable as a PWA.

Requirements:
- manifest and icons;
- safe caching strategy;
- do NOT cache sensitive checkout/account responses;
- optimized images using Next.js image pipeline;
- lazy loading below the fold;
- no layout shifts caused by media;
- Core Web Vitals focus;
- responsive product grids;
- accessible mobile menus;
- touch-friendly controls.

Target WCAG 2.2 AA where practical: keyboard access, focus states, labels, alt text, contrast, reduced-motion support.

## ADMIN V1
Do not spend the majority of V1 on backoffice. Create only a minimal secure skeleton/placeholders for future:
- dashboard;
- products;
- inventory;
- orders;
- customers;
- installation appointments;
- content;
- promotions.

The public Tech and Store experiences have priority.

## MOCK DATA RULES
Use realistic demonstration data but clearly separate seed/mock content from live operational data.

Do not invent:
- customer testimonials presented as real;
- real transaction volumes;
- fake legal registrations;
- fake partner authorizations;
- fake store addresses;
- fake manufacturer relationships.

If a field required for production is missing, add it to `docs/PRODUCTION_GAPS.md` instead of fabricating it.

## SECURITY
- strict server/client separation;
- validate external input with Zod or equivalent;
- sanitize rich content;
- rate-limit abuse-prone endpoints;
- CSRF-safe patterns where relevant;
- webhook signature verification;
- idempotency for payment/order actions;
- no secrets in client bundles;
- no service-role key in browser code;
- sensible security headers/CSP strategy;
- prevent direct client-side mutation of privileged order/payment states.

## VERCEL DEPLOYMENT
The same GitHub repository should feed separate Vercel projects:
- `AutoHub360 Tech` -> root `apps/tech` -> `autohub360.tech`
- `AutoHub360 Store` -> root `apps/store` -> `autohub360.store`

Do not assume domains are already connected. Document the exact Vercel setup steps and required environment variables.

## CI / QUALITY
Add repository scripts/config so these commands succeed before handoff:
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Add a basic GitHub Actions CI workflow for install/lint/typecheck/build if permissions allow.

No TypeScript errors, broken imports, dead primary CTAs or console errors in the final preview.

## DELIVERABLES
Deliver in Git, not only as pasted code.

Required deliverables:
1. fully scaffolded monorepo;
2. `apps/tech` working and polished;
3. `apps/store` working and polished;
4. shared design system;
5. Supabase migrations + seed;
6. environment example;
7. market/legal configuration;
8. mock catalog and fitment examples;
9. cart/checkout UI flow;
10. installation booking flow;
11. legal/compliance page framework;
12. SEO/PWA/analytics foundations;
13. Vercel deployment documentation;
14. `docs/PRODUCTION_GAPS.md` listing every missing real-world credential/provider/legal field;
15. README with exact local-development commands.

## ACCEPTANCE CRITERIA
The V1 is not accepted if it is merely a single landing page, static screenshot recreation or collection of dead mock buttons.

It is accepted when:
- both domains have distinct but coherent purposes;
- visual quality closely follows supplied AutoHub360 references;
- mobile experience is excellent;
- navigation and major CTAs work;
- catalog/search/product/cart flows work with seeded data;
- vehicle fitment has a real structured model;
- installation flow works through confirmation with demo data;
- Brazilian institutional/legal footer is complete with the supplied data;
- Europe is clearly separated and does not fabricate missing legal information;
- Supabase schema is migration-controlled and RLS-conscious;
- secrets are absent from Git;
- build/lint/typecheck pass;
- the code is committed to `nexflowx-hub/autohub360-platform`.

## EXECUTION METHOD
First inspect the existing repository and current branch. Preserve the architecture files already committed. Then implement in small coherent commits. Do not overwrite working project structure with a one-off generated template.

At the end provide:
- branch name;
- commit SHA(s);
- changed-file summary;
- local run commands;
- required env vars;
- Vercel setup steps;
- Supabase migration status;
- remaining `PRODUCTION_GAPS`;
- preview URLs if deployments were created.

# AutoHub360 Production Resume — 2026-09-10

This marker resumes production deployment after the previous Vercel build-rate limit window.

Rollout order:
1. autohub360.tech
2. autohub360.store
3. admin.autohub360.tech

Production gates after deployment:
- public routes and domains respond normally;
- Tech / Store render the current cinematic UI release;
- Store remains payment-safe until a real PSP is explicitly enabled;
- Admin remains protected until staff authentication/RBAC is complete;
- Supabase schema, RLS and provider credentials are validated before accepting live orders.

Next implementation batch:
- initial real catalogue and supplier sourcing model;
- payment-provider registry and admin routing (Mercado Pago, Stone/Pagar.me, PicPay, Stripe where eligible, static/dynamic Pix, other approved providers);
- lead capture and CRM event model;
- promotional campaigns/offers/events framework;
- insurance editorial article;
- International section in preparation mode.

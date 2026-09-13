import { cookies } from 'next/headers';
import { LockKeyhole } from 'lucide-react';
import { Button, Container } from '@autohub360/ui';

export default async function CheckoutMarketLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const market = cookieStore.get('ah_market')?.value === 'EU' ? 'EU' : 'BR';

  if (market === 'EU') {
    return (
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-surface-200 bg-white p-7 text-center shadow-[var(--ah-shadow-card)] sm:p-9">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ahblue-500/10 text-ahblue-600">
            <LockKeyhole className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink-900">
            Checkout europeu ainda não ativado
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            Esta proteção é intencional: pagamentos em EUR serão liberados somente depois da
            homologação do adquirente, logística, regras fiscais e políticas de devolução do
            mercado europeu.
          </p>
          <Button href="/buscar" className="mt-6">
            Voltar ao catálogo
          </Button>
        </div>
      </Container>
    );
  }

  return children;
}

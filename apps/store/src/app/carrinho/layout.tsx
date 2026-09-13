import { cookies } from 'next/headers';
import { Globe2 } from 'lucide-react';
import { Button, Container } from '@autohub360/ui';

export default async function CartMarketLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const market = cookieStore.get('ah_market')?.value === 'EU' ? 'EU' : 'BR';

  if (market === 'EU') {
    return (
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-surface-200 bg-white p-7 text-center shadow-[var(--ah-shadow-card)] sm:p-9">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ahblue-500/10 text-ahblue-600">
            <Globe2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink-900">
            Carrinho europeu em preparação
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            O catálogo em EUR já está a ser estruturado, mas checkout, logística, impostos e
            devoluções ainda estão em homologação por mercado. Nenhum pedido europeu é capturado
            antes dessa validação.
          </p>
          <Button href="/buscar" className="mt-6">
            Explorar catálogo europeu
          </Button>
        </div>
      </Container>
    );
  }

  return children;
}

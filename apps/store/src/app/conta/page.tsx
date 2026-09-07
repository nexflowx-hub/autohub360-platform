import type { Metadata } from 'next';
import { Container } from '@autohub360/ui';
import { AccountTabs, type AccountTab } from '@/components/account-tabs';

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

const VALID_TABS: AccountTab[] = ['entrar', 'favoritos', 'garagem'];

export const metadata: Metadata = {
  title: 'Minha conta',
  description:
    'Área do cliente AutoHub360: entre ou cadastre-se, acompanhe pedidos, salve favoritos e gerencie a garagem de veículos.',
};

export default async function ContaPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab = VALID_TABS.includes(tab as AccountTab) ? (tab as AccountTab) : 'entrar';

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink-900">Minha conta</h1>
      <p className="mt-1 max-w-2xl text-[15px] text-ink-500">
        Gerencie seus dados, pedidos, favoritos e veículos. Não é preciso conta para comprar — o
        checkout de convidado está sempre disponível.
      </p>

      <div className="mt-8">
        <AccountTabs initialTab={initialTab} />
      </div>
    </Container>
  );
}

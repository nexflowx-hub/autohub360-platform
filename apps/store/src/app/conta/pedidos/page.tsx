'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, MessageCircle, PackageSearch } from 'lucide-react';
import { Button, Card, Container, Field, Input } from '@autohub360/ui';
import { authConfigured, supabaseBrowser } from '@autohub360/auth';
import { whatsappLink } from '@autohub360/config';

interface DemoOrderRow {
  number: string;
  status: string;
  total_cents: number;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Aguardando pagamento',
  paid: 'Pago',
  preparing: 'Em preparação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  canceled: 'Cancelado',
  payment_failed: 'Pagamento não aprovado',
};

export default function ContaPedidosPage() {
  const configured = authConfigured();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<DemoOrderRow[] | null>(null);
  const [lookup, setLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !configured) return;
    const supabase = supabaseBrowser();
    if (!supabase) return;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!data.user) {
          setOrders([]);
          return;
        }
        return supabase
          .from('orders')
          .select('number, status, total_cents, created_at')
          .eq('customer_email', data.user.email ?? '')
          .order('created_at', { ascending: false })
          .then(({ data: rows }) => setOrders((rows as DemoOrderRow[]) ?? []));
      })
      .catch(() => setOrders([]));
  }, [mounted, configured]);

  function onLookup(e: React.FormEvent) {
    e.preventDefault();
    const id = lookup.trim().toUpperCase();
    if (!/^AH\d{10}$/.test(id)) {
      setLookupError('Formato esperado: AH seguido de 10 dígitos (ex.: AH1234567890).');
      return;
    }
    setLookupError('');
    router.push(`/pedido/${id}`);
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink-900">Meus pedidos</h1>
      <p className="mt-1 max-w-2xl text-[15px] text-ink-500">
        Acompanhe o status das suas compras na AutoHub360 Store.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {!mounted ? (
            <Card className="flex items-center justify-center p-10">
              <Loader2 className="h-6 w-6 animate-spin text-ahblue-500" aria-label="Carregando" />
            </Card>
          ) : configured ? (
            orders === null ? (
              <Card className="flex items-center justify-center p-10">
                <Loader2 className="h-6 w-6 animate-spin text-ahblue-500" aria-label="Carregando pedidos" />
              </Card>
            ) : orders.length === 0 ? (
              <Card className="p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-ink-500">
                  <PackageSearch className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-3 font-display text-lg font-extrabold text-ink-900">
                  Nenhum pedido ainda
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-500">
                  Quando você fizer sua primeira compra, ela aparecerá aqui com o status em tempo
                  real.
                </p>
                <Button href="/buscar" className="mt-5">
                  Começar a comprar
                </Button>
              </Card>
            ) : (
              <ul className="flex flex-col gap-3">
                {orders.map((o) => (
                  <li key={o.number}>
                    <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-display text-sm font-extrabold text-ink-900">
                          Pedido {o.number}
                        </p>
                        <p className="text-xs text-ink-500">
                          {new Date(o.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className="rounded-md bg-surface-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                      <p className="font-display font-extrabold text-ink-900">
                        {(o.total_cents / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-lg font-extrabold text-ink-900">
                Acompanhamento por número
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
                A conta do cliente está em configuração nesta vitrine. Enquanto isso, consulte o
                pedido pelo número enviado na confirmação (começa com <strong>AH</strong>), ou fale
                com a equipe — respondemos rápido pelo WhatsApp.
              </p>
              <form onSubmit={onLookup} className="mt-5 flex max-w-md items-end gap-2">
                <Field label="Número do pedido" htmlFor="lookup" error={lookupError} className="flex-1">
                  <Input
                    id="lookup"
                    placeholder="AH1234567890"
                    value={lookup}
                    onChange={(e) => setLookup(e.target.value.toUpperCase())}
                    aria-invalid={Boolean(lookupError)}
                  />
                </Field>
                <Button type="submit" className="h-11">
                  Consultar
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={whatsappLink('order')} variant="outline-dark">
                  <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                  Suporte a pedidos no WhatsApp
                </Button>
              </div>
              <p className="mt-5 text-sm text-ink-500">
                <strong className="text-ink-900">Não é preciso conta para comprar.</strong> O
                checkout de convidado está sempre disponível.
              </p>
            </Card>
          )}
        </div>

        <aside>
          <Card className="p-5">
            <h2 className="font-display text-base font-bold text-ink-900">Onde está meu pedido?</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
              <li>
                <strong>1.</strong> Localize o número do pedido no e-mail de confirmação (ex.: AH1234567890).
              </li>
              <li>
                <strong>2.</strong> Consulte pelo campo acima ou fale no WhatsApp.
              </li>
              <li>
                <strong>3.</strong> Com o envio confirmado, compartilhamos o código de rastreamento
                da transportadora.
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </Container>
  );
}

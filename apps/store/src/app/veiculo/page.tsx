import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, CircleCheck, Info, MessageCircle } from 'lucide-react';
import {
  Button,
  Container,
  ProductCard,
  Section,
  TrustStrip,
} from '@autohub360/ui';
import { whatsappLink } from '@autohub360/config';
import {
  describeVehicle,
  getProductsForVersion,
  getVehicleVersion,
} from '@autohub360/catalog/server';;
import { VehicleSelector } from '@/components/vehicle-selector';

interface Props {
  searchParams: Promise<{ versao?: string }>;
}

export const metadata: Metadata = {
  title: 'Busca por veículo',
  description:
    'Selecione marca, modelo, ano e versão do seu veículo e veja apenas peças e acessórios com compatibilidade confirmada pela base estruturada AutoHub360.',
};

export default async function VeiculoPage({ searchParams }: Props) {
  const { versao } = await searchParams;
  const version = versao ? getVehicleVersion(versao) : undefined;
  const label = version ? describeVehicle(version.id) : '';
  const products = version ? getProductsForVersion(version.id) : [];

  return (
    <>
      <Container className="relative z-10 -mt-7 pt-0 sm:-mt-9">
        <div className="rounded-2xl bg-white p-1 shadow-[var(--ah-shadow-float)] sm:p-2">
          <div className="p-3 sm:p-4">
            <VehicleSelector />
          </div>
        </div>
      </Container>

      {version ? (
        <Section ariaLabel={`Produtos compatíveis com ${label}`} className="bg-surface-50 py-8 sm:py-10">
          <Container>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
                  Compatibilidade confirmada
                </p>
                <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                  Compatíveis com <span className="text-ahblue-600">{label}</span>
                </h1>
                <p className="mt-2 text-[15px] text-ink-500" role="status" aria-live="polite">
                  <strong className="font-display">{products.length}</strong>{' '}
                  {products.length === 1 ? 'produto compatível' : 'produtos compatíveis'} com{' '}
                  {version.name} ({version.yearStart}–{version.yearEnd}, {version.engine}).
                </p>
              </div>
            </div>

            {products.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                {products.map((p) => (
                  <li key={p.id} className="flex">
                    <ProductCard product={p} className="w-full" />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-surface-200 bg-white p-10 text-center">
                <h2 className="font-display text-lg font-extrabold text-ink-900">
                  Ainda não catalogamos itens para esta versão
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
                  Nossa base de compatibilidade cresce a cada semana. Fale com a equipe informando o
                  seu veículo e nós indicamos o produto correto.
                </p>
                <Button
                  href={whatsappLink('fitment', { vehicle: label })}
                  variant="primary"
                  className="mt-5"
                >
                  <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                  Consultar no WhatsApp
                </Button>
              </div>
            )}
          </Container>
        </Section>
      ) : (
        <Section ariaLabel="Como funciona a busca por veículo" className="py-8 sm:py-10">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-xl border border-surface-200 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ahblue-500/10 text-ahblue-600">
                  <Car className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-xl font-extrabold text-ink-900">
                  Comece pela seleção acima
                </h2>
                <ol className="mt-4 space-y-3 text-[15px] text-ink-700">
                  {[
                    'Escolha o tipo do veículo: carro, moto ou caminhão.',
                    'Informe marca, modelo, ano e versão/motorização.',
                    'Veja somente o que tem compatibilidade confirmada.',
                    'Salve o veículo na sua garagem para as próximas compras.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CircleCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Structured fitment explainer — never description-only claims */}
              <aside className="rounded-xl border border-ahblue-500/25 bg-gradient-to-br from-ahblue-500/[0.07] to-white p-6">
                <p className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-900">
                  <Info className="h-5 w-5 text-ahblue-500" aria-hidden="true" />
                  Compatibilidade estruturada, no achismo
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
                  A lista acima não depende da descrição do vendedor: cada produto é vinculado a uma
                  base estruturada de veículos com{' '}
                  <strong>ano, versão, motorização e soquete de farol</strong> quando aplicável.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
                  {[
                    'Soquete (H4, H7, H11, 9005, 9006…) validado para kits e lâmpadas LED.',
                    'Faixa de ano e motorização por versão — não apenas por modelo.',
                    'Itens universais são marcados explicitamente como universais.',
                    'Em caso de dúvida, a equipe confere o encaixe com você pelo WhatsApp.',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ahblue-500" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-ink-500">
                  Prefere navegar por linha?{' '}
                  <Link href="/buscar" className="font-semibold text-ahblue-600 hover:underline">
                    veja todos os produtos da loja
                  </Link>
                  .
                </p>
              </aside>
            </div>
          </Container>
        </Section>
      )}

      <Section ariaLabel="Vantagens da loja" className="bg-white py-8 sm:py-10">
        <Container>
          <TrustStrip
            items={[
              { icon: 'shield', title: 'Encaixe confirmado', subtitle: 'Base estruturada de veículos' },
              { icon: 'truck', title: 'Entrega nacional', subtitle: 'Com rastreamento' },
              { icon: 'pin', title: 'Retirada em Anápolis', subtitle: 'Sem custo de frete' },
              { icon: 'headset', title: 'Suporte especializado', subtitle: 'Antes e depois da compra' },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}

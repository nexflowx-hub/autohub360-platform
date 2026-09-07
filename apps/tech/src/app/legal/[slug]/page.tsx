import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import { Badge, Breadcrumbs, Container } from '@autohub360/ui';
import { LEGAL_DOCS, getLegalDoc, type MarketCode } from '@autohub360/config';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: 'Documento não encontrado' };
  return {
    title: doc.title,
    description: doc.intro.slice(0, 155),
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  const isEU = doc.market === 'EU';
  const marketChip = (doc.market as MarketCode) === 'BR' ? 'Brasil' : 'Europa / França';

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: doc.title }]} />

      <div className="mx-auto mt-6 max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone={isEU ? 'orange' : 'blue'}>{marketChip}</Badge>
          <span className="text-xs text-ink-500">
            Atualizado em{' '}
            {new Date(doc.updated).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
          {doc.title}
        </h1>

        {isEU && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/[0.07] p-4 text-sm leading-relaxed text-amber-800">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              <strong>Documento em preparação.</strong> Este é o modelo jurídico para a operação
              europeia (Auto Lux Europe SAS). Dados obrigatórios ainda não fornecidos aparecem
              como pendências e são acompanhados no registro de gaps de produção. O checkout
              europeu permanece desativado.
            </p>
          </div>
        )}

        <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{doc.intro}</p>

        <div className="mt-8 flex flex-col gap-8">
          {doc.sections.map((section) => (
            <section key={section.heading} aria-label={section.heading}>
              <h2 className="mb-2.5 font-display text-lg font-bold text-ink-900">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-ink-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav aria-label="Documentos legais" className="mt-12 border-t border-surface-200 pt-6">
          <h2 className="mb-3 text-sm font-display font-bold uppercase tracking-wider text-ink-500">
            Outros documentos
          </h2>
          <ul className="flex flex-wrap gap-2">
            {LEGAL_DOCS.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  className={`inline-flex rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    d.slug === doc.slug
                      ? 'border-ahblue-500 bg-ahblue-500 text-white'
                      : 'border-surface-300 bg-white text-ink-700 hover:border-ahblue-400'
                  }`}
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  );
}

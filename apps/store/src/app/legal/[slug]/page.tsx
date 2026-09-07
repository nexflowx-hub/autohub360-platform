import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Breadcrumbs, Container, Section } from '@autohub360/ui';
import { LEGAL_DOCS } from '@autohub360/config';

interface Props {
  params: Promise<{ slug: string }>;
}

/** BR market documents only — the EU set is not published on this store. */
const BR_DOCS = LEGAL_DOCS.filter((d) => d.market === 'BR');

export function generateStaticParams() {
  return BR_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = BR_DOCS.find((d) => d.slug === slug);
  if (!doc) return { title: 'Documento não encontrado' };
  return {
    title: doc.title,
    description: doc.intro.slice(0, 155),
  };
}

export default async function LegalDocPage({ params }: Props) {
  const { slug } = await params;
  const doc = BR_DOCS.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <Container className="pt-4">
        <Breadcrumbs items={[{ label: 'Termos e políticas', href: '/legal/termos-de-uso' }, { label: doc.title }]} />
      </Container>

      <Section ariaLabel={doc.title} className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr]">
            {/* Sidebar with all BR docs */}
            <aside className="order-2 lg:order-1">
              <nav aria-label="Documentos legais" className="lg:sticky lg:top-24">
                <p className="mb-3 text-xs font-display font-bold uppercase tracking-widest text-ink-500">
                  Termos e políticas
                </p>
                <ul className="flex flex-col gap-1">
                  {BR_DOCS.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/legal/${d.slug}`}
                        aria-current={d.slug === doc.slug ? 'page' : undefined}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          d.slug === doc.slug
                            ? 'bg-ahblue-500/10 font-semibold text-ahblue-600'
                            : 'text-ink-700 hover:bg-surface-100'
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-ink-300" aria-hidden="true" />
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Document */}
            <article className="order-1 max-w-3xl lg:order-2">
              <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
                {doc.title}
              </h1>
              <p className="mt-2 text-sm text-ink-500">
                Atualizado em{' '}
                {new Date(`${doc.updated}T12:00:00`).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{doc.intro}</p>

              <div className="mt-8 flex flex-col gap-8">
                {doc.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-lg font-extrabold text-ink-900">
                      {section.heading}
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                      {section.body.map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-[15px] leading-relaxed text-ink-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}

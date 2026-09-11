import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge, Breadcrumbs, Button, Container, Section } from '@autohub360/ui';

export const metadata: Metadata = {
  title: 'Seguro automóvel no Brasil: por que continua importante em 2026',
  description:
    'Entenda por que o seguro automóvel continua relevante no Brasil em 2026, a diferença entre proteção privada e o antigo SPVAT e como funciona a obrigatoriedade em outros países.',
};

export default function SeguroAutomovelPage() {
  return (
    <>
      <Container className="py-5">
        <Breadcrumbs items={[{ label: 'Hub', href: '/hub' }, { label: 'Seguro automóvel no Brasil e exterior' }]} />
      </Container>

      <Section ariaLabel="Artigo sobre seguro automóvel" className="bg-white py-8 sm:py-12">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Badge tone="blue">Segurança & Mobilidade</Badge>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
              Seguro automóvel no Brasil: por que continua importante em 2026
            </h1>
            <p className="mt-5 border-l-4 border-ahblue-500 pl-4 text-lg leading-relaxed text-ink-700">
              No Brasil, a proteção privada do automóvel não é hoje uma exigência geral equivalente ao seguro obrigatório de responsabilidade civil existente em vários países. Ainda assim, colisões, roubo, danos a terceiros e assistência podem transformar um imprevisto de trânsito numa despesa muito elevada.
            </p>

            <div className="mt-9 space-y-9 text-[16px] leading-relaxed text-ink-700">
              <section>
                <h2 className="mb-3 font-display text-2xl font-extrabold text-ink-900">O que aconteceu com o SPVAT?</h2>
                <p>A Lei Complementar nº 207/2024 chegou a instituir o SPVAT, mas foi expressamente revogada pela Lei Complementar nº 211, de 30 de dezembro de 2024. Portanto, em 2026, não existe aquela cobrança geral de SPVAT em vigor nos termos da lei revogada. Isso não deve ser confundido com um seguro automóvel privado contratado para proteger o veículo, o condutor e/ou terceiros.</p>
              </section>

              <section>
                <h2 className="mb-3 font-display text-2xl font-extrabold text-ink-900">Por que o seguro privado continua relevante?</h2>
                <p>O valor real do seguro aparece quando o custo potencial é maior do que o motorista gostaria de suportar sozinho. Uma colisão com outro veículo pode gerar reparos de terceiros; uma perda total pode comprometer um patrimônio importante; roubo e furto têm impacto imediato; e assistência 24 horas reduz o custo e o tempo perdido em panes, reboque e emergências.</p>
                <p className="mt-3">Na comparação de apólices, vale olhar além do preço: responsabilidade civil contra terceiros, colisão, roubo/furto, franquia, carro reserva, vidros, assistência, limites de indenização e exclusões mudam significativamente entre produtos.</p>
              </section>

              <section>
                <h2 className="mb-3 font-display text-2xl font-extrabold text-ink-900">Em vários países a cobertura contra terceiros é obrigatória</h2>
                <p>Na União Europeia, os veículos normalmente baseados nos Estados-Membros devem ter cobertura obrigatória de responsabilidade civil perante terceiros. Em França, a proteção mínima é a responsabilidade civil — o chamado seguro “au tiers”. No Reino Unido, o seguro de terceiros também é o mínimo legal para conduzir em vias públicas.</p>
                <p className="mt-3">A comparação é útil porque mostra duas lógicas diferentes: alguns países impõem uma cobertura mínima de responsabilidade perante terceiros, enquanto coberturas como colisão, roubo e danos próprios continuam sendo adicionais conforme o mercado e o contrato.</p>
              </section>

              <section>
                <h2 className="mb-3 font-display text-2xl font-extrabold text-ink-900">Tecnologia ajuda, mas não substitui seguro</h2>
                <p>Dashcams, rastreadores, alarmes, sensores e câmeras podem reduzir risco, aumentar evidências e ajudar na recuperação ou esclarecimento de incidentes. Porém, nenhum desses recursos substitui uma apólice quando existe perda financeira relevante. O melhor cenário é combinar prevenção, direção responsável e uma cobertura adequada ao perfil do veículo e do motorista.</p>
              </section>
            </div>

            <div className="mt-10 rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
              <ShieldCheck className="h-8 w-8 text-ahblue-400" />
              <h2 className="mt-4 font-display text-xl font-extrabold">Fontes oficiais consultadas</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><a className="hover:text-white hover:underline" href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp211.htm" target="_blank" rel="noreferrer">Presidência da República — Lei Complementar nº 211/2024</a></li>
                <li><a className="hover:text-white hover:underline" href="https://finance.ec.europa.eu/banking/insurance/motor-insurance_en" target="_blank" rel="noreferrer">Comissão Europeia — Motor insurance</a></li>
                <li><a className="hover:text-white hover:underline" href="https://www.service-public.fr/particuliers/vosdroits/F2628" target="_blank" rel="noreferrer">Service-Public.fr — Assurance auto obligatoire</a></li>
                <li><a className="hover:text-white hover:underline" href="https://www.gov.uk/vehicle-insurance" target="_blank" rel="noreferrer">GOV.UK — Vehicle insurance</a></li>
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-slate-400">Conteúdo informativo atualizado em setembro de 2026. Não constitui aconselhamento jurídico, securitário ou recomendação de uma apólice específica.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="https://autohub360.store/categoria/seguranca">Ver tecnologia de segurança <ArrowRight className="h-4 w-4" /></Button>
                <Button href="/hub" variant="outline-light">Voltar ao Hub</Button>
              </div>
            </div>

            <p className="mt-8 text-sm text-ink-500">A AutoHub360 não comercializa seguros neste momento. Para contratar uma apólice, consulte seguradoras ou corretores habilitados e compare as condições do contrato.</p>
            <p className="mt-4 text-sm text-ink-500"><Link href="/internacional" className="font-semibold text-ahblue-600 hover:underline">Veja também a área Internacional da AutoHub360</Link>.</p>
          </article>
        </Container>
      </Section>
    </>
  );
}

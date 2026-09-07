import type { Metadata } from 'next';
import { Briefcase, Handshake, Store, Truck, Wrench, ClipboardList } from 'lucide-react';
import { UniversePage } from '@/components/universe-page';
import { Button } from '@autohub360/ui';
import { whatsappLink } from '@autohub360/config';

export const metadata: Metadata = {
  title: 'AutoHub360 Pro — soluções B2B para oficinas, frotas e revendas',
  description:
    'Condições comerciais dedicadas, curadoria de catálogo, suporte técnico e instalação para frotas. O time AutoHub360 Pro atende oficinas, frotas, revendas e instaladores.',
  alternates: { canonical: '/pro' },
  openGraph: {
    title: 'AutoHub360 Pro — soluções para profissionais e empresas',
    description: 'Oficinas, frotas, revendas e instaladores com condições dedicadas.',
  },
};

export default function ProPage() {
  return (
    <>
      <UniversePage
        path="/pro"
        breadcrumbLabel="AutoHub360 Pro"
        heroOverline="Universo Pro — B2B"
        heroTitle="Soluções para oficinas, frotas e revendas."
        heroSubtitle="Quem trabalha com veículo e tecnologia precisa de parceiro, não de loja genérica. O time AutoHub360 Pro atende empresas e profissionais com condições, curadoria e suporte à altura da operação."
        intro={[
          'Uma oficina precisa de peça que chegue certo na primeira vez. Um gestor de frota precisa de telemetria que funcione em dez veículos, não em um. Uma revenda precisa de margem, giro e fornecedor que não some depois da venda. São necessidades diferentes — e é exatamente por isso que o AutoHub360 Pro existe como operação dedicada, separada do varejo.',
          'O time Pro combina a experiência de instalação que fundou a AutoHub360 com a curadoria do catálogo completo da loja. Isso significa conversar com quem entende o produto, receber recomendação técnica por operação (não por ticket de venda) e contar com suporte que continua depois da nota fiscal.',
          'O primeiro passo é uma conversa: conte o tamanho da sua operação, o que roda na sua oficina ou na sua frota e onde dói hoje. A partir disso montamos a proposta — sem pacote pronto, sem enrolação comercial.',
        ]}
        benefits={[
          'Condições comerciais para volume e revenda',
          'Curadoria de catálogo por perfil de operação',
          'Suporte técnico dedicado e pós-venda de verdade',
          'Instalação e assistência para frotas em Anápolis - GO',
        ]}
        solutionsTitle="Como o time Pro atende"
        solutionsIntro="Cada perfil de cliente Pro tem uma demanda diferente — e um formato de atendimento diferente."
        solutions={[
          {
            title: 'Oficinas mecânicas e elétricas',
            description:
              'Fornecimento recorrente de elétrica 12V, iluminação, multimídia e diagnósticos, com disponibilidade alinhada ao ritmo da oficina e suporte técnico para instalações complexas.',
            icon: Wrench,
          },
          {
            title: 'Frotas e logística',
            description:
              'Rastreamento, telemetria e segurança eletrônica para múltiplos veículos, com projeto de instalação em Anápolis e gestão de equipamentos apoiada pelo nosso time.',
            icon: Truck,
          },
          {
            title: 'Revendas e lojas',
            description:
              'Condições de revenda com margem saudável, catálogo com giro comprovado e reposição planejada — mais parceria de fundo de loja do que relação de pedido.',
            icon: Store,
          },
          {
            title: 'Instaladores e integradores',
            description:
              'Programa para instaladores que usam produto de qualidade: acesso ao catálogo, apoio técnico e indicação de clientes da região através da nossa rede.',
            icon: Handshake,
          },
          {
            title: 'Empresas e instituições',
            description:
              'Equipamentos e acessórios para meios de trabalho, com atendimento por convite de cotação, nota e condições conforme o porte da organização.',
            icon: Briefcase,
          },
          {
            title: 'Projetos sob medida',
            description:
              'Operações com necessidade específica — blindagem eletrônica, monitoramento dedicado, kits personalizados — começam por um desenho técnico com o time Pro.',
            icon: ClipboardList,
          },
        ]}
        faq={[
          {
            question: 'Qual o pedido mínimo para atendimento Pro?',
            answer:
              'Não trabalhamos com um valor fixo de pedido mínimo para abrir a conversa: avaliamos o perfil da operação. Oficinas com compras recorrentes, revendas com volume e frotas com projeto têm formatos diferentes — e a proposta acompanha essa realidade.',
          },
          {
            question: 'Vocês atendem em todo o Brasil?',
            answer:
              'Sim, o fornecimento é feito com envio para todo o Brasil através da loja. O serviço de instalação presencial com o parceiro oficial é realizado em Anápolis e região — para frotas, avaliamos projetos de instalação em conjunto.',
          },
          {
            question: 'Como funciona o suporte técnico para empresas?',
            answer:
              'Clientes Pro têm um canal direto com o time técnico — o mesmo time que orienta a curadoria dos produtos. Isso significa resposta com contexto da sua operação, não um atendimento genérico de e-commerce.',
          },
          {
            question: 'Como inicio o contato com o time Pro?',
            answer:
              'Pelo formulário da página de contato (selecione o departamento "Pro"), pelo e-mail pro@autohub360.tech ou pelo WhatsApp. Conte sobre a sua operação e retornamos com os próximos passos.',
          },
        ]}
        relatedLinks={[
          {
            label: 'Contato',
            description: 'Formulário direto com o departamento Pro.',
            href: '/contato?assunto=pro',
          },
          {
            label: 'Sobre a AutoHub360',
            description: 'A história e os valores por trás do time Pro.',
            href: '/sobre',
          },
          {
            label: 'Instalação em Anápolis',
            description: 'O serviço que dá suporte às operações da região.',
            href: '/instalacao-anapolis',
          },
        ]}
        storeCategorySlug="pro"
        imageKey="scanner"
        ctaNote="Toda proposta Pro começa com uma conversa sobre a sua operação. Use o formulário de contato com o departamento Pro, escreva direto para pro@autohub360.tech ou chame no WhatsApp — o time responde com próximos passos claros."
      />

      {/* Extra B2B CTA band */}
      <section aria-label="Fale com o time Pro" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-ahblue-600 via-ahblue-500 to-ahblue-700 p-6 text-white sm:p-10">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                  Pronto para conversar com o time Pro?
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-blue-50">
                  Conte o tamanho da sua operação e o que você precisa resolver. Em poucos minutos
                  de conversa a gente entende o cenário e devolve um caminho — cotação, visita
                  técnica ou proposta.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/contato?assunto=pro" variant="white" size="lg">
                  Formulário Pro
                </Button>
                <Button href={whatsappLink('pro')} variant="outline-light" size="lg">
                  WhatsApp Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

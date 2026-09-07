import type { Metadata } from 'next';
import {
  Camera,
  Lightbulb,
  MonitorSmartphone,
  Navigation,
  Plug,
  BellRing,
} from 'lucide-react';
import { UniversePage } from '@/components/universe-page';

export const metadata: Metadata = {
  title: 'Auto & Mobility — tecnologia automotiva, multimídia e elétrica 12V',
  description:
    'Multimídia, iluminação LED, rastreamento veicular e elétrica 12V com compatibilidade guiada por veículo, instalação especializada em Anápolis - GO e suporte técnico de quem instala todos os dias.',
  alternates: { canonical: '/auto-mobility' },
  openGraph: {
    title: 'Auto & Mobility — tecnologia automotiva AutoHub360',
    description:
      'Multimídia, LED, rastreamento e elétrica automotiva com curadoria técnica e instalação especializada.',
  },
};

export default function AutoMobilityPage() {
  return (
    <UniversePage
      path="/auto-mobility"
      breadcrumbLabel="Auto & Mobility"
      heroOverline="Universo Auto & Mobility"
      heroTitle="Tecnologia automotiva para dirigir melhor todos os dias."
      heroSubtitle="Multimídia, iluminação LED, rastreamento veicular e elétrica 12V — com compatibilidade guiada por veículo, produtos com garantia e instalação especializada em Anápolis - GO."
      intro={[
        'O carro deixou de ser só motor e chassis: hoje ele é um ambiente conectado, com som, navegação, câmeras e segurança eletrônica fazendo parte da rotina. O problema é que o mercado também encheu de produto genérico, instalado de qualquer jeito, que dura uma temporada. A AutoHub360 nasceu dentro de uma oficina de elétrica e eletrônica automotiva, e é essa experiência que define a nossa curadoria.',
        'Aqui, cada indicação começa pela compatibilidade: soquete do farol, formato do painel, tipo de central, CANBUS do veículo. Você informa o seu carro na loja e recebe apenas o que realmente serve — sem chute, sem devolução desnecessária. E quando o assunto é instalação, o parceiro oficial Generoso Auto Center executa em Anápolis com padrão de fábrica, do passamento do chicote à regulagem do feixe luminoso.',
        'O resultado é simples de explicar: você compra certo, instala certo e usa por muito mais tempo. É a diferença entre equipar o carro e equipar o carro duas vezes.',
      ]}
      benefits={[
        'Compatibilidade guiada pelo seu veículo (marca, modelo, ano e versão)',
        'Produtos com garantia real e suporte técnico humano',
        'Instalação especializada com o parceiro oficial em Anápolis - GO',
        'Entrega para todo o Brasil e retirada local em Anápolis',
      ]}
      solutionsTitle="Soluções automotivas que a gente domina"
      solutionsIntro="Da multimídia à elétrica 12V, são as categorias que mais passam pela bancada — e as que geram mais resultado no dia a dia de quem dirige."
      solutions={[
        {
          title: 'Central multimídia e som',
          description:
            'Centrais com CarPlay e Android Auto, alto-falantes, módulos e microfones. Indicamos o conjunto certo para o seu painel e o seu perfil de uso — da cidade à estrada.',
          icon: MonitorSmartphone,
        },
        {
          title: 'Iluminação LED',
          description:
            'Kits LED com chip alinhado ao filamento original, dissipação eficiente e corte de luz preciso. Com regulagem de farol na instalação, para enxergar mais sem ofuscar ninguém.',
          icon: Lightbulb,
        },
        {
          title: 'Rastreamento veicular',
          description:
            'Rastreadores 4G com app, histórico de rotas e bloqueio remoto. Proteção que cabe no orçamento, com orientação de configuração no pós-venda.',
          icon: Navigation,
        },
        {
          title: 'Câmeras de ré e sensores',
          description:
            'Câmeras HD com visão noturna e linhas guias, sensores de estacionamento e combinações que reduzem de verdade o risco de pequenas colisões.',
          icon: Camera,
        },
        {
          title: 'Alarmes e segurança',
          description:
            'Alarmes com sensor de presença, controle pelo celular e acionamento silencioso. Instalação discreta, sem ruído elétrico e sem falso disparo.',
          icon: BellRing,
        },
        {
          title: 'Elétrica 12V e acessórios',
          description:
            'Tomadas USB, inversores, booster, chicotes e acessórios elétricos com procedência. A parte invisível do carro — que é exatamente onde não pode falhar.',
          icon: Plug,
        },
      ]}
      faq={[
        {
          question: 'Como sei se o produto é compatível com o meu carro?',
          answer:
            'Na loja AutoHub360 você informa marca, modelo, ano e versão do veículo, e o catálogo destaca automaticamente os itens compatíveis — inclusive o soquete correto para kits LED. Em caso de dúvida, a equipe confirma por WhatsApp antes de você fechar o pedido.',
        },
        {
          question: 'A instalação está incluída na compra?',
          answer:
            'Produtos elegíveis podem ser comprados com a opção "Produto + instalação" no checkout da loja, com execução pelo Generoso Auto Center, nosso parceiro oficial em Anápolis - GO. Você escolhe data e horário disponíveis no agendamento.',
        },
        {
          question: 'Vocês atendem quem não é de Anápolis?',
          answer:
            'Sim. A loja entrega para todo o Brasil e o suporte técnico por WhatsApp acompanha você antes e depois da compra. O serviço de instalação presencial hoje é realizado em Anápolis e região.',
        },
        {
          question: 'Kit LED deixa o farol com erro no painel?',
          answer:
            'Depende do veículo e da qualidade do kit. Em carros com CANBUS, kits sem driver com filtro anti-interferência podem gerar erro no painel ou chiado no rádio. Por isso trabalhamos com kits testados e, quando necessário, indicamos a versão com decodificador — sempre considerando o seu modelo.',
        },
      ]}
      relatedLinks={[
        {
          label: 'Vision & Security',
          description: 'Rastreadores, dashcams e monitoramento para o carro e para a casa.',
          href: '/vision-security',
        },
        {
          label: 'Tech',
          description: 'Gadgets e carregamento para usar dentro e fora do carro.',
          href: '/tech',
        },
        {
          label: 'Instalação em Anápolis',
          description: 'Serviços, valores e agendamento com o parceiro oficial.',
          href: '/instalacao-anapolis',
        },
      ]}
      storeCategorySlug="auto"
      imageKey="head-unit"
      ctaNote="Escolha os produtos na loja com filtro por veículo e, se quiser, já inclua a instalação no checkout. Prefere conversar antes? O WhatsApp com a nossa equipe resolve compatibilidade e orçamento em minutos."
    />
  );
}

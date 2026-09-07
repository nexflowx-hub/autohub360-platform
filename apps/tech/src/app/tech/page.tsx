import type { Metadata } from 'next';
import { BatteryFull, Cable, Plug, Speaker, Usb, Watch } from 'lucide-react';
import { UniversePage } from '@/components/universe-page';

export const metadata: Metadata = {
  title: 'Tech — gadgets, carregamento e conectividade',
  description:
    'Carregadores GaN, power banks, som portátil, cabos e acessórios que fazem diferença na rotina. Curadoria técnica AutoHub360 com entrega nacional e suporte especializado.',
  alternates: { canonical: '/tech' },
  openGraph: {
    title: 'Tech — gadgets e eletrônicos AutoHub360',
    description: 'Carregamento rápido, energia portátil e conectividade com curadoria técnica.',
  },
};

export default function TechPage() {
  return (
    <UniversePage
      path="/tech"
      breadcrumbLabel="Tech"
      heroOverline="Universo Tech"
      heroTitle="Gadgets e eletrônicos que simplificam a sua rotina."
      heroSubtitle="Carregamento rápido, energia portátil, som e conectividade — selecionados por quem entende de eletrônica, não por quem só revende caixa."
      intro={[
        'Todo mundo já comprou um acessório que prometia milagre e virou gaveta: cabo que parou de carregar na terceira semana, power bank que entregava metade da capacidade, carregador que esquentava demais. O universo Tech da AutoHub360 existe para acabar com esse ciclo — escolhemos eletrônicos com especificação honesta e desempenho consistente.',
        'Nossa seleção privilegia três coisas: certificações de segurança (proteção contra sobrecarga e superaquecimento), padrões atuais (USB-C Power Delivery, GaN, Quick Charge) e usabilidade real no dia a dia. É o mesmo critério que usamos quando compramos para nós mesmos.',
        'E como eletrônico bom é o que funciona quando você precisa, o suporte não termina na entrega: nossa equipe ajuda a configurar, trocar cabo, entender carga rápida e tirar o máximo do produto — antes e depois da compra.',
      ]}
      benefits={[
        'Produtos com proteção contra sobrecarga e superaquecimento',
        'Padrões atuais: USB-C PD, GaN e carga rápida de verdade',
        'Capacidade e potência anunciadas sobem na prática',
        'Suporte especializado antes e depois da compra',
      ]}
      solutionsTitle="O que você encontra no universo Tech"
      solutionsIntro="Do carregador do carro à estação de trabalho improvisada: eletrônicos para o dia a dia no trânsito, no home office e na viagem."
      solutions={[
        {
          title: 'Carregadores GaN e veiculares',
          description:
            'Carregadores compactos de alta potência para casa e para o carro — notebook, tablet e celular ao mesmo tempo, sem esquentar e sem ocupar espaço.',
          icon: Plug,
        },
        {
          title: 'Power banks',
          description:
            'Modelos de alta capacidade com carga rápida, display de porcentagem e saída para múltiplos dispositivos. Bateria para o dia inteiro — ou a viagem inteira.',
          icon: BatteryFull,
        },
        {
          title: 'Som portátil',
          description:
            'Caixas de som Bluetooth com à prova de respingo, bateria longa e graves que aparecem. Para obra, churrasco, trilha ou apenas para ouvir música como se deve.',
          icon: Speaker,
        },
        {
          title: 'Cabos e conectividade',
          description:
            'Cabos certificados, adaptadores, hubs e extensões USB-C. A base discreta que garante que tudo o resto funcione como prometido.',
          icon: Cable,
        },
        {
          title: 'Acessórios para celular',
          description:
            'Suportes veiculares magnéticos, carregadores sem fio e localizadores Bluetooth. Pequenos itens que resolvem incômodos diários.',
          icon: Watch,
        },
        {
          title: 'USB e energização no carro',
          description:
            'Tomadas USB veiculares, inversores e extensões para transformar o carro em estação de trabalho em reuniões externas e viagens.',
          icon: Usb,
        },
      ]}
      faq={[
        {
          question: 'O que é um carregador GaN e por que ele é melhor?',
          answer:
            'GaN é o material semicondutor (nitreto de gálio) que substituiu o silício nos carregadores modernos. Ele conduz energia com menos perda, o que permite carregadores menores, mais frios e capazes de entregar potências altas — como 65W para notebook e celular ao mesmo tempo.',
        },
        {
          question: 'Power bank de quantos mAh eu preciso?',
          answer:
            'Para o uso diário, 10.000mAh recarregam um celular moderno duas vezes com folga. Para viagens ou dias intensos, 20.000mAh seguram o dia inteiro de uso pesado e ainda carregam um fone. Prefira modelos com display de porcentagem e saída com carga rápida.',
        },
        {
          question: 'Todo cabo USB-C serve para carga rápida?',
          answer:
            'Não. Cabos sem fios adequados limitam a corrente e travam a potência do carregador. Os cabos que vendemos são especificados para carga rápida e dados — e é por isso que um cabo "igual" mais barato rende menos.',
        },
        {
          question: 'Os produtos têm garantia?',
          answer:
            'Sim. Todos os itens da loja têm garantia legal e, na maioria dos eletrônicos, garantia estendida do fabricante. As condições específicas de cada produto aparecem na página dele na loja, e o suporte AutoHub360 acompanha o acionamento.',
        },
      ]}
      relatedLinks={[
        {
          label: 'Smart Living',
          description: 'Leve a tecnologia para dentro de casa: automação, câmeras e luz inteligente.',
          href: '/smart-living',
        },
        {
          label: 'Energy',
          description: 'Estações portáteis e solar para autonomia total.',
          href: '/energy',
        },
        {
          label: '5 gadgets úteis para o dia a dia',
          description: 'Leia o guia no Hub antes de escolher o seu.',
          href: '/hub/cinco-gadgets-uteis-para-o-dia-a-dia',
        },
      ]}
      storeCategorySlug="tech"
      imageKey="gadget"
      ctaNote="Explore o catálogo completo na loja e, se ficar em dúvida entre dois modelos, manda mensagem: a gente compara os dois para o seu caso de uso e indica sem rodeios."
    />
  );
}

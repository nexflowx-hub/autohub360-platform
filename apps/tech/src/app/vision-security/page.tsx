import type { Metadata } from 'next';
import { BellRing, Camera, Cctv, Navigation, ShieldCheck, Video } from 'lucide-react';
import { UniversePage } from '@/components/universe-page';

export const metadata: Metadata = {
  title: 'Vision & Security — rastreamento, dashcams e monitoramento',
  description:
    'Rastreadores veiculares 4G, dashcams, câmeras de segurança residencial e monitoramento. Proteção com instalação especializada e orientação de uso pela equipe AutoHub360.',
  alternates: { canonical: '/vision-security' },
  openGraph: {
    title: 'Vision & Security — segurança e monitoramento AutoHub360',
    description: 'Rastreadores, dashcams e câmeras com instalação especializada.',
  },
};

export default function VisionSecurityPage() {
  return (
    <UniversePage
      path="/vision-security"
      breadcrumbLabel="Vision & Security"
      heroOverline="Universo Vision & Security"
      heroTitle="Segurança e monitoramento para o carro e para a casa."
      heroSubtitle="Rastreadores 4G, dashcams, câmeras e sensores — porque segurança de verdade é a que funciona no dia em que você precisa dela."
      intro={[
        'Segurança é o universo onde produto ruim custa mais caro: o rastreador que fica offline no dia do roubo, a câmera que não enxerga à noite, a dashcam que corrompe o vídeo do acidente. A AutoHub360 seleciona equipamentos de segurança com foco em confiabilidade — porque o pior momento para descobrir que o dispositivo falhou é justamente quando ele era pra agir.',
        'No veículo, a combinação mais eficiente que orientamos é rastreamento + dashcam: o rastreador 4G mostra onde o carro está e permite bloqueio pelo app; a dashcam grava em loop com G-sensor e transforma qualquer discussão de sinistro em evidência objetiva com data e hora. Na casa, câmeras com visão noturna e sensores de abertura nas entradas fazem o papel de presença constante.',
        'E nenhum disso funciona bem mal instalado: cabo pendurado no para-brisa chama atenção, passamento por fora oxida e ruído na imagem aparece na pior hora. Com o parceiro oficial em Anápolis, a instalação é embutida, testada e entregue com orientação de uso do aplicativo — você sai sabendo exatamente como usar o que comprou.',
      ]}
      benefits={[
        'Equipamentos testados com foco em confiabilidade real',
        'Rastreamento 4G com app, histórico e bloqueio remoto',
        'Instalação embutida e discreta pelo parceiro oficial',
        'Orientação de configuração e uso no pós-venda',
      ]}
      solutionsTitle="Camadas de proteção que trabalham juntas"
      solutionsIntro="Do carro estacionado à casa vazia: produtos que se complementam para cobrir os momentos que importam."
      solutions={[
        {
          title: 'Rastreadores veiculares 4G',
          description:
            'Localização em tempo real, histórico de rotas, cerca eletrônica e bloqueio pelo aplicativo. A primeira camada de proteção de qualquer veículo.',
          icon: Navigation,
        },
        {
          title: 'Dashcams',
          description:
            'Gravação em loop, G-sensor que trava o vídeo em impactos e boa performance noturna. Nas câmeras duplas, cobertura da traseira — onde boa parte dos toques acontece.',
          icon: Camera,
        },
        {
          title: 'Câmeras de segurança residencial',
          description:
            'Câmeras Wi-Fi internas e externas com visão noturna, áudio bidirecional e alertas de movimento. A casa monitorada de onde você estiver.',
          icon: Cctv,
        },
        {
          title: 'Sensores e alarmes',
          description:
            'Sensores de abertura em portas e janelas de acesso, alarmes com sensor de presença e notificações imediatas no celular.',
          icon: BellRing,
        },
        {
          title: 'Monitoramento por app',
          description:
            'Centralize câmeras e rastreadores no celular: visualização ao vivo, replay de eventos e compartilhamento de acesso com quem você confiar.',
          icon: Video,
        },
        {
          title: 'Proteção patrimonial',
          description:
            'Soluções para frotas e pequenos negócios, com telemetria e alertas — a versão Pro do universo Vision para quem depende dos ativos.',
          icon: ShieldCheck,
        },
      ]}
      faq={[
        {
          question: 'O rastreador funciona em qualquer carro?',
          answer:
            'Os rastreadores 4G que trabalhamos são compatíveis com veículos 12V e 24V (carros, motos, caminhões) e têm instalação discreta. A configuração do aplicativo é feita com você — e, em Anápolis, instalada e testada pelo parceiro oficial.',
        },
        {
          question: 'Dashcam grava mesmo com o carro desligado?',
          answer:
            'No modo estacionamento, sim — mas a alimentação precisa ser feita com proteção de bateria, para não descarregar o veículo. É um dos motivos para considerar a instalação especializada: o técnico dimensiona o circuito correto.',
        },
        {
          question: 'As imagens das câmeras ficam salvas onde?',
          answer:
            'Depende do modelo: a maioria grava em cartão de memória com sobrescrição automática, e várias oferecem nuvem ou acesso pelo celular para salvar trechos específicos. Indicamos o modelo conforme o que você precisa guardar e por quanto tempo.',
        },
        {
          question: 'Consigo instalar sozinho?',
          answer:
            'Câmeras Wi-Fi de tomada, sim — plugou, conectou no app, funcionou. Rastreador embutido, dashcam com fiação embutida e alarmes pedem instalação profissional para ficarem discretos, seguros e sem ruído elétrico. Em Anápolis, o parceiro oficial faz isso com teste incluído.',
        },
      ]}
      relatedLinks={[
        {
          label: 'Dashcam vale a pena?',
          description: 'O que diz a prática — leia no Hub.',
          href: '/hub/dashcam-vale-a-pena',
        },
        {
          label: 'Auto & Mobility',
          description: 'Multimídia, LED e elétrica para o mesmo veículo.',
          href: '/auto-mobility',
        },
        {
          label: 'AutoHub360 Pro',
          description: 'Frotas e operações com telemetria e condições dedicadas.',
          href: '/pro',
        },
      ]}
      storeCategorySlug="seguranca"
      imageKey="cam-360"
      ctaNote="Monte a proteção em camadas: comece pelo bem mais exposto — o carro ou a entrada de casa. A loja tem os produtos, o WhatsApp tem a orientação e Anápolis tem a instalação especializada."
    />
  );
}

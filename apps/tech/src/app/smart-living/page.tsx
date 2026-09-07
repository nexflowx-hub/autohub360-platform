import type { Metadata } from 'next';
import { Cctv, BellRing, Lightbulb, Mic, Plug, Zap } from 'lucide-react';
import { UniversePage } from '@/components/universe-page';

export const metadata: Metadata = {
  title: 'Smart Living — casa inteligente, câmeras e iluminação',
  description:
    'Automação residencial sem complicação: iluminação inteligente, câmeras, tomadas com medição de consumo e rotinas por voz. Comece a sua casa inteligente com orientação AutoHub360.',
  alternates: { canonical: '/smart-living' },
  openGraph: {
    title: 'Smart Living — casa inteligente AutoHub360',
    description: 'Iluminação, câmeras e automação residencial com guia prático de início.',
  },
};

export default function SmartLivingPage() {
  return (
    <UniversePage
      path="/smart-living"
      breadcrumbLabel="Smart Living"
      heroOverline="Universo Smart Living"
      heroTitle="Uma casa mais confortável, econômica e segura."
      heroSubtitle="Automação residencial começando pelo que importa: luz certa na hora certa, casa monitorada, consumo sob controle e rotinas que trabalham por você."
      intro={[
        'Casa inteligente não precisa começar com obra nem com investimento alto. O caminho que funciona é outro: liste o que te incomoda — luzes acesas à toa, medo de esquecer o ferro ligado, não saber quem está na porta — e resolva um problema por vez, com dispositivos que conversam entre si.',
        'Na AutoHub360 selecionamos produtos de casa inteligente com dois critérios: compatibilidade entre si e com os principais ecossistemas de voz (Alexa, Google e Apple Home), e estabilidade de conexão — porque automação que cai do Wi-Fi não é automação, é frustração. A maioria dos dispositivos que trabalhamos usa a faixa de 2.4GHz justamente pelo alcance.',
        'Se você quer entender o caminho antes de comprar, leia o guia "Casa inteligente: por onde começar sem se perder" aqui do Hub. Ele resume o passo a passo que usamos para orientar clientes todos os dias — do Wi-Fi estável às primeiras rotinas.',
      ]}
      benefits={[
        'Dispositivos compatíveis com Alexa, Google e Apple Home',
        'Economia real de energia com cenas e desligamento automático',
        'Casa monitorada de onde você estiver, pelo celular',
        'Instalação e configuração assistida em Anápolis - GO',
      ]}
      solutionsTitle="Categorias para começar (e evoluir)"
      solutionsIntro="Estas são as categorias com melhor custo-benefício para dar o primeiro passo — e que continuam úteis quando a casa cresce."
      solutions={[
        {
          title: 'Iluminação inteligente',
          description:
            'Lâmpadas Wi-Fi RGB e fitas LED com cenas prontas: "Modo jantar", "Modo cinema", "Boa noite" — que apaga tudo com um comando e economiza no fim do mês.',
          icon: Lightbulb,
        },
        {
          title: 'Câmeras internas e externas',
          description:
            'Câmeras Wi-Fi com áudio, visão noturna e rotação 360°. Fale com quem está em casa, veja o portão e receba alertas de movimento em tempo real.',
          icon: Cctv,
        },
        {
          title: 'Tomadas e interruptores smart',
          description:
            'Tomadas com medição de consumo mostram o que cada aparelho gasta; interruptores touch modernizam o ambiente sem quebrar parede.',
          icon: Plug,
        },
        {
          title: 'Campainhas e vídeo porteiro',
          description:
            'Vídeo porteiro Wi-Fi com câmera e áudio bidirecional: atenda a porta pelo celular, dentro ou fora de casa.',
          icon: BellRing,
        },
        {
          title: 'Controle por voz e rotinas',
          description:
            'Assistentes e hubs que unificam os dispositivos: uma frase inicia a rotina "Saindo de casa" — desliga tomadas, apaga luzes e arma o monitoramento.',
          icon: Mic,
        },
        {
          title: 'Sensores de presença e abertura',
          description:
            'Sensores em portas e janelas de acesso mandam notificação na hora. A camada de segurança silenciosa da casa inteligente.',
          icon: Zap,
        },
      ]}
      faq={[
        {
          question: 'Preciso de central (hub) para começar?',
          answer:
            'Na maioria dos casos, não. Lâmpadas, tomadas e câmeras Wi-Fi se conectam direto ao roteador e ao aplicativo do fabricante. Um hub entra quando a casa cresce, marcas se misturam ou você quer automação local — nesse cenário, um hub com suporte a Matter resolve a integração em um só app.',
        },
        {
          question: 'A casa inteligente aumenta muito a conta de luz?',
          answer:
            'Não — ela tende a reduzir. O consumo dos dispositivos é baixo (alguns watts em espera) e as rotinas de desligamento automático compensam com folga: luzes que apagam sozinhas, tomadas que cortam aparelhos em standby e cenas de economia configuradas.',
        },
        {
          question: 'E se cair a internet, a casa para?',
          answer:
            'Os dispositivos continuam funcionando no modo local para o essencial: interruptores seguem acendendo no toque e tomadas podem ser desligadas manualmente. O que fica indisponível é o controle remoto de fora de casa e as integrações de voz que dependem da nuvem.',
        },
        {
          question: 'Instalar interruptor smart é seguro fazer sozinho?',
          answer:
            'Dispositivos de tomada e lâmpada são plug-and-play. Interruptores touch e vídeo porteiros envolvem fiação — se você não tem familiaridade com elétrica, agende a instalação com a nossa equipe parceira em Anápolis e receba tudo funcionando, com as automações já configuradas.',
        },
      ]}
      relatedLinks={[
        {
          label: 'Casa inteligente: por onde começar',
          description: 'Guia completo no Hub, em linguagem simples.',
          href: '/hub/casa-inteligente-por-onde-comecar',
        },
        {
          label: 'Vision & Security',
          description: 'Para quem quer elevar o nível do monitoramento da casa.',
          href: '/vision-security',
        },
        {
          label: 'Energy',
          description: 'Backup de energia para a casa inteligente não parar.',
          href: '/energy',
        },
      ]}
      storeCategorySlug="casa-inteligente"
      imageKey="smart-home"
      ctaNote="Comece por um cômodo e sinta a diferença na primeira semana. Na loja, você encontra kits prontos para iniciar — e o suporte AutoHub360 acompanha a configuração pelo WhatsApp."
    />
  );
}

import type { Metadata } from 'next';
import { BatteryCharging, House, Plug, Sun } from 'lucide-react';
import { UniversePage } from '@/components/universe-page';

export const metadata: Metadata = {
  title: 'Energy — estações portáteis, solar e backup de energia',
  description:
    'Estações de energia portáteis, placas solares dobráveis e soluções de backup para nunca mais ficar no escuro. Dimensionamento guiado pela equipe AutoHub360.',
  alternates: { canonical: '/energy' },
  openGraph: {
    title: 'Energy — energia portátil e solar AutoHub360',
    description: 'Estações portáteis e placas solares com dimensionamento guiado.',
  },
};

export default function EnergyPage() {
  return (
    <UniversePage
      path="/energy"
      breadcrumbLabel="Energy"
      heroOverline="Universo Energy"
      heroTitle="Energia onde você precisa, na hora que você precisa."
      heroSubtitle="Estações portáteis, placas solares dobráveis e backup para falta de energia — com dimensionamento guiado para você investir no tamanho certo."
      intro={[
        'Falta de energia parou de ser evento raro, e o trabalho deixou de acontecer só dentro de casa. Entre um cenário e outro, a estação de energia portátil virou peça-chave: uma bateria de lítio com inversor embutido, tomadas AC e entradas USB-C que acompanha você no acampamento, na obra, no trailer e no home office ao ar livre — e ainda segura o essencial de casa quando a rede cai.',
        'A pergunta certa nunca é "qual a maior estação que eu compro", e sim "o que eu preciso manter ligado e por quanto tempo". Roteador, luzes e notebook pedem uma coisa; geladeira por um dia inteiro pede outra. Por isso o dimensionamento vem antes da venda: a equipe AutoHub360 faz essa conta com você, pelo WhatsApp, antes de você fechar o pedido.',
        'Para autonomia total, a placa solar dobrável complementa o sistema: em um dia de sol bom, uma placa de 100W recarrega a estação em algumas horas e mantém o ciclo funcionando em acampamentos longos. No uso urbano como backup, a recarga na tomada costuma ser mais prática — a placa entra quando a independência é o objetivo.',
      ]}
      benefits={[
        'Dimensionamento guiado: o que ligar, por quanto tempo e com qual recarga',
        'Estações com bateria LiFePO4, que dura muito mais ciclos',
        'Onda senoidal pura, segura para eletrônicos sensíveis',
        'Backup silencioso para a casa — sem combustível, sem fumaça',
      ]}
      solutionsTitle="Soluções de energia para cada cenário"
      solutionsIntro="Do home office na praia ao blackout no bairro: energia limpa, silenciosa e dimensionada para o seu uso."
      solutions={[
        {
          title: 'Estações de energia portáteis',
          description:
            'De 300Wh para notebook e iluminação até 1kWh+ para geladeira e itens essenciais. Especificações transparentes: capacidade real, potência do inversor e tipos de saída.',
          icon: BatteryCharging,
        },
        {
          title: 'Placas solares dobráveis',
          description:
            'Painéis portáteis de 100W que recarregam a estação em sol pleno. Dobram, carregam no porta-malas e transformam dias de sol em autonomia.',
          icon: Sun,
        },
        {
          title: 'Backup residencial',
          description:
            'Configuração para manter roteador, iluminação e equipamentos essenciais funcionando em faltas de energia — sem barulho e sem depender de combustível.',
          icon: House,
        },
        {
          title: 'Carregadores e inversores',
          description:
            'Inversores veiculares e carregadores de alta potência para completar o sistema: energia do carro para os dispositivos, com proteção da bateria original.',
          icon: Plug,
        },
      ]}
      faq={[
        {
          question: 'Qual a diferença entre uma estação portátil e um nobreak?',
          answer:
            'O nobreak foi feito para ficar parado no mesmo lugar e segurar equipamentos por minutos, até o gerador assumir. A estação portátil foi projetada para mobilidade e uso prolongado: tomadas AC, USB-C, recarga solar e capacidade para horas de uso — dentro e fora de casa.',
        },
        {
          question: 'Como sei qual capacidade (Wh) eu preciso?',
          answer:
            'Some a potência (em watts) do que você quer ligar ao mesmo tempo e multiplique pelas horas de uso. Um notebook consome cerca de 60W; um roteador, 10W; uma geladeira, em média 100–150W com ciclos. Para geladeira por um dia inteiro, pense em estações a partir de 1kWh. Para notebook, roteador e luz, modelos de 300W/288Wh resolvem bem — com peso e preço bem menores.',
        },
        {
          question: 'A estação liga aparelhos de 220V?',
          answer:
            'Depende do modelo: as estações têm inversores de 110V ou 220V conforme a versão, e algumas oferecem saída dupla. Confirme a voltagem dos equipamentos que você pretende ligar — e, em caso de dúvida, a equipe indica o modelo certo pelo WhatsApp.',
        },
        {
          question: 'A placa solar funciona em dia nublado?',
          answer:
            'Funciona, com potência reduzida — nuvens cortam boa parte da irradiação. Para acampamentos, o comum é dimensionar a placa para recarregar com folga em dias bons. Em uso urbano como backup, a recarga na tomada é mais prática e a placa serve de complemento.',
        },
      ]}
      relatedLinks={[
        {
          label: 'Energia solar portátil: quando faz sentido',
          description: 'Leia a análise completa no Hub, sem marketing.',
          href: '/hub/energia-solar-portatil-quando-faz-sentido',
        },
        {
          label: 'Tech',
          description: 'Carregadores e power banks para demandas menores.',
          href: '/tech',
        },
        {
          label: 'Smart Living',
          description: 'Conecte a gestão de energia à casa inteligente.',
          href: '/smart-living',
        },
      ]}
      storeCategorySlug="energia"
      imageKey="power-station"
      ctaNote="Antes de escolher, faça a conta com a gente: manda no WhatsApp o que você quer manter ligado e por quanto tempo. A recomendação chega com capacidade, potência e opções de recarga — sem empurrar o produto mais caro."
    />
  );
}

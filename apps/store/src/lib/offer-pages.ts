export type OfferPage = {
  slug: string;
  status: 'draft' | 'live';
  sku: string;
  imageKey: string;
  eyebrow: string;
  title: string;
  lead: string;
  priceCents: number;
  currency: 'BRL' | 'EUR';
  productName: string;
  benefits: string[];
  proofPoints: Array<{ title: string; text: string }>;
  objections: Array<{ q: string; a: string }>;
  cta: string;
  availabilityNote: string;
};

export const OFFER_PAGES: OfferPage[] = [
  {
    slug: 'smart-tag-localizador',
    status: 'draft',
    sku: 'SRC-BR-TAG-001',
    imageKey: 'tag',
    eyebrow: 'AutoHub360 Track',
    title: 'Encontre o que importa sem perder tempo.',
    lead:
      'Uma tag compacta para ajudar a localizar chaves, mochila, bagagem e outros objetos do dia a dia pelo smartphone.',
    priceCents: 2590,
    currency: 'BRL',
    productName: 'Smart Tag Bluetooth Localizador de Objetos',
    benefits: [
      'Formato compacto para levar em chaves, bolsas e bagagem',
      'Localização e alerta pelo smartphone conforme aplicativo compatível',
      'Sem mensalidade de rastreamento celular neste modelo Bluetooth',
      'Configuração simples após confirmação de compatibilidade do telefone',
    ],
    proofPoints: [
      { title: 'Uso simples', text: 'Pensado para objetos pessoais e situações em que uma tag Bluetooth resolve melhor do que um rastreador veicular com mensalidade.' },
      { title: 'Suporte antes da compra', text: 'A equipe AutoHub360 confirma o ecossistema móvel e o aplicativo adequado antes de liberar o pedido.' },
      { title: 'Sourcing monitorado', text: 'Preço e disponibilidade do fornecedor são revalidados antes da confirmação comercial.' },
    ],
    objections: [
      { q: 'Funciona como GPS com chip?', a: 'Não. Esta oferta é de uma tag Bluetooth/localização por ecossistema compatível. Para rastreamento veicular contínuo, indicamos outra categoria.' },
      { q: 'Funciona em qualquer celular?', a: 'A compatibilidade varia por modelo e aplicativo. Confirmamos isso antes do pedido para evitar compra errada.' },
      { q: 'Posso usar no carro ou moto?', a: 'Pode ser útil para localização de objetos/veículo estacionado em cenários compatíveis, mas não substitui um rastreador GPS/4G dedicado.' },
    ],
    cta: 'Quero confirmar compatibilidade',
    availabilityNote: 'Oferta em preparação comercial. Preço e disponibilidade são confirmados antes do pedido.',
  },
  {
    slug: 'camera-re-1080p',
    status: 'draft',
    sku: 'SRC-BR-CAM-001',
    imageKey: 'rear-cam',
    eyebrow: 'AutoHub360 Vision',
    title: 'Veja melhor antes de engatar a ré.',
    lead:
      'Câmera traseira AHD 1080p para sistemas compatíveis, com formato compacto e instalação especializada disponível em Anápolis.',
    priceCents: 7090,
    currency: 'BRL',
    productName: 'Câmera de Ré 4 Pinos AHD 1080p',
    benefits: [
      'Resolução AHD 1080p anunciada pelo fornecedor',
      'Conector de 4 pinos para sistemas compatíveis',
      'Construção resistente à água conforme especificação da origem',
      'Opção de instalação profissional em Anápolis - GO',
    ],
    proofPoints: [
      { title: 'Compatibilidade primeiro', text: 'Conferimos monitor/DVR, padrão AHD e conector antes de recomendar a instalação.' },
      { title: 'Instalação local', text: 'Em Anápolis, o serviço pode ser agendado com parceiro especializado da AutoHub360.' },
      { title: 'Compra orientada', text: 'Você evita comprar uma câmera aparentemente igual que não conversa com o seu sistema.' },
    ],
    objections: [
      { q: 'Serve em qualquer multimídia?', a: 'Não necessariamente. O equipamento receptor precisa aceitar o sinal e o conector utilizados pelo modelo.' },
      { q: 'A instalação está incluída?', a: 'Não neste preço de referência. Podemos cotar produto + instalação em Anápolis separadamente.' },
      { q: 'Posso instalar sozinho?', a: 'É possível em alguns veículos, mas recomendamos instalação técnica para alimentação, passagem de cabo e vedação corretas.' },
    ],
    cta: 'Quero verificar no meu carro',
    availabilityNote: 'Oferta em preparação comercial. Compatibilidade, preço e disponibilidade são confirmados antes do pedido.',
  },
  {
    slug: 'kit-emergencia-150psi',
    status: 'draft',
    sku: 'SRC-BR-ENE-001',
    imageKey: 'booster',
    eyebrow: 'AutoHub360 Energy',
    title: 'Bateria fraca ou pneu baixo não precisam parar a viagem.',
    lead:
      'Uma solução portátil que combina auxiliar de partida, compressor de até 150 PSI anunciado e power bank para emergências do dia a dia.',
    priceCents: 26590,
    currency: 'BRL',
    productName: 'Jump Starter + Compressor 150 PSI + Power Bank 15.000 mAh',
    benefits: [
      'Auxiliar de partida portátil para cenários compatíveis',
      'Compressor com pressão máxima anunciada de 150 PSI',
      'Power bank integrado e recarga USB-C',
      'Mais autonomia para carro, moto e rotina de estrada',
    ],
    proofPoints: [
      { title: 'Três funções em um equipamento', text: 'Reduz o número de itens de emergência que você precisa carregar no veículo.' },
      { title: 'Orientação técnica', text: 'A AutoHub360 valida tensão, capacidade e aplicação antes de recomendar o produto.' },
      { title: 'Preço monitorado', text: 'A aquisição é revalidada na origem para proteger disponibilidade e margem antes da confirmação.' },
    ],
    objections: [
      { q: 'Liga qualquer motor?', a: 'Não. A capacidade real depende do motor, bateria, temperatura e especificações verificadas do equipamento.' },
      { q: 'O compressor serve para pneus de carro?', a: 'O fornecedor anuncia até 150 PSI, mas tempo de enchimento e uso contínuo variam. Confirmamos os limites antes da venda.' },
      { q: 'É também power bank?', a: 'Sim, o modelo de sourcing prevê essa função, sujeita à confirmação da unidade/variante adquirida.' },
    ],
    cta: 'Quero verificar disponibilidade',
    availabilityNote: 'Oferta em preparação comercial. Especificações, preço e disponibilidade são revalidados antes da confirmação.',
  },
];

export function getOfferPage(slug: string) {
  return OFFER_PAGES.find((offer) => offer.slug === slug);
}

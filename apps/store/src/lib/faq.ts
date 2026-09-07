import type { CatalogProduct } from '@autohub360/catalog';

/** PDP FAQ — only questions whose answers are visible/true for the product. */
export function productFaq(product: CatalogProduct) {
  const faq: Array<{ question: string; answer: string }> = [
    {
      question: 'O produto acompanha garantia?',
      answer: `Sim: ${product.warrantyMonths} meses de garantia contratual, além da garantia legal de 90 dias para vícios ocultos prevista no Código de Defesa do Consumidor.`,
    },
    {
      question: 'Vocês entregam no meu endereço?',
      answer:
        'Enviamos para todo o Brasil. O prazo e o valor do frete são calculados no carrinho a partir do seu CEP, e você também pode optar por retirada em Anápolis - GO quando o item estiver disponível localmente.',
    },
    {
      question: 'Posso devolver se me arrepender?',
      answer:
        'Sim. Você tem até 7 dias corridos após o recebimento para se arrepender de compras feitas fora do estabelecimento comercial (art. 49 do CDC), sem custo. Basta acionar trocas@autohub360.store com o número do pedido.',
    },
  ];

  if (product.installable) {
    faq.push({
      question: 'Como funciona a instalação em Anápolis?',
      answer:
        'Adicione a opção "Produto + instalação" e finalize o pedido. Nossa equipe confirma o agendamento com o parceiro oficial Generoso Auto Center em Anápolis - GO por WhatsApp, conforme sua disponibilidade.',
    });
  }

  if (!product.universal) {
    faq.push({
      question: 'Como sei se é compatível com o meu veículo?',
      answer:
        'Use o seletor de compatibilidade na página do produto informando marca, modelo e versão. Nossa base estruturada confirma o encaixe correto; em caso de dúvida, a equipe responde pelo WhatsApp com o seu veículo informado.',
    });
  }

  return faq;
}

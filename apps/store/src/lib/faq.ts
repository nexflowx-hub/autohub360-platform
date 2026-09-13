import type { CatalogProduct, CatalogMarket } from '@autohub360/catalog';

/** PDP FAQ — only questions whose answers are visible/true for the product and selected market. */
export function productFaq(product: CatalogProduct, market: CatalogMarket = 'BR') {
  if (market === 'EU') {
    const faq: Array<{ question: string; answer: string }> = [
      {
        question: 'O produto já está disponível para compra na Europa?',
        answer:
          'Nem sempre. A AutoHub360 Europe já pesquisa e estrutura preços em EUR, mas checkout, disponibilidade, logística, devoluções e obrigações por mercado permanecem bloqueados até a homologação comercial de cada SKU.',
      },
      {
        question: 'O preço em EUR é definitivo?',
        answer:
          'Não enquanto a oferta estiver em preparação. O valor exibido é uma referência de sourcing e deve ser reconfirmado junto com disponibilidade, impostos aplicáveis e logística antes de uma compra ser habilitada.',
      },
      {
        question: 'Como funcionará a garantia e devolução na Europa?',
        answer:
          'As condições serão publicadas por mercado antes da ativação do checkout europeu, respeitando a legislação de consumo aplicável ao país de venda e a política do operador europeu.',
      },
    ];

    if (!product.universal) {
      faq.push({
        question: 'Como sei se é compatível com o meu veículo?',
        answer:
          'Use as especificações técnicas como referência e confirme a aplicação com nossa equipe antes da compra. A base de compatibilidade está em expansão e não substitui a verificação do veículo e do componente.',
      });
    }
    return faq;
  }

  const faq: Array<{ question: string; answer: string }> = [
    {
      question: 'O produto acompanha garantia?',
      answer:
        'Aplicam-se os direitos previstos na legislação brasileira e eventual garantia contratual do fabricante ou importador somente quando ela estiver identificada e confirmada para o SKU adquirido.',
    },
    {
      question: 'Vocês entregam no meu endereço?',
      answer:
        'A entrega nacional depende da homologação logística e disponibilidade do SKU. Quando a oferta estiver ativa, o prazo e o valor serão informados no carrinho; retirada em Anápolis - GO poderá ser oferecida para itens disponíveis localmente.',
    },
    {
      question: 'Posso devolver se me arrepender?',
      answer:
        'Nas compras online elegíveis, aplicam-se os direitos de arrependimento previstos na legislação brasileira. As instruções e condições ficam publicadas na política de trocas e devoluções do site.',
    },
  ];

  if (product.installable) {
    faq.push({
      question: 'Como funciona a instalação em Anápolis?',
      answer:
        'Quando o serviço estiver disponível para o SKU, a equipe confirma produto, veículo, valor e agendamento com o parceiro oficial em Anápolis - GO antes da execução.',
    });
  }

  if (!product.universal) {
    faq.push({
      question: 'Como sei se é compatível com o meu veículo?',
      answer:
        'Use o seletor como consulta inicial e confirme as especificações do produto e do veículo antes da compra ou instalação. Em caso de dúvida, a equipe valida pelo WhatsApp.',
    });
  }

  return faq;
}

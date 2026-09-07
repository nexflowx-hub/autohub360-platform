/**
 * Market-aware legal content. pt-BR primary.
 * Rules enforced here:
 * - Brazil: statutory 7-day withdrawal (art. 49 CDC) is explicit.
 * - EU/France: 14-day withdrawal templates, NO invented mediator, NO obsolete ODR link.
 * - Missing production data appears as [PENDENTE] markers tracked in docs/PRODUCTION_GAPS.md.
 */

export interface LegalDoc {
  slug: string;
  title: string;
  market: 'BR' | 'EU';
  updated: string;
  intro: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const TECH_PRIV_EMAIL = 'privacidade@autohub360.tech';
const STORE_SUPORTE = 'suporte@autohub360.store';
const STORE_TROCAS = 'trocas@autohub360.store';
const STORE_GARANTIA = 'garantia@autohub360.store';
const STORE_RECLAMACOES = 'reclamacoes@autohub360.store';
const STORE_PRIVACIDADE = 'privacidade@autohub360.store';

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: 'termos-de-uso',
    title: 'Termos de Uso',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Estes Termos de Uso regulam a navegação e utilização dos ambientes digitais AutoHub360 (autohub360.tech e autohub360.store), operados no Brasil pela AutoHub360 Brasil, CNPJ 66.991.513/0001-10. Ao utilizar nossas plataformas você concorda com estes termos e com nossa Política de Privacidade.',
    sections: [
      {
        heading: '1. Aceitação e objeto',
        body: [
          'A AutoHub360 é um ecossistema digital que reúne conteúdo,-commerce de peças, acessórios, eletrônicos e soluções de casa inteligente, além de serviços de instalação realizados por parceiro autorizado. Estes termos aplicam-se a todos os visitantes, clientes cadastrados e visitantes ocasionais.',
          'A navegação no site institucional é gratuita. A compra de produtos e o agendamento de serviços seguem condições específicas, descritas nos Termos e Condições de Venda e nos Termos de Instalação e Serviço.',
        ],
      },
      {
        heading: '2. Uso adequado da plataforma',
        body: [
          'Você se compromete a utilizar a plataforma de boa-fé, sem praticar fraudes, automação abusiva, tentativas de burla a controles de segurança, engenharia reversa de componentes restritos ou qualquer conduta que prejudique outros usuários ou a operação do serviço.',
          'Reservamo-nos o direito de limitar, suspender ou encerrar o acesso em caso de violação destes termos, com comunicação quando aplicável.',
        ],
      },
      {
        heading: '3. Conteúdos e propriedade intelectual',
        body: [
          'Textos, guias, vídeos, marca, logotipo, identidade visual e layouts da AutoHub360 são protegidos por lei. É proibida a reprodução sem autorização prévia e por escrito, salvo citações com atribuição permitidas por lei.',
          'Conteúdos editoriais têm caráter informativo. Especificações de produtos devem ser sempre confirmadas na página do produto e, quando aplicável, no seletor de compatibilidade veicular.',
        ],
      },
      {
        heading: '4. Cadastro e conta',
        body: [
          'O cadastro é opcional para compras: o checkout de convidado (guest checkout) está sempre disponível. Ao criar conta, você declara que os dados informados são verdadeiros e é responsável pela guarda das suas credenciais.',
          'Não utilize senha reutilizada de outros serviços. Podemos solicitar verificação adicional para proteger sua conta.',
        ],
      },
      {
        heading: '5. Limitação de responsabilidade',
        body: [
          'A plataforma é oferecida no estado em que se encontra, com esforço comercialmente razoável de disponibilidade. Não respondemos por indisponibilidades decorrentes de força maior, falhas de infraestrutura de terceiros ou eventos fora de nosso controle razoável.',
          'Nada aqui limita direitos indisponíveis do consumidor previstos no Código de Defesa do Consumidor.',
        ],
      },
      {
        heading: '6. Alterações e contato',
        body: [
          'Estes termos podem ser atualizados a qualquer tempo; a versão vigente estará sempre nesta página com a data de atualização. Alterações relevantes serão sinalizadas na plataforma.',
          'Dúvidas sobre estes termos: contato@autohub360.tech ou WhatsApp +55 (62) 99190-3462.',
        ],
      },
    ],
  },
  {
    slug: 'termos-e-condicoes-de-venda',
    title: 'Termos e Condições de Venda',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Condições aplicáveis à compra de produtos no autohub360.store, operado no Brasil pela AutoHub360 Brasil, CNPJ 66.991.513/0001-10, com atendimento eletrônico e suporte via WhatsApp +55 (62) 99190-3462.',
    sections: [
      {
        heading: '1. Ofertas e preços',
        body: [
          'Os preços são exibidos em reais (BRL) e incluem os tributos aplicáveis, quando exigido pela legislação vigente. Ofertas podem ter prazo ou estoque limitado, e o valor final do pedido é sempre o confirmado no checkout antes do pagamento.',
          'Informações de parcelamento são exibidas na página do produto e no checkout e dependem do provedor de pagamento ativo. Enquanto nenhum provedor estiver contratado, a vitrine opera em modo de demonstração e pedidos reais não são capturados.',
        ],
      },
      {
        heading: '2. Pedido e confirmação',
        body: [
          'O pedido é formalizado após a confirmação do pagamento pelo provedor. Você recebe comprovante eletrônico com número do pedido, itens, valores, forma de entrega e prazo estimado.',
          'Em caso de erro evidente de preço ou indisponibilidade após o pedido, entraremos em contato para confirmar ajuste ou cancelamento integral, com devolução de qualquer valor pago.',
        ],
      },
      {
        heading: '3. Entrega e retirada',
        body: [
          'Enviamos para todo o Brasil. Prazos são estimados a partir da confirmação do pagamento e podem variar por região e disponibilidade. Também oferecemos retirada local em Anápolis - GO mediante agendamento, quando o item estiver disponível no estoque local.',
          'O endereço fiscal da empresa em Goiânia - GO não é ponto de retirada nem local de instalação.',
        ],
      },
      {
        heading: '4. Pagamento e segurança',
        body: [
          'Não coletamos nem armazenamos número completo de cartão (PAN) ou código de verificação (CVC). Todo pagamento é processado diretamente pelo provedor certificado contratado. A disponibilidade de Pix e cartão depende da configuração ativa do provedor no momento da compra.',
        ],
      },
      {
        heading: '5. Direito de arrependimento — 7 dias',
        body: [
          'Conforme o art. 49 do Código de Defesa do Consumidor, você pode se arrepender da compra de produto adquirido fora do estabelecimento comercial em até 7 (sete) dias corridos a contar do recebimento.',
          'Para exercer o direito, escreva para trocas@autohub360.store ou acione o WhatsApp +55 (62) 99190-3462 informando o número do pedido. Devolveremos os valores pagos, inclusive frete inicial quando aplicável, conforme regulação vigente. O produto deve ser devolvido em suas condições originais, salvo disposição em contrário prevista em lei.',
        ],
      },
      {
        heading: '6. Trocas, devoluções e garantia',
        body: [
          'As condições detalhadas de trocas e devoluções constam da página "Trocas, Devoluções e Arrependimento" e as condições de garantia na página "Garantia". Esses documentos integram estas condições de venda.',
        ],
      },
      {
        heading: '7. Foro e legislação',
        body: [
          'Aplica-se a legislação brasileira, em especial o CDC. Fica eleito o foro do domicílio do consumidor para dirimir controvérsias, nos termos da legislação aplicável.',
        ],
      },
    ],
  },
  {
    slug: 'privacidade-lgpd',
    title: 'Política de Privacidade e LGPD',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Esta política explica como a AutoHub360 Brasil, CNPJ 66.991.513/0001-10, trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018). Encarregado de dados: privacidade@autohub360.tech.',
    sections: [
      {
        heading: '1. Dados que tratamos',
        body: [
          'Dados de contato e pedido: nome, e-mail, telefone/WhatsApp, endereço de entrega e histórico de pedidos quando você compra ou solicita atendimento.',
          'Dados veiculares que você informa voluntariamente (marca, modelo, ano, versão) para personalizar compatibilidade e sua garagem digital.',
          'Dados técnicos e de navegação: registros de acesso, cookies e eventos de uso conforme a Política de Cookies, respeitando as preferências de consentimento que você configura.',
        ],
      },
      {
        heading: '2. Finalidades e bases legais',
        body: [
          'Executar pedidos, entregar produtos, prestar suporte e gerenciar instalações agendadas (execução de contrato).',
          'Melhorar experiência, personalizar recomendações e garantir segurança da plataforma (legítimo interesse e, quando aplicável, consentimento).',
          'Cumprir obrigações legais e fiscais, inclusive emissão de documentos fiscais quando a operação estiver configurada (obrigação legal).',
          'Marketing e publicidade somente mediante consentimento, que pode ser revogado a qualquer momento nas preferências de cookies ou pelo canal de privacidade.',
        ],
      },
      {
        heading: '3. Compartilhamento',
        body: [
          'Compartilhamos o mínimo necessário: provedores de infraestrutura (hospedagem/banco de dados), provedor de pagamento, transportadoras/agregadores logísticos e parceiro de instalação apenas para agendar e executar o serviço solicitado.',
          'Não vendemos dados pessoais. Quando utilizamos ferramentas de análise e publicidade, o carregamento dessas ferramentas respeita sua escolha de consentimento.',
        ],
      },
      {
        heading: '4. Seus direitos',
        body: [
          'Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação de dados desnecessários, portabilidade e informação sobre compartilhamentos, além de revogar consentimentos.',
          'Canal do titular: privacidade@autohub360.tech ou privacidade@autohub360.store. Respondemos em prazo compatível com a regulamentação aplicável e registramos cada solicitação com data e protocolo.',
        ],
      },
      {
        heading: '5. Segurança e retenção',
        body: [
          'Aplicamos controles técnicos e administrativos proporcionais: separação de ambientes, princípio do menor privilégio, criptografia em trânsito e proteção de credenciais privilegiadas. Dados são mantidos apenas pelo tempo necessário às finalidades e obrigações legais.',
        ],
      },
      {
        heading: '6. Decisões automatizadas',
        body: [
          'Usamos automação apenas para recomendações e organização de catálogo. Não há decisão automatizada que produza efeito jurídico significativo sobre o titular sem revisão humana.',
        ],
      },
    ],
  },
  {
    slug: 'politica-de-cookies',
    title: 'Política de Cookies',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Explicamos quais cookies e tecnologias similares usamos e como você controla cada categoria. Sua escolha pode ser alterada a qualquer momento no rodapé ("Preferências de cookies").',
    sections: [
      {
        heading: '1. Categorias',
        body: [
          'Necessários: essenciais à navegação, carrinho, checkout e segurança. Não dependem de consentimento.',
          'Análise: estatísticas agregadas de uso (ex.: Google Analytics) — só carregam após consentimento.',
          'Marketing: pixels publicitários (ex.: Meta, TikTok) para medir campanhas — só carregam após consentimento.',
          'Personalização opcional: lembrar preferências como veículo selecionado e filtros — ativados por você.',
        ],
      },
      {
        heading: '2. Como aplicamos sua escolha',
        body: [
          'Nenhum tracker de análise ou marketing é inicializado antes de consentimento válido. Recusar é tão simples quanto aceitar, e a recusa não degrada funcionalidades essenciais.',
          'Cookies necessários têm prazo compatível com a função (sessão ou persistência curta). Preferências de consentimento ficam registradas para auditoria.',
        ],
      },
      {
        heading: '3. Contato',
        body: ['Dúvidas sobre cookies: privacidade@autohub360.tech.'],
      },
    ],
  },
  {
    slug: 'trocas-devolucoes-arrependimento',
    title: 'Trocas, Devoluções e Arrependimento',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Condições de troca, devolução e exercício do direito de arrependimento nas compras no autohub360.store. Canal dedicado: trocas@autohub360.store · WhatsApp +55 (62) 99190-3462.',
    sections: [
      {
        heading: '1. Arrependimento em 7 dias corridos',
        body: [
          'Você pode desistir de compras realizadas fora do estabelecimento comercial em até 7 (sete) dias corridos do recebimento, sem justificativa e sem custo (art. 49 do CDC).',
          'Como exercer: envie e-mail para trocas@autohub360.store com número do pedido e declaração expressa de arrependimento, ou solicite pelo WhatsApp. Você receberá recibo imediato de protocolo. Orientaremos a devolução e estornaremos todos os valores, inclusive frete, conforme lei.',
        ],
      },
      {
        heading: '2. Desistência antes do envio',
        body: [
          'Se o pedido ainda não foi despachado, o cancelamento é imediato e integral. Se já estiver em trânsito, aplicamos o fluxo de devolução ao receber o item, com recusa de recebimento também aceita quando comunicada.',
        ],
      },
      {
        heading: '3. Produto com defeito',
        body: [
          'Produtos com defeito de qualidade são trocados ou reparados conforme arts. 18 a 20 do CDC: prazos legais de 30 dias para vício aparente de produto não durável e 90 dias para durável, contados do recebimento, salvo garantia contratual maior do fabricante.',
          'Abra a solicitação com número do pedido, vídeos ou fotos quando possível e descrição do problema. O mesmo canal atende itens avariados no transporte.',
        ],
      },
      {
        heading: '4. Requisitos gerais',
        body: [
          'Devoluções devem incluir embalagem original, acessórios, manuais e nota/comprovante. Itens instalados, danificados por uso indevido ou sem componentes podem ter a análise técnica prejudicada — neste caso informaremos as opções disponíveis.',
        ],
      },
      {
        heading: '5. Prazos de estorno',
        body: [
          'Após o recebimento e conferência do item, o estorno é solicitado ao provedor de pagamento. Cartão: prazo conforme operadora (geralmente 1 a 2 faturas). Pix/boleto: devolução via dados bancários informados, em até 10 dias úteis após conferência.',
        ],
      },
    ],
  },
  {
    slug: 'garantia',
    title: 'Garantia',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Política de garantia para produtos comercializados pela AutoHub360. Canal: garantia@autohub360.store.',
    sections: [
      {
        heading: '1. Garantia legal e contratual',
        body: [
          'Todos os produtos contam com garantia legal de 90 dias para vícios ocultos ou não aparentes, conforme CDC, além da garantia contratual do fabricante quando indicada na página do produto (ex.: 3, 6 ou 12 meses).',
          'A garantia contratual começa na entrega do produto e é acionada diretamente pela AutoHub360, que intermedia com o fabricante/importador.',
        ],
      },
      {
        heading: '2. O que cobre',
        body: [
          'Defeitos de fabricação, componentes e funcionamento dentro do uso normal especificado. A análise é feita por nossa equipe técnica ou do parceiro de instalação quando o item foi instalado por ele.',
        ],
      },
      {
        heading: '3. O que não cobre',
        body: [
          'Mau uso, instalação incorreta feita por terceiros não autorizados, oxidação por agentes externos, descarga elétrica, acidentes, modificações não especificadas, desgaste natural e uso fora das especificações técnicas publicadas.',
        ],
      },
      {
        heading: '4. Como acionar',
        body: [
          'Envie e-mail para garantia@autohub360.store com número do pedido, descrição do defeito e mídia quando possível. Emitimos protocolo imediato e orientamos o envio para análise ou agendamos verificação em Anápolis - GO quando aplicável.',
        ],
      },
    ],
  },
  {
    slug: 'entrega-e-frete',
    title: 'Entrega e Frete',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Condições de envio para todo o Brasil, retirada local e integração com instalação em Anápolis - GO.',
    sections: [
      {
        heading: '1. Cobertura e prazos',
        body: [
          'Enviamos para todo o território nacional. O prazo estimado é calculado no checkout a partir do CEP informado e começa a contar após a confirmação do pagamento. Acompanhe o status pelo e-mail, WhatsApp ou página do pedido.',
        ],
      },
      {
        heading: '2. Frete',
        body: [
          'O valor do frete é calculado por peso, dimensões e destino, exibido antes da conclusão do pedido. Campanhas de frete grátis podem ser oferecidas em valores mínimos definidos nas ofertas vigentes.',
        ],
      },
      {
        heading: '3. Retirada local em Anápolis',
        body: [
          'Itens com disponibilidade local podem ser retirados mediante agendamento prévio em Anápolis - GO. Você recebe confirmação com o horário e as instruções. Não mantemos balcão de vendas no endereço corporativo de Goiânia.',
        ],
      },
      {
        heading: '4. Instalação com o parceiro',
        body: [
          'Ao optar por "Produto + instalação", coordenamos a entrega/retirada com o agendamento na oficina parceira Generoso Auto Center em Anápolis - GO, evitando deslocamentos desnecessários.',
        ],
      },
      {
        heading: '5. Avarias e extravio',
        body: [
          'Inspecione a embalagem no recebimento. Avarias visíveis devem ser recusadas ou registradas em até 48h no canal de suporte. Extravios em trânsito são repostos ou estornados integralmente.',
        ],
      },
    ],
  },
  {
    slug: 'pagamentos-e-seguranca',
    title: 'Pagamentos e Segurança',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Como funcionam pagamentos e as medidas de segurança da AutoHub360. O selo de métodos exibido no rodapé reflete apenas provedores efetivamente habilitados.',
    sections: [
      {
        heading: '1. Formas de pagamento',
        body: [
          'Trabalhamos com Pix e cartões de crédito das principais bandeiras, sempre por meio de provedor de pagamento certificado (PSP). A disponibilidade real depende do provedor ativo configurado na loja; enquanto não houver provedor contratado, a vitrine opera em modo de demonstração.',
        ],
      },
      {
        heading: '2. Segurança dos dados de pagamento',
        body: [
          'Não coletamos nem armazenamos PAN completo ou CVC. Os dados de cartão são digitados diretamente no ambiente seguro do provedor (tokenização). Todo tráfego é criptografado (TLS) e integrações de webhook são verificadas por assinatura.',
        ],
      },
      {
        heading: '3. Antifraude e limites',
        body: [
          'Pedidos podem passar por verificação antifraude do provedor, com contato prévio em caso de pendência. Mantemos limites e idempotência nas operações de pagamento para evitar cobranças duplicadas.',
        ],
      },
      {
        heading: '4. Comprovantes e notas',
        body: [
          'Comprovantes de pagamento são enviados por e-mail. A emissão de documentos fiscais será habilitada conforme configuração contábil/fiscal da operação (ver notas de produção no site).',
        ],
      },
    ],
  },
  {
    slug: 'atendimento-e-reclamacoes',
    title: 'Atendimento e Canal de Reclamações',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Canais oficiais de atendimento ao consumidor da AutoHub360 no Brasil e como registrar uma reclamação formal.',
    sections: [
      {
        heading: '1. Canais de atendimento',
        body: [
          'WhatsApp: +55 (62) 99190-3462 (segunda a sábado, horário comercial).',
          'E-mails por assunto: vendas@autohub360.store (compras), pedidos@autohub360.store (status de pedido), suporte@autohub360.store (suporte técnico), trocas@autohub360.store (trocas e arrependimento), garantia@autohub360.store (garantia).',
        ],
      },
      {
        heading: '2. Canal de Reclamações',
        body: [
          'Reclamações formais devem ser registradas no formulário "Canal de Reclamações" ou pelo e-mail reclamacoes@autohub360.store. Todo contato recebe recibo imediato com número de protocolo e data, e é tratado conforme nosso fluxo interno de resposta.',
        ],
      },
      {
        heading: '3. Órgãos de defesa do consumidor',
        body: [
          'Você pode recorrer aos órgãos de defesa do consumidor, como o Procon de sua localidade. A AutoHub360 se compromete a responder às demandas encaminhadas por esses canais.',
          'Integração com plataformas de autocomposição (ex.: Consumidor.gov.br) será exibida aqui apenas após a efetiva adesão da empresa.',
        ],
      },
    ],
  },
  {
    slug: 'termos-de-instalacao',
    title: 'Termos de Instalação e Serviço',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Condições dos serviços de instalação realizados pelo parceiro oficial Generoso Auto Center em Anápolis - GO.',
    sections: [
      {
        heading: '1. Parceria de instalação',
        body: [
          'Instalações de produtos AutoHub360 são realizadas pela Generoso Auto Center, parceiro oficial em Anápolis - GO. A AutoHub360 coordena o agendamento; a execução técnica é de responsabilidade do parceiro.',
        ],
      },
      {
        heading: '2. Agendamento',
        body: [
          'Após escolher "Produto + instalação", você indica o veículo, o serviço, data e horário disponíveis e seus dados de contato. A vaga é confirmada por WhatsApp/e-mail. Remarcações são gratuitas com antecedência mínima de 12 horas.',
        ],
      },
      {
        heading: '3. Responsabilidades',
        body: [
          'O cliente deve entregar o veículo no horário combinado com condições de acesso e documentos quando necessário. O parceiro executa o serviço conforme especificações do fabricante e devolve o veículo com teste funcional.',
          'Danos preexistentes devem ser apontados antes da execução. Garantia de mão de obra é fornecida pelo parceiro e informada no comprovante do serviço.',
        ],
      },
      {
        heading: '4. Cancelamento e atrasos',
        body: [
          'Cancelamentos sem custo até 12 horas antes. Atrasos do cliente superiores a 30 minutos podem reagendar a vaga. Atrasos operacionais do parceiro serão comunicados imediatamente com nova proposta de horário.',
        ],
      },
    ],
  },
  {
    slug: 'acessibilidade-contato',
    title: 'Acessibilidade e Contato',
    market: 'BR',
    updated: '2026-09-01',
    intro:
      'Nosso compromisso com acessibilidade digital e como falar com a AutoHub360.',
    sections: [
      {
        heading: '1. Compromisso de acessibilidade',
        body: [
          'Buscamos conformidade progressiva com as diretrizes WCAG 2.2 nível AA: navegação por teclado, contraste adequado, textos alternativos, foco visível e suporte a preferências de movimento reduzido.',
          'Encontrou uma barreira de acesso? Informe contato@autohub360.tech com a página e a descrição do problema — tratamos como prioridade.',
        ],
      },
      {
        heading: '2. Contato institucional',
        body: [
          'AutoHub360 Brasil — CNPJ 66.991.513/0001-10 — Av. Portugal, 1148, Setor Oeste, Goiânia - GO, CEP 74140-020, Brasil.',
          'WhatsApp: +55 (62) 99190-3462 · contato@autohub360.tech · comercial@autohub360.tech · pro@autohub360.tech · parcerias@autohub360.tech.',
        ],
      },
    ],
  },
  {
    // ===== EU / FRANCE TEMPLATES — PRODUCTION BLOCKERS TRACKED, NOTHING FABRICATED =====
    slug: 'eu-mentions-legales',
    title: 'Mentions légales (modèle UE — en préparation)',
    market: 'EU',
    updated: '2026-09-01',
    intro:
      'AutoHub360 Europe est une marque commerciale exploitée par Auto Lux Europe SAS — SIREN 924 799 356 · RCS Paris · TVA FR06924799356. Les mentions légales définitives dépendent de données non encore fournies.',
    sections: [
      {
        heading: 'Éditeur du site',
        body: [
          'Auto Lux Europe SAS — SIREN 924 799 356 — RCS Paris — TVA FR06924799356.',
          'Siège social : [PENDENTE — endereço da sede não fornecido]. Capital social : [PENDENTE]. Directeur de la publication : [PENDENTE].',
        ],
      },
      {
        heading: 'Hébergement',
        body: ['Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA.'],
      },
      {
        heading: 'Médiation de la consommation',
        body: [
          'Conformément au Code de la consommation, le médiateur de la consommation compétent sera désigné par Auto Lux Europe SAS. [PENDENTE — médiateur non encore désigné. Bloqueur de production.]',
        ],
      },
      {
        heading: 'Statut commercial',
        body: [
          'Le checkout européen reste désactivé tant que les informations juridiques, de paiement et logistiques obligatoires ne sont pas complètes. Aucune vente n\'est conclue depuis ce marché en préversion.',
        ],
      },
    ],
  },
  {
    slug: 'eu-cgv',
    title: 'CGV / Conditions Générales de Vente (modèle UE — en préparation)',
    market: 'EU',
    updated: '2026-09-01',
    intro:
      'Modèle de conditions générales de vente pour AutoHub360 Europe (opéré par Auto Lux Europe SAS). Document non définitif : la vente n\'est pas active sur le marché européen.',
    sections: [
      {
        heading: 'Droit de rétractation — 14 jours',
        body: [
          'Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose d\'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation, sans motif.',
          'Formulaire type de rétractation et modalités de retour seront publiés avec les CGV définitives. [PENDENTE — CGV finales en préparation.]',
        ],
      },
      {
        heading: 'Prix, paiement et livraison',
        body: [
          'Prix en euros TTC selon réglementation applicable. Moyens de paiement et transporteurs seront définis avec les partenaires définitifs. [PENDENTE.]',
        ],
      },
      {
        heading: 'Garantie légale de conformité',
        body: [
          'Les produits bénéficieront de la garantie légale de conformité (art. L217-3 et suivants) et de la garantie contre les vices cachés. Conditions détaillées avec les CGV définitives. [PENDENTE.]',
        ],
      },
    ],
  },
  {
    slug: 'eu-rgpd',
    title: 'Confidentialité / RGPD (modèle UE — en préparation)',
    market: 'EU',
    updated: '2026-09-01',
    intro:
      'Politique de confidentialité préparée pour AutoHub360 Europe (opéré par Auto Lux Europe SAS) conformément au RGPD (UE) 2016/679. Version définitive à la complétion des données juridiques.',
    sections: [
      {
        heading: 'Responsable de traitement',
        body: [
          'Auto Lux Europe SAS — SIREN 924 799 356 — RCS Paris. Contact privacy : [PENDENTE — boîte privacy EU à définir].',
        ],
      },
      {
        heading: 'Vos droits',
        body: [
          'Accès, rectification, effacement, limitation, opposition, portabilité et retrait du consentement à tout moment. Réclamation possible auprès de la CNIL une fois l\'opération européenne active.',
        ],
      },
      {
        heading: 'Cookies et consentement',
        body: [
          'Aucun traceur non essentiel n\'est chargé avant consentement valide. Le refus est aussi simple que l\'acceptation et les préférences sont modifiables à tout moment.',
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}

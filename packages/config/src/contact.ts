import type { MarketCode } from './markets';

/** Departmental email aliases — UI/config only. Mailbox existence depends on DNS/provider setup (see PRODUCTION_GAPS). */
export const EMAIL_ALIASES = {
  tech: {
    contato: 'contato@autohub360.tech',
    comercial: 'comercial@autohub360.tech',
    pro: 'pro@autohub360.tech',
    parcerias: 'parcerias@autohub360.tech',
    privacidade: 'privacidade@autohub360.tech',
    financeiro: 'financeiro@autohub360.tech',
  },
  store: {
    vendas: 'vendas@autohub360.store',
    pedidos: 'pedidos@autohub360.store',
    suporte: 'suporte@autohub360.store',
    trocas: 'trocas@autohub360.store',
    garantia: 'garantia@autohub360.store',
    reclamacoes: 'reclamacoes@autohub360.store',
    privacidade: 'privacidade@autohub360.store',
  },
} as const;

export const WHATSAPP_NUMBER = '+55 (62) 99190-3462';
export const WHATSAPP_DIGITS = '5562991903462';

export type WhatsAppContext =
  | 'general'
  | 'product'
  | 'fitment'
  | 'installation'
  | 'order'
  | 'pro'
  | 'support';

/** Builds a contextual WhatsApp deep link. Never include sensitive customer data. */
export function whatsappLink(
  context: WhatsAppContext,
  options: { product?: string; sku?: string; url?: string; vehicle?: string; market?: MarketCode } = {},
): string {
  const base = `https://wa.me/${WHATSAPP_DIGITS}`;
  const parts: string[] = [];
  switch (context) {
    case 'product':
      parts.push('Olá! Tenho interesse no produto:');
      if (options.product) parts.push(`*${options.product}*`);
      if (options.sku) parts.push(`SKU: ${options.sku}`);
      if (options.url) parts.push(options.url);
      break;
    case 'fitment':
      parts.push('Olá! Preciso de ajuda para verificar compatibilidade.');
      if (options.vehicle) parts.push(`Veículo: ${options.vehicle}`);
      if (options.product) parts.push(`Produto: ${options.product}`);
      break;
    case 'installation':
      parts.push('Olá! Quero agendar uma instalação em Anápolis.');
      if (options.product) parts.push(`Produto: ${options.product}`);
      break;
    case 'order':
      parts.push('Olá! Preciso de ajuda com um pedido.');
      break;
    case 'pro':
      parts.push('Olá! Quero conhecer as soluções AutoHub360 Pro para empresas.');
      break;
    case 'support':
      parts.push('Olá! Preciso de suporte AutoHub360.');
      break;
    default:
      parts.push('Olá! Vim pelo site da AutoHub360.');
  }
  if (options.market === 'EU') {
    parts.push('(Via AutoHub360 Europe)');
  }
  return `${base}?text=${encodeURIComponent(parts.join(' '))}`;
}

/** Social URLs are centralized here. Only confirmed handles; empty string = not yet confirmed. */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/autohub360',
  facebook: 'https://www.facebook.com/autohub360',
  youtube: 'https://www.youtube.com/@autohub360',
  tiktok: '',
} as const;

import 'server-only';
import { supabaseServiceRole } from '@autohub360/auth/server';

export function adminDb() {
  return supabaseServiceRole();
}

export function formatMoney(cents: number | null | undefined, currency = 'BRL') {
  return ((cents ?? 0) / 100).toLocaleString(currency === 'EUR' ? 'pt-PT' : 'pt-BR', {
    style: 'currency',
    currency,
  });
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export function shortId(value: string | null | undefined) {
  return value ? value.slice(0, 8).toUpperCase() : '—';
}

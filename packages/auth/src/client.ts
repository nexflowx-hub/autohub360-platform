import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@autohub360/config';

/** Browser Supabase client (publishable key only). Returns null when auth is not configured. */
export function supabaseBrowser() {
  if (!ENV.supabasePublishableKey) return null;
  return createBrowserClient(ENV.supabaseUrl, ENV.supabasePublishableKey);
}

export function authConfigured(): boolean {
  return Boolean(ENV.supabasePublishableKey);
}

/**
 * Authorization rule (see docs/DATABASE_RLS.md):
 * privileged roles are NEVER derived from client-editable metadata.
 * Server code must verify claims from auth.users + profiles table via service role.
 */
export type AppRole = 'customer' | 'staff' | 'admin';

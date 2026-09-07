import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '@autohub360/config';

/** Server Supabase client scoped to the request cookies (RLS-aware). Returns null when unconfigured. */
export async function supabaseServer(): Promise<SupabaseClient | null> {
  if (!ENV.supabasePublishableKey) return null;
  const cookieStore = await cookies();
  return createServerClient(ENV.supabaseUrl, ENV.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot mutate cookies — safe to ignore here.
        }
      },
    },
  });
}

/** Service-role client for trusted server paths only (orders, payments, webhooks). Never import client-side. */
export function supabaseServiceRole(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(ENV.supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

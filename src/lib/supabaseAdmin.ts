import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service-role key. Bypasses RLS so the
 * admin area can read/delete every registration. NEVER import this in a client
 * component – the service-role key must stay on the server.
 *
 * Returns null when the required env vars are missing so route handlers can
 * surface a helpful error instead of crashing.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

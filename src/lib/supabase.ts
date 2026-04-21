import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * True when the Supabase env vars are present (i.e. we're running on Vercel
 * with DB access, not in static-export / GitHub Pages mode).
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Browser / anon client (safe to use in client components). */
let _browser: SupabaseClient | null = null;
export function getBrowserClient(): SupabaseClient {
  if (!_browser) {
    _browser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _browser;
}

/**
 * Server-only client using the service role key.
 * Bypasses RLS — use only in API routes / server actions.
 */
let _service: SupabaseClient | null = null;
export function getServiceClient(): SupabaseClient {
  if (!_service) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    _service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key);
  }
  return _service;
}

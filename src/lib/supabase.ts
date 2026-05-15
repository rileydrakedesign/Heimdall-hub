import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Heimdall is server-only when it comes to Supabase: every read happens in a
 * server component, every write happens in a server action. So we only need
 * the service-role key — never expose anything to the browser.
 *
 * For the project URL we accept either SUPABASE_URL or the legacy
 * NEXT_PUBLIC_SUPABASE_URL so existing Vercel deployments keep working.
 */

function url(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isSupabaseConfigured(): boolean {
  return !!(url() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let _client: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (!_client) {
    const projectUrl = url();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!projectUrl || !key) {
      throw new Error(
        "Supabase not configured (SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)",
      );
    }
    _client = createClient(projectUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

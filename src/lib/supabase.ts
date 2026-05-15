import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Heimdall talks to Supabase from the server only — every read happens in a
 * server component, every write in a server action — so we use the
 * service-role key and never expose anything to the browser.
 */

function clean(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Tolerate env values pasted with surrounding quotes or stray whitespace,
  // which otherwise produce an opaque "fetch failed" at request time.
  const trimmed = value.trim().replace(/^["']|["']$/g, "").trim();
  return trimmed || undefined;
}

function projectUrl(): string | undefined {
  // Accept SUPABASE_URL or the legacy NEXT_PUBLIC_SUPABASE_URL.
  return clean(process.env.SUPABASE_URL) || clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

let _client: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (_client) return _client;

  const url = projectUrl();
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) " +
        "and SUPABASE_SERVICE_ROLE_KEY in the environment.",
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

import { isSupabaseConfigured, getBrowserClient } from "./supabase";

export type AuditEntry = {
  id: string;
  actor_type: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  meta: Record<string, unknown>;
  created_at: string;
};

export async function loadRecentActivity(limit = 20): Promise<AuditEntry[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await getBrowserClient()
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[activity] Failed to load audit log:", error);
    return [];
  }

  return (data ?? []) as AuditEntry[];
}

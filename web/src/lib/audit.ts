import { getServiceClient } from "./supabase";

export type AuditAction =
  | "task.create"
  | "task.update"
  | "task.comment"
  | "import.yaml"
  | "project.create"
  | "project.update";

export async function writeAuditLog(entry: {
  actor_type: "user" | "agent" | "system";
  actor: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  meta?: Record<string, unknown>;
}) {
  const { error } = await getServiceClient()
    .from("audit_log")
    .insert({
      ...entry,
      meta: entry.meta ?? {},
    });

  if (error) {
    console.error("[audit] Failed to write audit log:", error);
  }
}

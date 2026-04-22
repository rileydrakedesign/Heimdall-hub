import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { isSupabaseConfigured, getServiceClient } from "@/lib/supabase";
import { writeAuditLog } from "@/lib/audit";

/**
 * POST /api/admin/import
 * One-time import of YAML data into Supabase.
 * Requires AGENT_TOKEN for auth (reuses the same bearer pattern).
 */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  // Simple auth — reuse agent token
  const token = process.env.AGENT_TOKEN;
  const auth = req.headers.get("authorization");
  if (!token || !auth || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();
  const dataDir = path.resolve(process.cwd(), "data");
  const results: Record<string, unknown> = {};

  // ---- Import projects ----
  try {
    const projectsRaw = fs.readFileSync(
      path.join(dataDir, "projects.yaml"),
      "utf8",
    );
    const parsed = yaml.load(projectsRaw) as {
      projects: Record<string, unknown>[];
    };
    const projects = (parsed?.projects ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      priority: p.priority,
      owner: p.owner,
      next_action: p.next_action,
      due: p.due ?? null,
      notes: p.notes ?? null,
      board_columns: p.board_columns ?? null,
    }));

    const { error } = await db
      .from("projects")
      .upsert(projects, { onConflict: "id" });

    if (error) throw error;
    results.projects = { imported: projects.length };

    await writeAuditLog({
      actor_type: "system",
      actor: "admin-import",
      action: "import.yaml",
      entity_type: "projects",
      entity_id: "batch",
      meta: { count: projects.length },
    });
  } catch (e) {
    results.projects = { error: String(e) };
  }

  // ---- Import tasks ----
  try {
    const tasksPath = path.join(dataDir, "tasks.yaml");
    if (!fs.existsSync(tasksPath)) {
      results.tasks = { skipped: "tasks.yaml not found" };
    } else {
      const tasksRaw = fs.readFileSync(tasksPath, "utf8");
      const parsed = yaml.load(tasksRaw) as {
        tasks: Record<string, unknown>[];
      };
      const tasks = (parsed?.tasks ?? []).map((t) => ({
        // For imported tasks, use the slug as the id (text → stored as-is)
        title: t.title,
        status: t.status,
        priority: t.priority,
        area: t.area ?? "work",
        project_id: t.project_id ?? null,
        due: t.due ?? null,
        blocked_by: t.blocked_by ?? null,
        next_step: t.next_step ?? null,
        created_by_type: "user" as const,
        created_by: (t.owner as string) ?? "Riley",
        assigned_to: (t.owner as string) ?? null,
      }));

      const { error } = await db.from("tasks").insert(tasks);
      if (error) throw error;
      results.tasks = { imported: tasks.length };

      await writeAuditLog({
        actor_type: "system",
        actor: "admin-import",
        action: "import.yaml",
        entity_type: "tasks",
        entity_id: "batch",
        meta: { count: tasks.length },
      });
    }
  } catch (e) {
    results.tasks = { error: String(e) };
  }

  return NextResponse.json({ ok: true, results });
}

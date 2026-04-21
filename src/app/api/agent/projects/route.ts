import { NextRequest, NextResponse } from "next/server";
import { validateAgentToken } from "@/lib/agent-auth";
import { isSupabaseConfigured, getServiceClient } from "@/lib/supabase";
import { writeAuditLog } from "@/lib/audit";
import {
  VALID_PROJECT_STATUSES,
  VALID_PROJECT_PRIORITIES,
} from "@/lib/constants";
import type { ProjectStatus, ProjectPriority } from "@/lib/project-types";

const MAX_LEN = 2000;

// ---------------------------------------------------------------------------
// POST /api/agent/projects — create or update
// Body: { action: "create" | "update", ... }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured — still in YAML mode" },
      { status: 503 },
    );
  }

  const authError = validateAgentToken(req);
  if (authError) return authError;

  const body = await req.json();
  const { action, agent_name } = body as {
    action: string;
    agent_name?: string;
  };
  const actor = agent_name ?? "unknown-agent";

  switch (action) {
    case "create":
      return handleCreate(body, actor);
    case "update":
      return handleUpdate(body, actor);
    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}. Use create|update.` },
        { status: 400 },
      );
  }
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleCreate(
  body: Record<string, unknown>,
  actor: string,
) {
  const { id, name, status, priority, owner, next_action, due, notes } =
    body as {
      id?: string;
      name?: string;
      status?: string;
      priority?: string;
      owner?: string;
      next_action?: string;
      due?: string;
      notes?: string;
    };

  if (!name || name.length > MAX_LEN)
    return NextResponse.json(
      { error: "name required (max 2000 chars)" },
      { status: 400 },
    );
  if (!id || id.length > 100)
    return NextResponse.json(
      { error: "id/slug required (max 100 chars)" },
      { status: 400 },
    );
  if (!next_action)
    return NextResponse.json(
      { error: "next_action required" },
      { status: 400 },
    );
  if (!status || !VALID_PROJECT_STATUSES.includes(status as ProjectStatus))
    return NextResponse.json(
      { error: `status must be one of: ${VALID_PROJECT_STATUSES.join(", ")}` },
      { status: 400 },
    );
  if (
    !priority ||
    !VALID_PROJECT_PRIORITIES.includes(priority as ProjectPriority)
  )
    return NextResponse.json(
      {
        error: `priority must be one of: ${VALID_PROJECT_PRIORITIES.join(", ")}`,
      },
      { status: 400 },
    );

  const db = getServiceClient();
  const { data, error } = await db
    .from("projects")
    .insert({
      id,
      name,
      status,
      priority,
      owner: owner ?? "Riley",
      next_action,
      due: due ?? null,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    actor_type: "agent",
    actor,
    action: "project.create",
    entity_type: "project",
    entity_id: data.id,
    meta: { name, status, priority },
  });

  return NextResponse.json({ ok: true, project: data }, { status: 201 });
}

async function handleUpdate(
  body: Record<string, unknown>,
  actor: string,
) {
  const { project_id, ...fields } = body as Record<string, unknown>;
  if (!project_id || typeof project_id !== "string")
    return NextResponse.json(
      { error: "project_id required" },
      { status: 400 },
    );

  if (
    fields.status &&
    !VALID_PROJECT_STATUSES.includes(fields.status as ProjectStatus)
  )
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (
    fields.priority &&
    !VALID_PROJECT_PRIORITIES.includes(fields.priority as ProjectPriority)
  )
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });

  const allowed = [
    "name",
    "status",
    "priority",
    "owner",
    "next_action",
    "due",
    "notes",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in fields) updates[key] = fields[key];
  }
  updates.updated_at = new Date().toISOString();

  const db = getServiceClient();
  const { data, error } = await db
    .from("projects")
    .update(updates)
    .eq("id", project_id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    actor_type: "agent",
    actor,
    action: "project.update",
    entity_type: "project",
    entity_id: project_id as string,
    meta: updates,
  });

  return NextResponse.json({ ok: true, project: data });
}

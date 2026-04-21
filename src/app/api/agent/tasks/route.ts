import { NextRequest, NextResponse } from "next/server";
import { validateAgentToken } from "@/lib/agent-auth";
import { isSupabaseConfigured, getServiceClient } from "@/lib/supabase";
import { writeAuditLog } from "@/lib/audit";
import {
  VALID_TASK_STATUSES as VALID_STATUS,
  VALID_TASK_PRIORITIES as VALID_PRIORITY,
  VALID_TASK_AREAS as VALID_AREA,
  type TaskStatus,
  type TaskPriority,
  type TaskArea,
} from "@/lib/tasks";
const MAX_LEN = 2000;

// ---------------------------------------------------------------------------
// POST /api/agent/tasks — create, update, or comment
// Body: { action: "create" | "update" | "comment", ... }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // Gate: Supabase must be configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured — still in YAML mode" },
      { status: 503 },
    );
  }

  // Auth
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
    case "comment":
      return handleComment(body, actor);
    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}. Use create|update|comment.` },
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
  const { title, status, priority, area, project_id, due, next_step } = body as {
    title?: string;
    status?: string;
    priority?: string;
    area?: string;
    project_id?: string;
    due?: string;
    next_step?: string;
  };

  if (!title || title.length > MAX_LEN)
    return NextResponse.json({ error: "title required (max 2000 chars)" }, { status: 400 });
  if (!status || !VALID_STATUS.includes(status as TaskStatus))
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUS.join(", ")}` }, { status: 400 });
  if (!priority || !VALID_PRIORITY.includes(priority as TaskPriority))
    return NextResponse.json({ error: `priority must be one of: ${VALID_PRIORITY.join(", ")}` }, { status: 400 });
  if (!area || !VALID_AREA.includes(area as TaskArea))
    return NextResponse.json({ error: `area must be one of: ${VALID_AREA.join(", ")}` }, { status: 400 });

  const db = getServiceClient();
  const { data, error } = await db
    .from("tasks")
    .insert({
      title,
      status,
      priority,
      area,
      project_id: project_id ?? null,
      due: due ?? null,
      next_step: next_step ?? null,
      created_by_type: "agent",
      created_by: actor,
      assigned_to: null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    actor_type: "agent",
    actor,
    action: "task.create",
    entity_type: "task",
    entity_id: data.id,
    meta: { title, status, priority },
  });

  return NextResponse.json({ ok: true, task: data }, { status: 201 });
}

async function handleUpdate(
  body: Record<string, unknown>,
  actor: string,
) {
  const { task_id, ...fields } = body as Record<string, unknown>;
  if (!task_id || typeof task_id !== "string")
    return NextResponse.json({ error: "task_id required" }, { status: 400 });

  // Validate enums if provided
  if (fields.status && !VALID_STATUS.includes(fields.status as TaskStatus))
    return NextResponse.json({ error: `Invalid status` }, { status: 400 });
  if (fields.priority && !VALID_PRIORITY.includes(fields.priority as TaskPriority))
    return NextResponse.json({ error: `Invalid priority` }, { status: 400 });

  // Only allow known columns
  const allowed = ["title", "status", "priority", "area", "project_id", "due", "next_step", "blocked_by", "assigned_to"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in fields) updates[key] = fields[key];
  }
  updates.updated_at = new Date().toISOString();

  const db = getServiceClient();
  const { data, error } = await db
    .from("tasks")
    .update(updates)
    .eq("id", task_id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    actor_type: "agent",
    actor,
    action: "task.update",
    entity_type: "task",
    entity_id: task_id,
    meta: updates,
  });

  return NextResponse.json({ ok: true, task: data });
}

async function handleComment(
  body: Record<string, unknown>,
  actor: string,
) {
  const { task_id, body: commentBody } = body as {
    task_id?: string;
    body?: string;
  };
  if (!task_id) return NextResponse.json({ error: "task_id required" }, { status: 400 });
  if (!commentBody || commentBody.length > MAX_LEN)
    return NextResponse.json({ error: "body required (max 2000 chars)" }, { status: 400 });

  const db = getServiceClient();
  const { data, error } = await db
    .from("task_updates")
    .insert({
      task_id,
      author_type: "agent",
      author: actor,
      body: commentBody,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    actor_type: "agent",
    actor,
    action: "task.comment",
    entity_type: "task_update",
    entity_id: data.id,
    meta: { task_id },
  });

  return NextResponse.json({ ok: true, update: data }, { status: 201 });
}

"use server";

import { revalidatePath } from "next/cache";
import { getServiceClient } from "./supabase";
import {
  VALID_TASK_STATUSES,
  VALID_TASK_PRIORITIES,
  VALID_PROJECT_STATUSES,
  VALID_PROJECT_PRIORITIES,
  PERSONAL_PROJECT_ID,
} from "./constants";
import type { TaskStatus, TaskPriority } from "./task-types";
import type { ProjectStatus, ProjectPriority } from "./project-types";

export type ActionResult = { ok: boolean; error?: string };

const MAX_LEN = 2000;

// ---------------------------------------------------------------------------
// Legacy-schema fallback
// ---------------------------------------------------------------------------
// Older Supabase schemas (pre-simplify) declared additional NOT NULL columns
// the new UI no longer touches. We try a minimal INSERT first; if Postgres
// rejects it with a NOT NULL violation (SQLSTATE 23502), we retry with the
// historical defaults so the user doesn't have to run a migration.

const LEGACY_TASK_DEFAULTS = {
  area: "personal",
  created_by_type: "user",
  created_by: "user",
};

const LEGACY_PROJECT_DEFAULTS = {
  owner: "user",
};

async function dbInsertWithLegacyFallback(
  table: "tasks" | "projects",
  row: Record<string, unknown>,
  legacyDefaults: Record<string, unknown>,
) {
  const client = getServiceClient();
  const first = await client.from(table).insert(row);
  if (first.error?.code === "23502") {
    return client.from(table).insert({ ...legacyDefaults, ...row });
  }
  return first;
}

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

function revalidateAll() {
  // "layout" cascades to every route under the root layout, including the
  // ISR-cached dashboard and project detail pages.
  revalidatePath("/", "layout");
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function nowIso() {
  return new Date().toISOString();
}

function fail(error: string): ActionResult {
  return { ok: false, error };
}

// Turns a thrown transport error (e.g. "TypeError: fetch failed" when the
// Supabase project is paused or unreachable) into a clean, actionable result
// instead of an unhandled server-action exception.
function dbFail(e: unknown): ActionResult {
  const msg = e instanceof Error ? e.message : String(e);
  return fail(
    `Could not reach the database (${msg}). The Supabase project may be paused ` +
      `or its URL/key may be misconfigured.`,
  );
}

// ---------------------------------------------------------------------------
// Task actions
// ---------------------------------------------------------------------------

export async function createTask(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const title = (formData.get("title") as string)?.trim();
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const project_id = ((formData.get("project_id") as string) || "").trim() || null;
  const due = ((formData.get("due") as string) || "").trim() || null;
  const next_step = ((formData.get("next_step") as string) || "").trim() || null;
  const notes = ((formData.get("notes") as string) || "").trim() || null;

  if (!title || title.length > MAX_LEN) return fail("Title is required (max 2000 chars)");
  if (!VALID_TASK_STATUSES.includes(status as TaskStatus)) return fail("Invalid status");
  if (!VALID_TASK_PRIORITIES.includes(priority as TaskPriority)) return fail("Invalid priority");

  const row = {
    id: genId("t"),
    title,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
    project_id,
    due,
    next_step,
    notes,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  try {
    const { error } = await dbInsertWithLegacyFallback("tasks", row, LEGACY_TASK_DEFAULTS);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

export async function updateTask(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const task_id = formData.get("task_id") as string;
  if (!task_id) return fail("task_id required");

  const allowed = [
    "title",
    "status",
    "priority",
    "project_id",
    "due",
    "next_step",
    "notes",
    "blocked_by",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    const val = formData.get(key);
    if (val === null) continue;
    const str = (val as string).trim();
    updates[key] = str === "" ? null : str;
  }
  updates.updated_at = nowIso();

  if (updates.status && !VALID_TASK_STATUSES.includes(updates.status as TaskStatus))
    return fail("Invalid status");
  if (updates.priority && !VALID_TASK_PRIORITIES.includes(updates.priority as TaskPriority))
    return fail("Invalid priority");

  try {
    const { error } = await getServiceClient().from("tasks").update(updates).eq("id", task_id);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

export async function quickUpdateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionResult> {
  if (!VALID_TASK_STATUSES.includes(status)) return fail("Invalid status");

  try {
    const { error } = await getServiceClient()
      .from("tasks")
      .update({ status, updated_at: nowIso() })
      .eq("id", taskId);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  try {
    const { error } = await getServiceClient().from("tasks").delete().eq("id", taskId);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Project actions
// ---------------------------------------------------------------------------

export async function createProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = (formData.get("name") as string)?.trim();
  let id = ((formData.get("id") as string) || "").trim();
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const next_action = ((formData.get("next_action") as string) || "").trim();
  const due = ((formData.get("due") as string) || "").trim() || null;
  const notes = ((formData.get("notes") as string) || "").trim() || null;

  if (!name || name.length > MAX_LEN) return fail("Name is required");
  if (!id) id = slugify(name);
  if (!id) return fail("ID/slug is required");
  if (!next_action) return fail("Next action is required");
  if (!VALID_PROJECT_STATUSES.includes(status as ProjectStatus)) return fail("Invalid status");
  if (!VALID_PROJECT_PRIORITIES.includes(priority as ProjectPriority)) return fail("Invalid priority");

  const row = {
    id,
    name,
    status: status as ProjectStatus,
    priority: priority as ProjectPriority,
    next_action,
    due,
    notes,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  try {
    const db = getServiceClient();
    const { data: existing } = await db.from("projects").select("id").eq("id", id).maybeSingle();
    if (existing) return fail(`Project id '${id}' already exists`);
    const { error } = await dbInsertWithLegacyFallback("projects", row, LEGACY_PROJECT_DEFAULTS);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

export async function updateProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const project_id = formData.get("project_id") as string;
  if (!project_id) return fail("project_id required");

  const allowed = ["name", "status", "priority", "next_action", "due", "notes"] as const;
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    const val = formData.get(key);
    if (val === null) continue;
    const str = (val as string).trim();
    updates[key] = str === "" ? null : str;
  }
  updates.updated_at = nowIso();

  if (updates.status && !VALID_PROJECT_STATUSES.includes(updates.status as ProjectStatus))
    return fail("Invalid status");
  if (updates.priority && !VALID_PROJECT_PRIORITIES.includes(updates.priority as ProjectPriority))
    return fail("Invalid priority");

  try {
    const { error } = await getServiceClient()
      .from("projects")
      .update(updates)
      .eq("id", project_id);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  if (projectId === PERSONAL_PROJECT_ID) return fail("Cannot delete the Personal project");

  try {
    const db = getServiceClient();

    // Seed the Personal bucket if it isn't already there, so any tasks we
    // reassign land in a real row (and the UI's pinned card has data).
    const { data: hasPersonal } = await db
      .from("projects")
      .select("id")
      .eq("id", PERSONAL_PROJECT_ID)
      .maybeSingle();
    if (!hasPersonal) {
      const seed = {
        id: PERSONAL_PROJECT_ID,
        name: "Personal",
        status: "active" as ProjectStatus,
        priority: "medium" as ProjectPriority,
        next_action: "Capture personal tasks here",
        due: null,
        notes: "Default bucket for personal tasks.",
        created_at: nowIso(),
        updated_at: nowIso(),
      };
      const { error: seedErr } = await dbInsertWithLegacyFallback(
        "projects",
        seed,
        LEGACY_PROJECT_DEFAULTS,
      );
      if (seedErr) return fail(seedErr.message);
    }

    // Reassign tasks to "personal" before deleting the project.
    const { error: reassignErr } = await db
      .from("tasks")
      .update({ project_id: PERSONAL_PROJECT_ID, updated_at: nowIso() })
      .eq("project_id", projectId);
    if (reassignErr) return fail(reassignErr.message);

    const { error } = await db.from("projects").delete().eq("id", projectId);
    if (error) return fail(error.message);
  } catch (e) {
    return dbFail(e);
  }

  revalidateAll();
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { getServiceClient } from "./supabase";
import { writeAuditLog } from "./audit";
import {
  VALID_TASK_STATUSES,
  VALID_TASK_PRIORITIES,
  VALID_TASK_AREAS,
  VALID_PROJECT_STATUSES,
  VALID_PROJECT_PRIORITIES,
} from "./constants";
import type { TaskStatus, TaskPriority, TaskArea } from "./task-types";
import type { ProjectStatus, ProjectPriority } from "./project-types";

export type ActionResult = { ok: boolean; error?: string };

const MAX_LEN = 2000;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/projects");
}

// ---------------------------------------------------------------------------
// Task actions
// ---------------------------------------------------------------------------

export async function createTask(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const area = formData.get("area") as string;
  const project_id = (formData.get("project_id") as string) || null;
  const due = (formData.get("due") as string) || null;
  const next_step = (formData.get("next_step") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!title || title.length > MAX_LEN) return { ok: false, error: "Title is required (max 2000 chars)" };
  if (!VALID_TASK_STATUSES.includes(status as TaskStatus)) return { ok: false, error: "Invalid status" };
  if (!VALID_TASK_PRIORITIES.includes(priority as TaskPriority)) return { ok: false, error: "Invalid priority" };
  if (!VALID_TASK_AREAS.includes(area as TaskArea)) return { ok: false, error: "Invalid area" };

  const db = getServiceClient();
  const { data, error } = await db
    .from("tasks")
    .insert({
      title,
      status,
      priority,
      area,
      project_id,
      due,
      next_step,
      notes,
      created_by_type: "user",
      created_by: "Riley",
      assigned_to: null,
    })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actor_type: "user",
    actor: "Riley",
    action: "task.create",
    entity_type: "task",
    entity_id: data.id,
    meta: { title, status, priority },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateTask(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const task_id = formData.get("task_id") as string;
  if (!task_id) return { ok: false, error: "task_id required" };

  const allowed = ["title", "status", "priority", "area", "project_id", "due", "next_step", "notes", "blocked_by", "assigned_to"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    const val = formData.get(key);
    if (val !== null && val !== undefined) {
      updates[key] = val === "" ? null : val;
    }
  }
  updates.updated_at = new Date().toISOString();

  // Validate enums if provided
  if (updates.status && !VALID_TASK_STATUSES.includes(updates.status as TaskStatus))
    return { ok: false, error: "Invalid status" };
  if (updates.priority && !VALID_TASK_PRIORITIES.includes(updates.priority as TaskPriority))
    return { ok: false, error: "Invalid priority" };

  const db = getServiceClient();
  const { error } = await db
    .from("tasks")
    .update(updates)
    .eq("id", task_id);

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actor_type: "user",
    actor: "Riley",
    action: "task.update",
    entity_type: "task",
    entity_id: task_id,
    meta: updates,
  });

  revalidateAll();
  return { ok: true };
}

export async function quickUpdateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionResult> {
  if (!VALID_TASK_STATUSES.includes(status))
    return { ok: false, error: "Invalid status" };

  const db = getServiceClient();
  const { error } = await db
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actor_type: "user",
    actor: "Riley",
    action: "task.update",
    entity_type: "task",
    entity_id: taskId,
    meta: { status },
  });

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
  const name = formData.get("name") as string;
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const owner = (formData.get("owner") as string) || "Riley";
  const next_action = formData.get("next_action") as string;
  const due = (formData.get("due") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!name || name.length > MAX_LEN) return { ok: false, error: "Name is required" };
  if (!id) return { ok: false, error: "ID/slug is required" };
  if (!next_action) return { ok: false, error: "Next action is required" };
  if (!VALID_PROJECT_STATUSES.includes(status as ProjectStatus)) return { ok: false, error: "Invalid status" };
  if (!VALID_PROJECT_PRIORITIES.includes(priority as ProjectPriority)) return { ok: false, error: "Invalid priority" };

  const db = getServiceClient();
  const { data, error } = await db
    .from("projects")
    .insert({ id, name, status, priority, owner, next_action, due, notes })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actor_type: "user",
    actor: "Riley",
    action: "project.create",
    entity_type: "project",
    entity_id: data.id,
    meta: { name, status, priority },
  });

  revalidateAll();
  return { ok: true };
}

export async function updateProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const project_id = formData.get("project_id") as string;
  if (!project_id) return { ok: false, error: "project_id required" };

  const allowed = ["name", "status", "priority", "owner", "next_action", "due", "notes"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    const val = formData.get(key);
    if (val !== null && val !== undefined) {
      updates[key] = val === "" ? null : val;
    }
  }
  updates.updated_at = new Date().toISOString();

  if (updates.status && !VALID_PROJECT_STATUSES.includes(updates.status as ProjectStatus))
    return { ok: false, error: "Invalid status" };
  if (updates.priority && !VALID_PROJECT_PRIORITIES.includes(updates.priority as ProjectPriority))
    return { ok: false, error: "Invalid priority" };

  const db = getServiceClient();
  const { error } = await db
    .from("projects")
    .update(updates)
    .eq("id", project_id);

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actor_type: "user",
    actor: "Riley",
    action: "project.update",
    entity_type: "project",
    entity_id: project_id,
    meta: updates,
  });

  revalidateAll();
  return { ok: true };
}

export async function quickUpdateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<ActionResult> {
  if (!VALID_PROJECT_STATUSES.includes(status))
    return { ok: false, error: "Invalid status" };

  const db = getServiceClient();
  const { error } = await db
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actor_type: "user",
    actor: "Riley",
    action: "project.update",
    entity_type: "project",
    entity_id: projectId,
    meta: { status },
  });

  revalidateAll();
  return { ok: true };
}

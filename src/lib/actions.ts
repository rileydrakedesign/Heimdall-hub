"use server";

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, getServiceClient } from "./supabase";
import {
  VALID_TASK_STATUSES,
  VALID_TASK_PRIORITIES,
  VALID_PROJECT_STATUSES,
  VALID_PROJECT_PRIORITIES,
  PERSONAL_PROJECT_ID,
} from "./constants";
import type { Task, TaskStatus, TaskPriority } from "./task-types";
import type { Project, ProjectStatus, ProjectPriority } from "./project-types";

export type ActionResult = { ok: boolean; error?: string };

const MAX_LEN = 2000;
const PROJECTS_FILE = path.resolve(process.cwd(), "data", "projects.yaml");
const TASKS_FILE = path.resolve(process.cwd(), "data", "tasks.yaml");

// ---------------------------------------------------------------------------
// YAML helpers (local-dev backend)
// ---------------------------------------------------------------------------

function readYaml<T>(file: string, key: string): T[] {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  const parsed = yaml.load(raw) as Record<string, T[]> | null;
  return parsed?.[key] ?? [];
}

function writeYaml<T>(file: string, key: string, items: T[]) {
  const text = yaml.dump({ [key]: items }, { lineWidth: 100, noRefs: true });
  fs.writeFileSync(file, text, "utf8");
}

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/projects");
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

  const id = genId("t");
  const row = {
    id,
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

  if (isSupabaseConfigured()) {
    const { error } = await getServiceClient().from("tasks").insert(row);
    if (error) return fail(error.message);
  } else {
    const tasks = readYaml<Task>(TASKS_FILE, "tasks");
    tasks.unshift(row as Task);
    writeYaml(TASKS_FILE, "tasks", tasks);
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

  if (isSupabaseConfigured()) {
    const { error } = await getServiceClient().from("tasks").update(updates).eq("id", task_id);
    if (error) return fail(error.message);
  } else {
    const tasks = readYaml<Task>(TASKS_FILE, "tasks");
    const idx = tasks.findIndex((t) => t.id === task_id);
    if (idx === -1) return fail("Task not found");
    tasks[idx] = { ...tasks[idx], ...(updates as Partial<Task>) };
    writeYaml(TASKS_FILE, "tasks", tasks);
  }

  revalidateAll();
  return { ok: true };
}

export async function quickUpdateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionResult> {
  if (!VALID_TASK_STATUSES.includes(status)) return fail("Invalid status");

  if (isSupabaseConfigured()) {
    const { error } = await getServiceClient()
      .from("tasks")
      .update({ status, updated_at: nowIso() })
      .eq("id", taskId);
    if (error) return fail(error.message);
  } else {
    const tasks = readYaml<Task>(TASKS_FILE, "tasks");
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return fail("Task not found");
    tasks[idx] = { ...tasks[idx], status, updated_at: nowIso() };
    writeYaml(TASKS_FILE, "tasks", tasks);
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  if (isSupabaseConfigured()) {
    const { error } = await getServiceClient().from("tasks").delete().eq("id", taskId);
    if (error) return fail(error.message);
  } else {
    const tasks = readYaml<Task>(TASKS_FILE, "tasks");
    const next = tasks.filter((t) => t.id !== taskId);
    if (next.length === tasks.length) return fail("Task not found");
    writeYaml(TASKS_FILE, "tasks", next);
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

  if (isSupabaseConfigured()) {
    const db = getServiceClient();
    const { data: existing } = await db.from("projects").select("id").eq("id", id).maybeSingle();
    if (existing) return fail(`Project id '${id}' already exists`);
    const { error } = await db.from("projects").insert(row);
    if (error) return fail(error.message);
  } else {
    const projects = readYaml<Project>(PROJECTS_FILE, "projects");
    if (projects.some((p) => p.id === id)) return fail(`Project id '${id}' already exists`);
    projects.unshift(row as Project);
    writeYaml(PROJECTS_FILE, "projects", projects);
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

  if (isSupabaseConfigured()) {
    const { error } = await getServiceClient()
      .from("projects")
      .update(updates)
      .eq("id", project_id);
    if (error) return fail(error.message);
  } else {
    const projects = readYaml<Project>(PROJECTS_FILE, "projects");
    const idx = projects.findIndex((p) => p.id === project_id);
    if (idx === -1) return fail("Project not found");
    projects[idx] = { ...projects[idx], ...(updates as Partial<Project>) };
    writeYaml(PROJECTS_FILE, "projects", projects);
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  if (projectId === PERSONAL_PROJECT_ID) return fail("Cannot delete the Personal project");

  if (isSupabaseConfigured()) {
    const db = getServiceClient();
    // Reassign tasks to "personal" before deleting the project.
    const { error: reassignErr } = await db
      .from("tasks")
      .update({ project_id: PERSONAL_PROJECT_ID, updated_at: nowIso() })
      .eq("project_id", projectId);
    if (reassignErr) return fail(reassignErr.message);

    const { error } = await db.from("projects").delete().eq("id", projectId);
    if (error) return fail(error.message);
  } else {
    const projects = readYaml<Project>(PROJECTS_FILE, "projects");
    const next = projects.filter((p) => p.id !== projectId);
    if (next.length === projects.length) return fail("Project not found");
    writeYaml(PROJECTS_FILE, "projects", next);

    const tasks = readYaml<Task>(TASKS_FILE, "tasks");
    let mutated = false;
    for (const t of tasks) {
      if (t.project_id === projectId) {
        t.project_id = PERSONAL_PROJECT_ID;
        t.updated_at = nowIso();
        mutated = true;
      }
    }
    if (mutated) writeYaml(TASKS_FILE, "tasks", tasks);
  }

  revalidateAll();
  return { ok: true };
}

"use server";

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { revalidatePath } from "next/cache";
import {
  VALID_TASK_STATUSES,
  VALID_TASK_PRIORITIES,
  VALID_PROJECT_STATUSES,
  VALID_PROJECT_PRIORITIES,
} from "./constants";
import type { Task, TaskStatus, TaskPriority } from "./task-types";
import type { Project, ProjectStatus, ProjectPriority } from "./project-types";

export type ActionResult = { ok: boolean; error?: string };

const MAX_LEN = 2000;
const PROJECTS_FILE = path.resolve(process.cwd(), "data", "projects.yaml");
const TASKS_FILE = path.resolve(process.cwd(), "data", "tasks.yaml");

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
  const next_step = ((formData.get("next_step") as string) || "").trim() || undefined;
  const notes = ((formData.get("notes") as string) || "").trim() || undefined;

  if (!title || title.length > MAX_LEN) return { ok: false, error: "Title is required (max 2000 chars)" };
  if (!VALID_TASK_STATUSES.includes(status as TaskStatus)) return { ok: false, error: "Invalid status" };
  if (!VALID_TASK_PRIORITIES.includes(priority as TaskPriority)) return { ok: false, error: "Invalid priority" };

  const tasks = readYaml<Task>(TASKS_FILE, "tasks");
  const task: Task = {
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
  tasks.unshift(task);
  writeYaml(TASKS_FILE, "tasks", tasks);

  revalidateAll();
  return { ok: true };
}

export async function updateTask(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const task_id = formData.get("task_id") as string;
  if (!task_id) return { ok: false, error: "task_id required" };

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

  const updates: Partial<Task> = {};
  for (const key of allowed) {
    const val = formData.get(key);
    if (val === null) continue;
    const str = (val as string).trim();
    (updates as Record<string, unknown>)[key] = str === "" ? null : str;
  }

  if (updates.status && !VALID_TASK_STATUSES.includes(updates.status as TaskStatus))
    return { ok: false, error: "Invalid status" };
  if (updates.priority && !VALID_TASK_PRIORITIES.includes(updates.priority as TaskPriority))
    return { ok: false, error: "Invalid priority" };

  const tasks = readYaml<Task>(TASKS_FILE, "tasks");
  const idx = tasks.findIndex((t) => t.id === task_id);
  if (idx === -1) return { ok: false, error: "Task not found" };

  tasks[idx] = { ...tasks[idx], ...updates, updated_at: nowIso() };
  writeYaml(TASKS_FILE, "tasks", tasks);

  revalidateAll();
  return { ok: true };
}

export async function quickUpdateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionResult> {
  if (!VALID_TASK_STATUSES.includes(status))
    return { ok: false, error: "Invalid status" };

  const tasks = readYaml<Task>(TASKS_FILE, "tasks");
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return { ok: false, error: "Task not found" };

  tasks[idx] = { ...tasks[idx], status, updated_at: nowIso() };
  writeYaml(TASKS_FILE, "tasks", tasks);

  revalidateAll();
  return { ok: true };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const tasks = readYaml<Task>(TASKS_FILE, "tasks");
  const next = tasks.filter((t) => t.id !== taskId);
  if (next.length === tasks.length) return { ok: false, error: "Task not found" };
  writeYaml(TASKS_FILE, "tasks", next);
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
  const notes = ((formData.get("notes") as string) || "").trim() || undefined;

  if (!name || name.length > MAX_LEN) return { ok: false, error: "Name is required" };
  if (!id) id = slugify(name);
  if (!id) return { ok: false, error: "ID/slug is required" };
  if (!next_action) return { ok: false, error: "Next action is required" };
  if (!VALID_PROJECT_STATUSES.includes(status as ProjectStatus)) return { ok: false, error: "Invalid status" };
  if (!VALID_PROJECT_PRIORITIES.includes(priority as ProjectPriority)) return { ok: false, error: "Invalid priority" };

  const projects = readYaml<Project>(PROJECTS_FILE, "projects");
  if (projects.some((p) => p.id === id)) return { ok: false, error: `Project id '${id}' already exists` };

  const project: Project = {
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
  projects.unshift(project);
  writeYaml(PROJECTS_FILE, "projects", projects);

  revalidateAll();
  return { ok: true };
}

export async function updateProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const project_id = formData.get("project_id") as string;
  if (!project_id) return { ok: false, error: "project_id required" };

  const allowed = ["name", "status", "priority", "next_action", "due", "notes"] as const;
  const updates: Partial<Project> = {};
  for (const key of allowed) {
    const val = formData.get(key);
    if (val === null) continue;
    const str = (val as string).trim();
    (updates as Record<string, unknown>)[key] = str === "" ? null : str;
  }

  if (updates.status && !VALID_PROJECT_STATUSES.includes(updates.status as ProjectStatus))
    return { ok: false, error: "Invalid status" };
  if (updates.priority && !VALID_PROJECT_PRIORITIES.includes(updates.priority as ProjectPriority))
    return { ok: false, error: "Invalid priority" };

  const projects = readYaml<Project>(PROJECTS_FILE, "projects");
  const idx = projects.findIndex((p) => p.id === project_id);
  if (idx === -1) return { ok: false, error: "Project not found" };

  projects[idx] = { ...projects[idx], ...updates, updated_at: nowIso() };
  writeYaml(PROJECTS_FILE, "projects", projects);

  revalidateAll();
  return { ok: true };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  if (projectId === "personal") return { ok: false, error: "Cannot delete the Personal project" };

  const projects = readYaml<Project>(PROJECTS_FILE, "projects");
  const next = projects.filter((p) => p.id !== projectId);
  if (next.length === projects.length) return { ok: false, error: "Project not found" };
  writeYaml(PROJECTS_FILE, "projects", next);

  // Reassign tasks from this project to "personal"
  const tasks = readYaml<Task>(TASKS_FILE, "tasks");
  let mutated = false;
  for (const t of tasks) {
    if (t.project_id === projectId) {
      t.project_id = "personal";
      t.updated_at = nowIso();
      mutated = true;
    }
  }
  if (mutated) writeYaml(TASKS_FILE, "tasks", tasks);

  revalidateAll();
  return { ok: true };
}

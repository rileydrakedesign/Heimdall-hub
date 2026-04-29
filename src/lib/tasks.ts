import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { isSupabaseConfigured, getBrowserClient } from "./supabase";

// Re-export types and constants so existing imports keep working
export type { TaskStatus, TaskPriority, TaskArea, Task } from "./task-types";
export { VALID_TASK_STATUSES, VALID_TASK_PRIORITIES, VALID_TASK_AREAS } from "./constants";

import type { Task } from "./task-types";

type TasksFile = { tasks: Task[] };

// ---------------------------------------------------------------------------
// YAML loader (static export / fallback)
// ---------------------------------------------------------------------------
function loadTasksFromYaml(): Task[] {
  const filePath = path.resolve(process.cwd(), "data", "tasks.yaml");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(raw) as TasksFile;
    return parsed?.tasks ?? [];
  } catch (e) {
    console.error("[tasks] Failed to load tasks.yaml:", e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Supabase loader
// ---------------------------------------------------------------------------
async function loadTasksFromDb(): Promise<Task[]> {
  const { data, error } = await getBrowserClient()
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function loadTasksAsync(): Promise<Task[]> {
  if (isSupabaseConfigured()) {
    try {
      return await loadTasksFromDb();
    } catch (e) {
      console.error("[tasks] Supabase load failed, falling back to YAML:", e);
      return loadTasksFromYaml();
    }
  }
  return loadTasksFromYaml();
}

/** Synchronous loader — works only in YAML/static mode. */
export function loadTasks(): Task[] {
  return loadTasksFromYaml();
}

export function getTaskById(id: string): Task | undefined {
  return loadTasks().find((t) => t.id === id);
}

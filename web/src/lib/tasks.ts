import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { isSupabaseConfigured, getBrowserClient } from "./supabase";

export type TaskStatus = "backlog" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskArea = "work" | "personal";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  area: TaskArea;
  project_id: string | null;
  due: string | null;
  blocked_by?: string | null;
  next_step?: string;
  notes?: string;
  links?: Array<{ label: string; url: string }>;

  // Fields used by YAML (kept for backward compat)
  owner?: string;

  // Fields added for Supabase schema
  created_by_type?: "user" | "agent";
  created_by?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
};

type TasksFile = { tasks: Task[] };

// ---------------------------------------------------------------------------
// YAML loader (static export / fallback)
// ---------------------------------------------------------------------------
function loadTasksFromYaml(): Task[] {
  const filePath = path.resolve(process.cwd(), "..", "data", "tasks.yaml");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw) as TasksFile;
  return parsed?.tasks ?? [];
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
  if (isSupabaseConfigured()) return loadTasksFromDb();
  return loadTasksFromYaml();
}

/** Synchronous loader — works only in YAML/static mode. */
export function loadTasks(): Task[] {
  return loadTasksFromYaml();
}

export function getTaskById(id: string): Task | undefined {
  return loadTasks().find((t) => t.id === id);
}

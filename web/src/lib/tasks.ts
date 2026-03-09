import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export type TaskStatus = "backlog" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskArea = "work" | "personal";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  area: TaskArea;
  owner: string;
  project_id: string | null;
  due: string | null;
  blocked_by?: string | null;
  next_step?: string;
  notes?: string;
  links?: Array<{ label: string; url: string }>;
};

type TasksFile = { tasks: Task[] };

export function loadTasks(): Task[] {
  // During build, cwd is /.../web
  const filePath = path.resolve(process.cwd(), "..", "data", "tasks.yaml");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw) as TasksFile;
  return parsed?.tasks ?? [];
}

export function getTaskById(id: string): Task | undefined {
  return loadTasks().find((t) => t.id === id);
}

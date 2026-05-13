import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export type { TaskStatus, TaskPriority, Task } from "./task-types";
export { VALID_TASK_STATUSES, VALID_TASK_PRIORITIES } from "./constants";

import type { Task } from "./task-types";

type TasksFile = { tasks: Task[] };

function loadTasksFromYaml(): Task[] {
  const filePath = path.resolve(process.cwd(), "data", "tasks.yaml");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(raw) as TasksFile | null;
    return parsed?.tasks ?? [];
  } catch (e) {
    console.error("[tasks] Failed to load tasks.yaml:", e);
    return [];
  }
}

export async function loadTasksAsync(): Promise<Task[]> {
  return loadTasksFromYaml();
}

export function loadTasks(): Task[] {
  return loadTasksFromYaml();
}

export function getTaskById(id: string): Task | undefined {
  return loadTasks().find((t) => t.id === id);
}

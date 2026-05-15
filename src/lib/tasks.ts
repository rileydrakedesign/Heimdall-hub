import { getServiceClient } from "./supabase";

export type { TaskStatus, TaskPriority, Task } from "./task-types";
export { VALID_TASK_STATUSES, VALID_TASK_PRIORITIES } from "./constants";

import type { Task } from "./task-types";

export async function loadTasksAsync(): Promise<Task[]> {
  const { data, error } = await getServiceClient()
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Could not load tasks from Supabase: ${error.message}`);
  }
  return (data ?? []) as Task[];
}

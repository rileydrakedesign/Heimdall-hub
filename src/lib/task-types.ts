// Task type definitions — safe for client and server imports

export type TaskStatus = "backlog" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string | null;
  due: string | null;
  blocked_by?: string | null;
  next_step?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

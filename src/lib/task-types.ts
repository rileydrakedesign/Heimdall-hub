// Task type definitions — safe for client and server imports

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

  owner?: string;

  created_by_type?: "user" | "agent";
  created_by?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
};

// Project type definitions — safe for client and server imports

export type ProjectStatus = "idea" | "active" | "paused" | "done";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  next_action: string;
  due: string | null;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

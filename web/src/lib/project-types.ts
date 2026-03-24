// Project type definitions — safe for client and server imports

export type ProjectStatus = "idea" | "active" | "paused" | "done";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type ProjectLink = { label: string; url: string };

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  owner: string;
  next_action: string;
  due: string | null;

  board_columns?: Array<"backlog" | "in_progress" | "blocked" | "done">;

  links?: ProjectLink[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

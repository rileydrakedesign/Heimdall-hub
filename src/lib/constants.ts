// Shared validation constants — safe for both server and client imports

import type { TaskStatus, TaskPriority } from "./task-types";
import type { ProjectStatus, ProjectPriority } from "./project-types";

export const VALID_TASK_STATUSES: TaskStatus[] = ["backlog", "in_progress", "blocked", "done"];
export const VALID_TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];

export const VALID_PROJECT_STATUSES: ProjectStatus[] = ["idea", "active", "paused", "done"];
export const VALID_PROJECT_PRIORITIES: ProjectPriority[] = ["low", "medium", "high", "urgent"];

export const PERSONAL_PROJECT_ID = "personal";

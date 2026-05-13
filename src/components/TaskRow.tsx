"use client";

import { useState, useRef, useEffect } from "react";
import type { Task, TaskStatus } from "@/lib/task-types";
import { VALID_TASK_STATUSES } from "@/lib/constants";
import { quickUpdateTaskStatus, deleteTask } from "@/lib/actions";
import { PriorityBar } from "./PriorityBar";
import { Modal } from "./Modal";
import { TaskForm } from "./TaskForm";
import { useToast } from "./ToastProvider";

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-slate-400",
  in_progress: "bg-emerald-400",
  blocked: "bg-rose-400",
  done: "bg-sky-400",
};

const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export function TaskRow({
  task,
  projectName,
  projectId,
  projects,
  hideProject = false,
}: {
  task: Task;
  projectName: string | null;
  projectId: string | null;
  projects: { id: string; name: string }[];
  hideProject?: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  async function handleStatusChange(status: TaskStatus) {
    setDropdownOpen(false);
    const result = await quickUpdateTaskStatus(task.id, status);
    if (result.ok) {
      addToast(`Status → ${status.replace("_", " ")}`);
    } else {
      addToast(result.error ?? "Failed to update", "error");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    const result = await deleteTask(task.id);
    if (result.ok) {
      addToast("Task deleted");
    } else {
      addToast(result.error ?? "Failed to delete", "error");
    }
  }

  return (
    <div className="p-3 group">
      <PriorityBar priority={task.priority}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex items-start gap-2">
            <div className="relative mt-1" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[task.status] ?? "bg-slate-400"} hover:ring-2 hover:ring-white/20 transition-shadow`}
                title="Change status"
                aria-label="Change status"
              />
              {dropdownOpen && (
                <div className="absolute left-0 top-5 z-30 w-36 rounded-md border border-border bg-surface shadow-lg py-1">
                  {VALID_TASK_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-surface-light ${
                        s === task.status ? "text-foreground font-medium" : "text-muted"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[s]}`} />
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <button
                onClick={() => setEditOpen(true)}
                className={`font-medium text-sm text-left hover:text-accent transition-colors ${
                  task.status === "done" ? "line-through text-muted" : ""
                }`}
              >
                {task.title}
              </button>
              {(!hideProject || task.next_step || task.blocked_by) && (
                <div className="mt-0.5 text-xs text-muted">
                  {!hideProject && projectName && (
                    <a className="hover:text-foreground" href={`/projects/${projectId}`}>
                      {projectName}
                    </a>
                  )}
                  {task.next_step && (
                    <span className={!hideProject && projectName ? "text-muted/60" : ""}>
                      {!hideProject && projectName ? " · " : ""}{task.next_step}
                    </span>
                  )}
                  {task.blocked_by && (
                    <span className="text-rose-400/80"> · Blocked: {task.blocked_by}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2 items-center">
            {task.status !== "done" && (
              <button
                onClick={() => handleStatusChange("done")}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-emerald-400 transition-all text-sm"
                title="Mark done"
                aria-label="Mark done"
              >
                ✓
              </button>
            )}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose-400 transition-all text-sm"
              title="Delete task"
              aria-label="Delete task"
            >
              ×
            </button>
          </div>
        </div>
      </PriorityBar>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <TaskForm
          task={task}
          projects={projects}
          onClose={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}

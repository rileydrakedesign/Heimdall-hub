"use client";

import { useState, useRef, useEffect } from "react";
import type { Task, TaskStatus } from "@/lib/task-types";
import { VALID_TASK_STATUSES } from "@/lib/constants";
import { quickUpdateTaskStatus } from "@/lib/actions";
import { PriorityBar } from "./PriorityBar";
import { Badge } from "./Badge";
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
}: {
  task: Task;
  projectName: string | null;
  projectId: string | null;
  projects: { id: string; name: string }[];
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

  return (
    <div className="p-3 group">
      <PriorityBar priority={task.priority}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex items-start gap-2">
            {/* Status dot → dropdown */}
            <div className="relative mt-1" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[task.status] ?? "bg-slate-400"} hover:ring-2 hover:ring-white/20 transition-shadow`}
                title="Change status"
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
                className="font-medium text-sm text-left hover:text-accent transition-colors"
              >
                {task.title}
              </button>
              <div className="mt-0.5 text-xs text-muted">
                {projectName ? (
                  <a className="hover:text-foreground" href={`/projects/${projectId}`}>
                    {projectName}
                  </a>
                ) : (
                  <span>Unassigned</span>
                )}
                {task.next_step && (
                  <span className="text-muted/60"> · {task.next_step}</span>
                )}
                {task.blocked_by && (
                  <span className="text-rose-400/80"> · Blocked: {task.blocked_by}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2 items-center">
            {task.status !== "done" && (
              <button
                onClick={() => handleStatusChange("done")}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-emerald-400 transition-all text-sm"
                title="Mark done"
              >
                ✓
              </button>
            )}
            <Badge>{task.area}</Badge>
            <Badge>{task.assigned_to ?? task.owner ?? "—"}</Badge>
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

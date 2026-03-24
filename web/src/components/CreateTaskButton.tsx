"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { TaskForm } from "./TaskForm";

export function CreateTaskButton({
  projects,
  defaultProjectId,
}: {
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        + New Task
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Task">
        <TaskForm
          projects={projects}
          defaultProjectId={defaultProjectId}
          onClose={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

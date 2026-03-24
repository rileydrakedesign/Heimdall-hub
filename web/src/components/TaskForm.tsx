"use client";

import { useActionState, useEffect } from "react";
import { createTask, updateTask, type ActionResult } from "@/lib/actions";
import { VALID_TASK_STATUSES, VALID_TASK_PRIORITIES, VALID_TASK_AREAS } from "@/lib/constants";
import type { Task } from "@/lib/task-types";
import { TextInput, TextArea, SelectField, DateInput, FormActions } from "./FormField";
import { useToast } from "./ToastProvider";

export function TaskForm({
  task,
  projects,
  defaultProjectId,
  onClose,
}: {
  task?: Task;
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
  onClose: () => void;
}) {
  const action = task ? updateTask : createTask;
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(action, { ok: false });
  const { addToast } = useToast();

  useEffect(() => {
    if (state.ok) {
      addToast(task ? "Task updated" : "Task created");
      onClose();
    } else if (state.error) {
      addToast(state.error, "error");
    }
  }, [state, task, onClose, addToast]);

  return (
    <form action={formAction} className="space-y-4">
      {task && <input type="hidden" name="task_id" value={task.id} />}

      <TextInput label="Title" name="title" defaultValue={task?.title} required />

      <div className="grid grid-cols-3 gap-3">
        <SelectField
          label="Status"
          name="status"
          required
          defaultValue={task?.status ?? "backlog"}
          options={VALID_TASK_STATUSES.map((s) => ({ value: s, label: s.replace("_", " ") }))}
        />
        <SelectField
          label="Priority"
          name="priority"
          required
          defaultValue={task?.priority ?? "medium"}
          options={VALID_TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
        />
        <SelectField
          label="Area"
          name="area"
          required
          defaultValue={task?.area ?? "work"}
          options={VALID_TASK_AREAS.map((a) => ({ value: a, label: a }))}
        />
      </div>

      <SelectField
        label="Project"
        name="project_id"
        defaultValue={task?.project_id ?? defaultProjectId ?? ""}
        options={projects.map((p) => ({ value: p.id, label: p.name }))}
      />

      <DateInput label="Due" name="due" defaultValue={task?.due ?? undefined} />

      <TextInput label="Next step" name="next_step" defaultValue={task?.next_step ?? ""} />

      <TextArea label="Notes" name="notes" defaultValue={task?.notes ?? ""} />

      <FormActions onCancel={onClose} submitLabel={task ? "Update" : "Create"} pending={pending} />
    </form>
  );
}

import { useEffect, useRef, useState } from "react";

interface EditableTask {
  id: string;
  title: string;
  dueDateTime: Date;
  priority: "high" | "medium" | "low";
}

interface EditTaskModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (
    taskId: string,
    taskData: {
      title: string;
      dueDate: string;
      dueTime: string;
      priority: "high" | "medium" | "low";
    }
  ) => void;
  onDelete: (taskId: string) => void;
  task: EditableTask | null;
}

export function EditTaskModal({ isOpen, onCancel, onSave, onDelete, task }: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!task) {
      return;
    }
    setTitle(task.title);
    setDueDate(task.dueDateTime.toISOString().slice(0, 10));
    setDueTime(task.dueDateTime.toTimeString().slice(0, 5));
    setPriority(task.priority);
  }, [task]);

  useEffect(() => {
    if (!isOpen) {
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !task) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        style={{
          background: "var(--color-background)",
          color: "var(--color-foreground)",
          border: "1px solid var(--color-border)",
          width: 420,
          maxWidth: "90vw",
          borderRadius: 8,
          padding: 16,
        }}
        onClick={(event) => event.stopPropagation()}
      >
      <form
        style={{
          display: "grid",
          gap: 8,
        }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim() || !dueDate || !dueTime) {
            return;
          }
          onSave(task.id, { title: title.trim(), dueDate, dueTime, priority });
        }}
      >
        <h2 id="edit-task-title">Edit Task</h2>
        <label htmlFor="edit-task-title-input">Task title</label>
        <input
          id="edit-task-title-input"
          ref={titleInputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          required
        />
        <label htmlFor="edit-task-date-input">Due date</label>
        <input id="edit-task-date-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
        <label htmlFor="edit-task-time-input">Due time</label>
        <input id="edit-task-time-input" type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} required />
        <label htmlFor="edit-task-priority-select">Priority</label>
        <select id="edit-task-priority-select" value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <button type="button" onClick={() => onDelete(task.id)}>
            Delete
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
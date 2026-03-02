import { useEffect, useRef, useState } from "react";

interface AddTaskModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (taskData: {
    title: string;
    dueDate: string;
    dueTime: string;
    priority: "high" | "medium" | "low";
  }) => void;
}

export function AddTaskModal({ isOpen, onCancel, onSave }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

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

  if (!isOpen) {
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
        aria-labelledby="add-task-title"
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
          onSave({ title: title.trim(), dueDate, dueTime, priority });
          setTitle("");
          setDueDate("");
          setDueTime("09:00");
          setPriority("medium");
        }}
      >
        <h2 id="add-task-title">Add Task</h2>
        <label htmlFor="add-task-title-input">Task title</label>
        <input
          id="add-task-title-input"
          ref={titleInputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          required
        />
        <label htmlFor="add-task-date-input">Due date</label>
        <input id="add-task-date-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
        <label htmlFor="add-task-time-input">Due time</label>
        <input id="add-task-time-input" type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} required />
        <label htmlFor="add-task-priority-select">Priority</label>
        <select id="add-task-priority-select" value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
      </div>
    </div>
  );
}
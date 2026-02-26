import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!task) {
      return;
    }
    setTitle(task.title);
    setDueDate(task.dueDateTime.toISOString().slice(0, 10));
    setDueTime(task.dueDateTime.toTimeString().slice(0, 5));
    setPriority(task.priority);
  }, [task]);

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
    >
      <form
        style={{ background: "#fff", width: 420, maxWidth: "90vw", borderRadius: 8, padding: 16, display: "grid", gap: 8 }}
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim() || !dueDate || !dueTime) {
            return;
          }
          onSave(task.id, { title: title.trim(), dueDate, dueTime, priority });
        }}
      >
        <h2>Edit Task</h2>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <input type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} />
        <select value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")}>
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
  );
}
import { useState } from "react";

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
    >
      <form
        style={{ background: "#fff", width: 420, maxWidth: "90vw", borderRadius: 8, padding: 16, display: "grid", gap: 8 }}
        onClick={(event) => event.stopPropagation()}
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
        <h2>Add Task</h2>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <input type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} />
        <select value={priority} onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")}>
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
  );
}
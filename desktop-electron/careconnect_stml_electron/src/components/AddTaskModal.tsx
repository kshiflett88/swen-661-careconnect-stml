import { useEffect, useRef, useState, type FormEvent } from "react";
import "./AddTaskModal.css";

interface AddTaskModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "high" | "medium" | "low";
  }) => void;
}

export function AddTaskModal({ isOpen, onCancel, onSave }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [showValidation, setShowValidation] = useState(false);

  const taskNameRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setTaskName("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPriority("medium");
    setShowValidation(false);

    const timer = window.setTimeout(() => {
      taskNameRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) {
      return;
    }

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      "input, select, button, [tabindex]:not([tabindex='-1'])"
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!dueDate || !dueTime) {
      setShowValidation(true);
      return;
    }

    const finalTaskName = taskName.trim() || "Untitled Task";

    onSave({
      title: finalTaskName,
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
    });

    setTaskName("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPriority("medium");
    setShowValidation(false);
  };

  const handleCancel = () => {
    setShowValidation(false);
    onCancel();
  };

  return (
    <div className="add-task-overlay" onClick={handleCancel}>
      <div
        ref={modalRef}
        className="add-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="add-task-header">
            <div className="add-task-header-left">
              <div className="add-task-icon-circle" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 id="add-task-title">Add New Task</h2>
            </div>
            <button type="button" className="add-task-close" onClick={handleCancel} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="add-task-body">
            <div className="add-task-field">
              <label htmlFor="task-name">Task Name</label>
              <input
                ref={taskNameRef}
                type="text"
                id="task-name"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                placeholder="Enter task name"
              />
            </div>

            <div className="add-task-field">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter task description"
              />
            </div>

            <div className="add-task-field">
              <label htmlFor="due-date">Due Date</label>
              <input
                type="date"
                id="due-date"
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setShowValidation(false);
                }}
              />
            </div>

            <div className="add-task-field">
              <label htmlFor="due-time">Due Time</label>
              <input
                type="time"
                id="due-time"
                value={dueTime}
                onChange={(event) => {
                  setDueTime(event.target.value);
                  setShowValidation(false);
                }}
              />
            </div>

            <div className="add-task-field">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as "high" | "medium" | "low")}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {showValidation && (!dueDate || !dueTime) && (
              <div className="add-task-validation">
                <p>Please select a due date and time.</p>
              </div>
            )}
          </div>

          <div className="add-task-footer">
            <button type="button" className="add-task-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="add-task-save">
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
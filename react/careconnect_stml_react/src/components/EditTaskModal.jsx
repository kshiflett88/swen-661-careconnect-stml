import { useEffect, useRef, useState } from "react";
import "./EditTaskModal.css";

export function EditTaskModal({ isOpen, onCancel, onSave, onDelete, task }) {
  const initialDate = task ? new Date(task.dueDateTime) : null;
  const initialTaskName = task?.title ?? "";
  const initialDescription = task?.description ?? "";
  const initialDueDate = initialDate
    ? `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, "0")}-${String(initialDate.getDate()).padStart(2, "0")}`
    : "";
  const initialDueTime = initialDate
    ? `${String(initialDate.getHours()).padStart(2, "0")}:${String(initialDate.getMinutes()).padStart(2, "0")}`
    : "";
  const initialPriority = task?.priority ?? "medium";

  const [taskName, setTaskName] = useState(initialTaskName);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [dueTime, setDueTime] = useState(initialDueTime);
  const [priority, setPriority] = useState(initialPriority);
  const [showValidation, setShowValidation] = useState(false);

  const taskNameRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      taskNameRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      "input, select, button, [tabindex]:not([tabindex='-1'])"
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (event) => {
      if (event.key !== "Tab") return;

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

  if (!isOpen || !task) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!dueDate || !dueTime) {
      setShowValidation(true);
      return;
    }

    const finalTaskName = taskName.trim() || "Untitled Task";
    onSave(task.id, {
      title: finalTaskName,
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
    });

    setShowValidation(false);
  };

  const handleCancel = () => {
    setShowValidation(false);
    onCancel();
  };

  return (
    <div className="edit-task-overlay" onClick={handleCancel}>
      <div
        ref={modalRef}
        className="edit-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="edit-task-header">
            <div className="edit-task-header-left">
              <div className="edit-task-icon-circle" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 20H8L18 10L14 6L4 16V20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 id="edit-task-title">Edit Task</h2>
            </div>
            <button type="button" className="edit-task-close" onClick={handleCancel} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="edit-task-body">
            <div className="edit-task-field">
              <label htmlFor="edit-task-name">Task Name</label>
              <input
                ref={taskNameRef}
                type="text"
                id="edit-task-name"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="edit-task-field">
              <label htmlFor="edit-task-description">Description</label>
              <textarea
                id="edit-task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter task description"
              />
            </div>

            <div className="edit-task-field">
              <label htmlFor="edit-due-date">Due Date</label>
              <input
                type="date"
                id="edit-due-date"
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setShowValidation(false);
                }}
                required
              />
            </div>

            <div className="edit-task-field">
              <label htmlFor="edit-due-time">Due Time</label>
              <input
                type="time"
                id="edit-due-time"
                value={dueTime}
                onChange={(event) => {
                  setDueTime(event.target.value);
                  setShowValidation(false);
                }}
                required
              />
            </div>

            <div className="edit-task-field">
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {showValidation && (!dueDate || !dueTime) && (
              <div className="edit-task-validation">
                <p>Please select a due date and time.</p>
              </div>
            )}
          </div>

          <div className="edit-task-footer">
            <button type="button" className="edit-task-delete" onClick={() => onDelete(task.id)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 6V4H16V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 6L8 20H16L17 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>Delete Task</span>
            </button>

            <div className="edit-task-footer-right">
              <button type="button" className="edit-task-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="edit-task-save">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

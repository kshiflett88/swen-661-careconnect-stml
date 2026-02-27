import { useEffect, useRef } from "react";
import type { Task } from "../types";
import "./DeleteTaskConfirmModal.css";

interface DeleteTaskConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onCancel: () => void;
  onConfirmDelete: (taskId: string) => void;
}

export function DeleteTaskConfirmModal({
  isOpen,
  task,
  onCancel,
  onConfirmDelete,
}: DeleteTaskConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen || !task) {
      return;
    }

    const timeout = window.setTimeout(() => {
      deleteButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first || !modalRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (!active || active === last || !modalRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, task, onCancel]);

  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="delete-task-confirm-overlay" onClick={onCancel}>
      <div
        className="delete-task-confirm-modal"
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        aria-describedby="delete-task-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-task-confirm-header">
          <div className="delete-task-confirm-title-wrap">
            <span className="delete-task-confirm-warning-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2L2 20h20L12 2zm0 5.2c.6 0 1 .4 1 1v5.2c0 .6-.4 1-1 1s-1-.4-1-1V8.2c0-.6.4-1 1-1zm0 11c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z" />
              </svg>
            </span>
            <h2 id="delete-task-title">Delete Task?</h2>
          </div>
          <button
            type="button"
            className="delete-task-confirm-close"
            onClick={onCancel}
            aria-label="Close delete task confirmation"
          >
            ×
          </button>
        </div>

        <div className="delete-task-confirm-body">
          <p id="delete-task-description">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>

          <div className="delete-task-confirm-task-box">
            <p className="delete-task-confirm-task-name">&quot;{task.title}&quot;</p>
          </div>
        </div>

        <div className="delete-task-confirm-actions">
          <button type="button" className="delete-task-confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            ref={deleteButtonRef}
            type="button"
            className="delete-task-confirm-delete"
            onClick={() => onConfirmDelete(task.id)}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

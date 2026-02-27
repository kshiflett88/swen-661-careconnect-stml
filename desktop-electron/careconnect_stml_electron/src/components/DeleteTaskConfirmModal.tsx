import { ConfirmDialog } from "./ConfirmDialog";

interface DeleteTaskConfirmModalProps {
  isOpen: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTaskConfirmModal({ isOpen, taskTitle, onCancel, onConfirm }: DeleteTaskConfirmModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Task"
      message={`Are you sure you want to delete “${taskTitle || "this task"}”?`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
interface DeleteTaskConfirmModalProps {
  isOpen: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTaskConfirmModal({ isOpen, taskTitle, onCancel, onConfirm }: DeleteTaskConfirmModalProps) {
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
      <div
        style={{ background: "#fff", width: 420, maxWidth: "90vw", borderRadius: 8, padding: 16 }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Delete Task</h2>
        <p>Are you sure you want to delete “{taskTitle || "this task"}”?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
interface EmergencyModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  confirmed: boolean;
}

export function EmergencyModal({ isOpen, onConfirm, onCancel, onClose, confirmed }: EmergencyModalProps) {
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
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", width: 420, maxWidth: "90vw", borderRadius: 8, padding: 16 }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Emergency</h2>
        {!confirmed ? (
          <p>Contact caregiver now?</p>
        ) : (
          <p>Caregiver contact has been triggered (placeholder behavior).</p>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {!confirmed && <button onClick={onConfirm}>Confirm</button>}
          <button onClick={onCancel}>{confirmed ? "Close" : "Cancel"}</button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onMarkComplete: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, onEdit, onMarkComplete, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      onClose();
    };

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: x,
        top: y,
        background: "#fff",
        border: "1px solid #d0d0d0",
        borderRadius: 6,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        zIndex: 1000,
        minWidth: 150,
        padding: 6,
        display: "grid",
        gap: 4,
      }}
    >
      <button onClick={onEdit}>Edit task</button>
      <button onClick={onMarkComplete}>Mark complete</button>
      <button onClick={onDelete}>Delete task</button>
    </div>
  );
}
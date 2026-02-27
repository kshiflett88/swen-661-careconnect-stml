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
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

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

  useEffect(() => {
    itemRefs.current[0]?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % itemRefs.current.length : 0;
      itemRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : itemRefs.current.length - 1;
      itemRefs.current[previousIndex]?.focus();
    }
  };

  const menuButtonStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "8px 10px",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    background: "var(--color-background)",
    color: "var(--color-foreground)",
    cursor: "pointer",
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Task options"
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        left: x,
        top: y,
        background: "var(--color-background)",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        zIndex: 1000,
        minWidth: 150,
        padding: 6,
        display: "grid",
        gap: 4,
      }}
    >
      <button
        ref={(element) => {
          itemRefs.current[0] = element;
        }}
        role="menuitem"
        onClick={() => {
          onEdit();
          onClose();
        }}
        style={menuButtonStyle}
      >
        Edit task
      </button>
      <button
        ref={(element) => {
          itemRefs.current[1] = element;
        }}
        role="menuitem"
        onClick={() => {
          onMarkComplete();
          onClose();
        }}
        style={menuButtonStyle}
      >
        Mark complete
      </button>
      <button
        ref={(element) => {
          itemRefs.current[2] = element;
        }}
        role="menuitem"
        onClick={() => {
          onDelete();
          onClose();
        }}
        style={menuButtonStyle}
      >
        Delete task
      </button>
    </div>
  );
}
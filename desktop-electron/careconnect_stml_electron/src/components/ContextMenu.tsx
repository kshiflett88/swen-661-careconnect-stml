import { useEffect, useRef, type KeyboardEvent } from "react";
import "./ContextMenu.css";

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
    const menuItems = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    menuItems?.[0]?.focus();

    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      onClose();
    };

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [onClose]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) {
      return;
    }

    const items = Array.from(menuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
    if (items.length === 0) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    const currentIndex = items.findIndex((item) => item === activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      items[nextIndex].focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  };

  return (
    <div
      ref={menuRef}
      className="task-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="Task quick actions"
      onKeyDown={handleMenuKeyDown}
    >
      <button type="button" className="task-context-menu-item" onClick={onEdit} role="menuitem">
        <span className="task-context-menu-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20H8L18 10L14 6L4 16V20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span>Edit</span>
      </button>

      <button type="button" className="task-context-menu-item" onClick={onMarkComplete} role="menuitem">
        <span className="task-context-menu-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>Mark Complete</span>
      </button>

      <div className="task-context-menu-separator" role="separator" />

      <button type="button" className="task-context-menu-item destructive" onClick={onDelete} role="menuitem">
        <span className="task-context-menu-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 6V4H16V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 6L8 20H16L17 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </span>
        <span>Delete</span>
      </button>
    </div>
  );
}
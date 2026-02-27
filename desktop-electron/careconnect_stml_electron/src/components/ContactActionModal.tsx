import { useEffect, useRef } from "react";
import "./ContactActionModal.css";

type ContactModalVariant = "primary" | "danger";
type ContactModalIcon = "phone" | "message" | "alert";

interface ContactActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  contextText?: string;
  confirmLabel: string;
  variant?: ContactModalVariant;
  icon?: ContactModalIcon;
  onCancel: () => void;
  onConfirm: () => void;
}

function ModalIcon({ icon = "phone" }: { icon?: ContactModalIcon }) {
  if (icon === "message") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V14.5C20 15.33 19.33 16 18.5 16H10L6.5 19V16H5.5C4.67 16 4 15.33 4 14.5V6.5Z" />
      </svg>
    );
  }

  if (icon === "alert") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12.8" />
        <circle cx="12" cy="16.4" r="1.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.2C4 4.54 4.54 4 5.2 4H8.5C9.06 4 9.55 4.39 9.69 4.93L10.35 7.58C10.47 8.04 10.32 8.53 9.96 8.86L8.38 10.31C9.19 11.99 10.52 13.34 12.2 14.16L13.64 12.58C13.98 12.22 14.46 12.08 14.93 12.19L17.57 12.85C18.12 12.99 18.5 13.48 18.5 14.04V17.3C18.5 17.96 17.96 18.5 17.3 18.5H16C9.37 18.5 4 13.13 4 6.5V5.2Z" />
    </svg>
  );
}

export function ContactActionModal({
  isOpen,
  title,
  description,
  contextText,
  confirmLabel,
  variant = "primary",
  icon = "phone",
  onCancel,
  onConfirm,
}: ContactActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      confirmButtonRef.current?.focus();
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
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="contact-action-overlay" onClick={onCancel}>
      <div
        className="contact-action-modal"
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="contact-action-title"
        aria-describedby="contact-action-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="contact-action-header">
          <div className="contact-action-title-wrap">
            <span className={`contact-action-icon ${variant}`}>
              <ModalIcon icon={icon} />
            </span>
            <h2 id="contact-action-title">{title}</h2>
          </div>
          <button
            type="button"
            className="contact-action-close"
            onClick={onCancel}
            aria-label="Close contact action confirmation"
          >
            ×
          </button>
        </div>

        <div className="contact-action-body">
          <p id="contact-action-description">{description}</p>
          {contextText && (
            <div className="contact-action-context-box">
              <p className="contact-action-context-text">{contextText}</p>
            </div>
          )}
        </div>

        <div className="contact-action-footer">
          <button type="button" className="contact-action-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`contact-action-confirm ${variant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

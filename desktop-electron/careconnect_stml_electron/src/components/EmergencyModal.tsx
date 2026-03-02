// src/components/EmergencyModal.tsx
import React, { useEffect, useId, useRef } from "react";

interface EmergencyModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  borderColor?: string;

  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;

  /** Extra context read by screen readers (optional) */
  ariaHint?: string;
}

const styles = `
  :root{
    --focus:#2563eb;
    --text:#111827;
    --muted:#6b7280;
    --border:#e5e7eb;
  }
  .overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:2000;
    padding:16px;
  }
  .dialog{
    width:min(820px, 92vw);
    background:#fff;
    border-radius:22px;
    border:4px solid var(--border);
    box-shadow:0 18px 60px rgba(0,0,0,.35);
    overflow:hidden;
  }
  .dialogHeader{
    padding:26px 26px 18px;
    display:flex;
    gap:18px;
    align-items:flex-start;
  }
  .icon{
    width:64px;height:64px;border-radius:999px;
    background:var(--border);
    display:flex;align-items:center;justify-content:center;
    flex:none;
  }
  .iconInner{
    width:52px;height:52px;border-radius:999px;
    display:flex;align-items:center;justify-content:center;
    font-size:24px;font-weight:900;
    background:#fff;
  }
  .h1{
    margin:0;
    font-size:52px;
    font-weight:900;
    color:var(--text);
  }
  .p{
    margin:12px 0 0;
    font-size:24px;
    color:var(--text);
    line-height:1.35;
  }
  .hint{
    margin:10px 0 0;
    font-size:16px;
    color:var(--muted);
  }
  .actions{
    padding:20px 26px 30px;
    display:flex;
    flex-direction:column;
    gap:16px;
    align-items:center;
  }
  .primary{
    width:min(640px, 90%);
    background:#c62828;
    border:2px solid #c62828;
    color:#fff;
    border-radius:18px;
    padding:22px 16px;
    font-size:28px;
    font-weight:900;
    letter-spacing:.3px;
    cursor:pointer;
  }
  .primary:hover{filter:brightness(.92)}
  .secondary{
    border:none;
    background:transparent;
    color:#6b7280;
    font-size:22px;
    font-weight:700;
    cursor:pointer;
    padding:8px 10px;
  }

  .primary:focus-visible, .secondary:focus-visible{
    outline:4px solid var(--focus);
    outline-offset:4px;
    border-radius:18px;
  }
`;

export function EmergencyModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  borderColor = "#c62828",
  onConfirm,
  onCancel,
  onClose,
  ariaHint,
}: EmergencyModalProps) {
  const titleId = useId();
  const descId = useId();
  const hintId = useId();

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  // Focus management + ESC close + basic focus trap
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;

        const focusables = root.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      prev?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        className="overlay"
        role="presentation"
        onMouseDown={(e) => {
          // click outside closes
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={dialogRef}
          className="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={ariaHint ? `${descId} ${hintId}` : descId}
          style={{ borderColor }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="dialogHeader">
            <div className="icon" aria-hidden="true" style={{ background: borderColor }}>
              <div className="iconInner" style={{ color: borderColor }}>
                !
              </div>
            </div>

            <div>
              <h2 id={titleId} className="h1">
                {title}
              </h2>
              <p id={descId} className="p">
                {message}
              </p>
              {ariaHint ? (
                <p id={hintId} className="hint">
                  {ariaHint}
                </p>
              ) : null}
            </div>
          </div>

          <div className="actions">
            <button
              ref={confirmRef}
              type="button"
              className="primary"
              onClick={onConfirm}
              aria-label={confirmText}
            >
              {confirmText}
            </button>

            <button type="button" className="secondary" onClick={onCancel} aria-label={cancelText}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
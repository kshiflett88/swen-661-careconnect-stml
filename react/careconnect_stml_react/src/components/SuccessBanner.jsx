import { useEffect, useRef } from "react";
import "./SuccessBanner.css";

export function SuccessBanner({ message, isVisible, onDismiss }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    timerRef.current = window.setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="success-banner" role="status" aria-live="polite">
      <svg
        className="success-banner-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="success-banner-message">{message}</span>
      <button
        className="success-banner-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

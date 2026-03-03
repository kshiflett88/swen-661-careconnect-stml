// src/screens/EmergencyCallingScreen.tsx
import React, { useEffect, useRef } from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

const styles = `
  :root{
    --red:#c62828;
    --text:#111827;
    --muted:#6b7280;
    --border:#e5e7eb;
    --focus:#2563eb;
  }
  .wrap{max-width:980px;margin:0 auto;padding:16px 18px}
  .panel{
    border:4px solid var(--red);
    border-radius:22px;
    background:#fff;
    padding:22px;
    box-shadow:0 10px 30px rgba(0,0,0,.12);
  }
  .title{font-size:42px;font-weight:900;margin:0 0 8px}
  .status{font-size:20px;color:var(--muted);margin:0 0 16px}
  .callRow{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:14px;
    flex-wrap:wrap;
    margin-top:14px;
    padding-top:14px;
    border-top:1px solid var(--border);
  }
  .btn{
    border-radius:14px;
    border:2px solid var(--border);
    background:#fff;
    padding:14px 16px;
    font-size:18px;
    font-weight:800;
    cursor:pointer;
    min-width:220px;
  }
  .btnPrimary{
    background:var(--red);
    border-color:var(--red);
    color:#fff;
  }
  .btnPrimary:hover{filter:brightness(.92)}
  .btn:focus-visible{
    outline:4px solid var(--focus);
    outline-offset:4px;
  }
  .live{
    font-weight:800;
    color:var(--text);
  }
`;

export default function EmergencyCallingScreen(props: { onGo: (screen: ScreenId) => void }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <ScreenShell
      title="Emergency Calling"
      description="Emergency calling screen. Shows that caregiver contact is in progress."
      onGo={props.onGo}
    >
      <style>{styles}</style>

      <div className="wrap">
        <div className="panel" role="region" aria-label="Emergency calling panel">
          <h1 ref={headingRef} tabIndex={-1} className="title" style={{ outline: "none" }}>
            Emergency Calling
          </h1>
          <p className="status">
            Status: <span className="live" aria-live="polite">Calling caregiver now…</span>
          </p>

          <div className="callRow" role="group" aria-label="Calling actions">
            <button
              type="button"
              className="btn"
              onClick={() => props.onGo("emergency")}
              aria-label="Return to emergency screen"
            >
              Return
            </button>

            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => props.onGo("task-list")}
              aria-label="Return to tasks after emergency"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
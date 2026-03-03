// src/screens/EmergencyConfirmationScreen.tsx
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
    padding:22px 22px 18px;
    box-shadow:0 10px 30px rgba(0,0,0,.12);
  }
  h1{margin:0 0 10px;font-size:40;font-weight:900}
  .p{font-size:18px;color:var(--muted);margin:0 0 18px}
  .row{
    display:flex;
    justify-content:space-between;
    gap:16px;
    flex-wrap:wrap;
    margin-top:14px;
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
`;

export default function EmergencyConfirmationScreen(props: { onGo: (screen: ScreenId) => void }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <ScreenShell
      title="Emergency Confirmation"
      description="Emergency confirmation screen. Confirms that contacting the caregiver will begin."
      onGo={props.onGo}
    >
      <style>{styles}</style>

      <div className="wrap">
        <div className="panel" role="region" aria-label="Emergency confirmation panel">
          <h1 ref={headingRef} tabIndex={-1} style={{ outline: "none" }}>
            Confirm Emergency Contact
          </h1>
          <p className="p">
            You are about to contact your caregiver. If this is an emergency, call 911 immediately.
          </p>

          <div className="row">
            <button
              type="button"
              className="btn"
              onClick={() => props.onGo("emergency")}
              aria-label="Go back to emergency screen"
            >
              Back
            </button>

            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => props.onGo("emergency-calling")}
              aria-label="Start contacting caregiver"
            >
              Start Calling
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
// src/screens/EmergencyScreen.tsx
import React, { useMemo, useState } from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";
import { EmergencyModal } from "../components/EmergencyModal";

const styles = `
  :root{
    --red:#c62828;
    --redDark:#a51f1f;
    --text:#111827;
    --muted:#6b7280;
    --border:#e5e7eb;
    --bg:#ffffff;
    --focus:#2563eb;
  }
  .srOnly{
    position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
    clip:rect(0,0,0,0);white-space:nowrap;border:0;
  }
  .wrap{
    max-width:1040px;
    margin:0 auto;
    padding:12px 18px 18px;
  }
  .card{
    border:4px solid var(--red);
    border-radius:22px;
    overflow:hidden;
    background:var(--bg);
    box-shadow:0 10px 30px rgba(0,0,0,.15);
  }
  .header{
    background:var(--red);
    color:#fff;
    padding:22px 26px;
    display:flex;
    gap:18px;
    align-items:center;
  }
  .iconCircle{
    width:64px;height:64px;border-radius:999px;
    background:#fff;display:flex;align-items:center;justify-content:center;
    flex:none;
  }
  .iconInner{
    width:44px;height:44px;border-radius:999px;
    border:4px solid var(--red);
    display:flex;align-items:center;justify-content:center;
    color:var(--red);
    font-weight:900;
    font-size:22px;
    line-height:1;
  }
  .title{
    font-size:44px;
    font-weight:900;
    margin:0;
    letter-spacing:.2px;
  }
  .subtitle{
    margin-top:6px;
    font-size:20px;
    opacity:.95;
  }
  .body{
    padding:26px 28px 24px;
  }
  .label{
    color:var(--muted);
    font-size:22px;
    margin:0 0 10px;
  }
  .number{
    font-size:62px;
    font-weight:900;
    margin:0 0 22px;
    color:var(--text);
  }
  .cta{
    width:100%;
    background:var(--red);
    color:#fff;
    border:2px solid var(--red);
    border-radius:22px;
    padding:26px 18px;
    font-size:30px;
    font-weight:900;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:14px;
    min-height:92px;
  }
  .cta:hover{background:var(--redDark);border-color:var(--redDark)}
  .cta:active{transform:translateY(1px)}
  .helpText{
    text-align:center;
    color:var(--muted);
    font-size:22px;
    margin:20px 0 0;
  }

  /* Focus states */
  :focus{outline:none}
  .cta:focus-visible{
    outline:4px solid var(--focus);
    outline-offset:4px;
  }

  @media (prefers-reduced-motion: reduce){
    .cta{transition:none}
    .cta:active{transform:none}
  }
`;

function PhoneIcon() {
  return (
    <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2c-8.6-.8-15.5-7.7-16.3-16.3A2 2 0 0 1 5.5 3h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.4a2 2 0 0 1-.5 2.1L9.4 10.4a14.5 14.5 0 0 0 4.2 4.2l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.4.6a2 2 0 0 1 1.7 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EmergencyScreen(props: { onGo: (screen: ScreenId) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emergencyNumber = "911";
  const caregiverName = "Sarah Miller";

  const descriptionText = useMemo(
    () => `Emergency Services screen. Emergency number ${emergencyNumber}. Press Call Emergency Services to proceed.`,
    [emergencyNumber]
  );

  return (
    <ScreenShell title="Emergency SOS" description={descriptionText} onGo={props.onGo}>
      <style>{styles}</style>

      <div className="wrap">
        <div className="card" role="region" aria-label="Emergency services panel">
          <div className="header">
            <div className="iconCircle" aria-hidden="true">
              <div className="iconInner">!</div>
            </div>
            <div>
              <h1 className="title">Emergency Services</h1>
              <div className="subtitle">For immediate medical help</div>
            </div>
          </div>

          <div className="body">
            <p className="label" id="emergencyNumberLabel">
              Emergency Number
            </p>
            <p className="number" aria-labelledby="emergencyNumberLabel">
              {emergencyNumber}
            </p>

            <button
              className="cta"
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label="Call emergency services"
              aria-describedby="emergencyHelp"
            >
              <PhoneIcon />
              Call Emergency Services
            </button>

            <p className="helpText" id="emergencyHelp">
              Use this for medical emergencies, injuries, or when you feel unsafe
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation modal (from screenshot) */}
      <EmergencyModal
        isOpen={isModalOpen}
        title="Emergency Assistance"
        message="If you need help right now, press the button below."
        confirmText="CONTACT CAREGIVER NOW"
        cancelText="Cancel"
        borderColor="#c62828"
        onConfirm={() => {
          setIsModalOpen(false);
          // Navigate to confirmation screen (your flow)
          props.onGo("emergency-confirmation");
        }}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        // extra context for screen readers
        ariaHint={`This will contact your caregiver, ${caregiverName}.`}
      />
    </ScreenShell>
  );
}
import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

export default function EmergencyConfirmationScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Emergency Confirmation"
      description="Placeholder matching the Flutter Emergency Confirmation screen."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Emergency Confirmation (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>

      <button
        onClick={() => props.onGo("emergency_calling")}
        style={{
          marginTop: 10,
          fontSize: 18,
          padding: "12px 16px",
          borderRadius: 10,
          border: "2px solid #0D47A1",
          background: "#0D47A1",
          color: "#fff",
          cursor: "pointer",
        }}
        aria-label="Go to emergency calling"
      >
        Start Calling (Demo Nav)
      </button>
    </ScreenShell>
  );
}
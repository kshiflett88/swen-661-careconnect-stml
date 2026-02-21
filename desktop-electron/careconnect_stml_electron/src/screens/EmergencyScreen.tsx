import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

export default function EmergencyScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Emergency SOS"
      description="Placeholder matching the Flutter Emergency SOS screen."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Emergency SOS (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>

      <button
        onClick={() => props.onGo("emergency_confirmation")}
        style={{
          marginTop: 10,
          fontSize: 18,
          padding: "12px 16px",
          borderRadius: 10,
          border: "2px solid #C62828",
          background: "#C62828",
          color: "#fff",
          cursor: "pointer",
        }}
        aria-label="Go to emergency confirmation"
      >
        Confirm SOS (Demo Nav)
      </button>
    </ScreenShell>
  );
}
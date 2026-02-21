import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

export default function EmergencyCallingScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Emergency Calling"
      description="Placeholder matching the Flutter Emergency Calling screen."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Emergency Calling (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>
    </ScreenShell>
  );
}
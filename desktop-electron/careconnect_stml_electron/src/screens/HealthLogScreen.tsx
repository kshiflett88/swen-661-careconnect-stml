import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

export default function HealthLogScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Health Log"
      description="Placeholder matching the Flutter Health Log screen."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Health Log (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>
    </ScreenShell>
  );
}
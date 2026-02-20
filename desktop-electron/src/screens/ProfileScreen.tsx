import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

export default function ProfileScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Profile"
      description="Placeholder matching the Flutter Profile screen."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Profile (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>
    </ScreenShell>
  );
}
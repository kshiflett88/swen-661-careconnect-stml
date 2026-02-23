import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "./index";

export default function SignInHelpScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Sign In Help"
      description="Placeholder matching the Flutter Sign In Help screen."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Sign In Help (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>
    </ScreenShell>
  );
}
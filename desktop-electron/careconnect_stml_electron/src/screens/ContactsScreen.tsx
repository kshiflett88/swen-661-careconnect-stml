import React from "react";
import ScreenShell from "./_ScreenShell";
import type { ScreenId } from "../types";

export default function ContactsScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <ScreenShell
      title="Contacts"
      description="Emergency contacts and care team."
      onGo={props.onGo}
    >
      <h1 style={{ fontSize: 28, margin: 0 }}>Contacts (Placeholder)</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>This screen will be implemented later.</p>
    </ScreenShell>
  );
}

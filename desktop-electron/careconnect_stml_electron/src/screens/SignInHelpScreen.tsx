import React from "react";
import type { ScreenId } from "../types";
import { colors, sizing, typography } from "../constants/accessibility";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export default function SignInHelpScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <main
      role="main"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: sizing.spaceLg,
        background: colors.backgroundAlt,
      }}
    >
      <Card padding="large">
        <div style={{ maxWidth: 540, fontFamily: typography.fontFamilyBase }}>
          <h1 style={{ marginTop: 0, marginBottom: sizing.spaceMd }}>Sign In Help</h1>
          <p style={{ marginTop: 0, marginBottom: sizing.spaceMd, lineHeight: typography.lineHeightRelaxed }}>
            If you are having trouble signing in, make sure this device supports your configured sign-in method and
            try again.
          </p>
          <ul style={{ marginTop: 0, marginBottom: sizing.spaceLg, lineHeight: typography.lineHeightRelaxed }}>
            <li>Check your internet connection.</li>
            <li>Confirm your biometric or passkey setup on this device.</li>
            <li>Contact support if the issue continues.</li>
          </ul>
          <Button onClick={() => props.onGo("welcome")} variant="secondary" size="large" ariaLabel="Back to sign in">
            Back to Sign In
          </Button>
        </div>
      </Card>
    </main>
  );
}
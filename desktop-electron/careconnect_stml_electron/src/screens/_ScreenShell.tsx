import React from "react";
import type { ScreenId } from "./index";

export default function ScreenShell(props: {
  title: string;
  description: string;
  children?: React.ReactNode;
  onGo: (screen: ScreenId) => void;
}) {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      {/* STML orientation cue */}
      <div style={{ background: "#fff", border: "2px solid #0D47A1", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>You are on: {props.title}</div>
        <div style={{ marginTop: 6, fontSize: 16 }}>{props.description}</div>
      </div>

      <section style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #DDD" }}>
        {props.children}

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => props.onGo("dashboard")}
            style={{
              fontSize: 18,
              padding: "12px 16px",
              borderRadius: 10,
              border: "2px solid #37474F",
              background: "#fff",
              cursor: "pointer",
            }}
            aria-label="Return to dashboard"
          >
            Return to Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}
import React from "react";
import { SCREEN_LIST, type ScreenId } from "./index";

export default function DashboardScreen(props: { onGo: (screen: ScreenId) => void }) {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ background: "#fff", border: "2px solid #0D47A1", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>You are on: Dashboard</div>
        <div style={{ marginTop: 6, fontSize: 16 }}>
          Choose where you want to go. (Desktop placeholders mirroring Flutter screens)
        </div>
      </div>

      <section style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #DDD" }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>CareConnect Desktop (Early Electron Shell)</h1>
        <p style={{ fontSize: 18, marginTop: 10 }}>
          Buttons below navigate to a placeholder for each Flutter screen.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 16 }}>
          {SCREEN_LIST.map((s) => (
            <button
              key={s.id}
              onClick={() => props.onGo(s.id)}
              style={{
                textAlign: "left",
                fontSize: 16,
                padding: "14px 14px",
                borderRadius: 12,
                border: "2px solid #0D47A1",
                background: "white",
                cursor: "pointer",
              }}
              aria-label={`Go to ${s.title}`}
            >
              <div style={{ fontWeight: 800, fontSize: 18 }}>{s.title}</div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>{s.description}</div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
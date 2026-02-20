import React from "react";

export default function Tasks(props: { onBack: () => void }) {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ background: "#fff", border: "2px solid #0D47A1", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>You are on: Tasks</div>
        <div style={{ marginTop: 6, fontSize: 16 }}>Choose one item (demo list).</div>
      </div>

      <section style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #DDD" }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Tasks</h1>
        <ul style={{ fontSize: 18, marginTop: 14, lineHeight: 1.6 }}>
          <li>Take morning medication</li>
          <li>Drink water</li>
          <li>Short walk</li>
        </ul>

        <button
          onClick={props.onBack}
          style={{ marginTop: 14, fontSize: 18, padding: "12px 16px", borderRadius: 10, border: "2px solid #37474F", background: "#fff", cursor: "pointer" }}
          aria-label="Return to dashboard"
        >
          Return to Home
        </button>
      </section>
    </main>
  );
}
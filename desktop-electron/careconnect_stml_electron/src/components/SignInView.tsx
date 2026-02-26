interface SignInViewProps {
  onSignIn: () => void;
}

export function SignInView({ onSignIn }: SignInViewProps) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f6f6",
      }}
    >
      <div style={{ width: 360, background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 20 }}>
        <h1>CareConnect</h1>
        <p>This is a placeholder sign-in screen.</p>
        <button onClick={onSignIn}>Sign In</button>
      </div>
    </div>
  );
}
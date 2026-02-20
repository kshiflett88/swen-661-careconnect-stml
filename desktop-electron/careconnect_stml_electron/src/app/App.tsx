import React, { useEffect, useState } from "react";
import Dashboard from "../screens/DashboardScreen";
import Tasks from "../screens/Tasks";

type Route = "dashboard" | "tasks";

export default function App() {
  const [route, setRoute] = useState<Route>("dashboard");
  const [textScale, setTextScale] = useState<number>(1);

  useEffect(() => {
    const unsubNav = window.careconnect.onNavigate(setRoute);
    const unsubScale = window.careconnect.onTextScale((action) => {
      setTextScale((prev) => {
        if (action === "reset") return 1;
        if (action === "up") return Math.min(prev + 0.1, 1.6);
        return Math.max(prev - 0.1, 0.9);
      });
    });
    return () => {
      unsubNav();
      unsubScale();
    };
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F5F5F5", minHeight: "100vh", fontSize: `${textScale}em` }}>
      {route === "tasks" ? (
        <Tasks onBack={() => setRoute("dashboard")} />
      ) : (
        <Dashboard onGo={() => setRoute("tasks")} />
      )}
    </div>
  );
}
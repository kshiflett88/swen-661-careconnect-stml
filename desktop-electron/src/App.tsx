import React, { useEffect, useState } from "react";
import type { ScreenId } from "./screens";
import DashboardScreen from "./screens/DashboardScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInHelpScreen from "./screens/SignInHelpScreen";
import TaskListScreen from "./screens/TaskListScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";
import HealthLogScreen from "./screens/HealthLogScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import EmergencyConfirmationScreen from "./screens/EmergencyConfirmationScreen";
import EmergencyCallingScreen from "./screens/EmergencyCallingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AccessibilityScreen from "./screens/AccessibilityScreen";

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("dashboard");

  // Optional: accept Electron menu nav events if you have them
  useEffect(() => {
    if (!window.careconnect?.onNavigate) return;
    const unsub = window.careconnect.onNavigate((route) => {
      if (route === "dashboard") setScreen("dashboard");
      if (route === "tasks") setScreen("task_list"); // map old "tasks" menu item
    });
    return () => unsub?.();
  }, []);

  switch (screen) {
    case "dashboard":
      return <DashboardScreen onGo={setScreen} />;

    case "welcome":
      return <WelcomeScreen onGo={setScreen} />;
    case "sign_in_help":
      return <SignInHelpScreen onGo={setScreen} />;
    case "task_list":
      return <TaskListScreen onGo={setScreen} />;
    case "task_detail":
      return <TaskDetailScreen onGo={setScreen} />;
    case "health_log":
      return <HealthLogScreen onGo={setScreen} />;
    case "emergency":
      return <EmergencyScreen onGo={setScreen} />;
    case "emergency_confirmation":
      return <EmergencyConfirmationScreen onGo={setScreen} />;
    case "emergency_calling":
      return <EmergencyCallingScreen onGo={setScreen} />;
    case "profile":
      return <ProfileScreen onGo={setScreen} />;
    case "accessibility":
      return <AccessibilityScreen onGo={setScreen} />;

    default:
      return <DashboardScreen onGo={setScreen} />
  }
}
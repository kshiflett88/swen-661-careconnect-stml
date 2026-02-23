import React, { useEffect, useState } from "react";
import type { ScreenId } from "./screens";
import DashboardScreen from "./screens/DashboardScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInHelpScreen from "./screens/SignInHelpScreen";
import TaskListScreen from "./screens/TaskListScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";
import HealthLogScreen from "./screens/HealthLogScreen";
import ContactsScreen from "./screens/ContactsScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import EmergencyConfirmationScreen from "./screens/EmergencyConfirmationScreen";
import EmergencyCallingScreen from "./screens/EmergencyCallingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AccessibilityScreen from "./screens/AccessibilityScreen";

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("welcome");
  const [textScale, setTextScale] = useState<number>(1);
  const screenRef = React.useRef<ScreenId>("welcome");

  // Keep ref in sync with state
  React.useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  // Optional: accept Electron menu nav events if you have them
  useEffect(() => {
    if (!window.careconnect?.onNavigate) return;
    
    const unsub = window.careconnect.onNavigate((route) => {
      // Don't allow navigation shortcuts from welcome/signin screens
      // User must sign in first
      if (screenRef.current === "welcome" || screenRef.current === "signin-help") {
        return;
      }
      setScreen(route);
    });
    
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!window.careconnect?.onTextScale) return;
    const unsub = window.careconnect.onTextScale((action) => {
      setTextScale((prev) => {
        if (action === "reset") return 1;
        if (action === "up") return Math.min(prev + 0.1, 1.6);
        return Math.max(prev - 0.1, 0.9);
      });
    });
    return () => unsub?.();
  }, []);

  let content: React.ReactNode;

  switch (screen) {
    case "dashboard":
      content = <DashboardScreen onGo={setScreen} />;
      break;

    case "welcome":
      content = <WelcomeScreen onGo={setScreen} />;
      break;
    case "signin-help":
      content = <SignInHelpScreen onGo={setScreen} />;
      break;
    case "task-list":
      content = <TaskListScreen onGo={setScreen} />;
      break;
    case "task-detail":
      content = <TaskDetailScreen onGo={setScreen} />;
      break;
    case "health-log":
      content = <HealthLogScreen onGo={setScreen} />;
      break;
    case "contacts":
      content = <ContactsScreen onGo={setScreen} />;
      break;
    case "emergency":
      content = <EmergencyScreen onGo={setScreen} />;
      break;
    case "emergency-confirmation":
      content = <EmergencyConfirmationScreen onGo={setScreen} />;
      break;
    case "emergency-calling":
      content = <EmergencyCallingScreen onGo={setScreen} />;
      break;
    case "profile":
      content = <ProfileScreen onGo={setScreen} />;
      break;
    case "accessibility":
      content = <AccessibilityScreen onGo={setScreen} />;
      break;

    default:
      content = <DashboardScreen onGo={setScreen} />;
      break;
  }

  return <div style={{ fontSize: `${textScale}em` }}>{content}</div>;
}
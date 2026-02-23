// Re-export types from centralized types directory
export type { ScreenId } from "../types";

// Screen metadata for navigation
export const SCREEN_LIST: { id: import("../types").ScreenId; title: string; description: string }[] = [
  { id: "welcome", title: "Welcome / Login", description: "Start screen for patient/caregiver" },
  { id: "signin-help", title: "Sign In Help", description: "Sign-in instructions and help" },
  { id: "dashboard", title: "Dashboard", description: "Main dashboard with task overview" },
  { id: "task-list", title: "Task List", description: "List of tasks for the day" },
  { id: "task-detail", title: "Task Detail", description: "Details for a selected task" },
  { id: "health-log", title: "Health Log", description: "Log mood/symptoms/vitals" },
  { id: "emergency", title: "Emergency SOS", description: "Start SOS flow" },
  { id: "emergency-confirmation", title: "Emergency Confirmation", description: "Confirm SOS action" },
  { id: "emergency-calling", title: "Emergency Calling", description: "Calling/connecting screen" },
  { id: "profile", title: "Profile", description: "User settings/profile" },
  { id: "accessibility", title: "Accessibility", description: "Accessibility options/guidelines" },
];
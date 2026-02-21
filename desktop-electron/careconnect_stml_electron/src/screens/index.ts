export type ScreenId =
  | "dashboard"
  | "welcome"
  | "sign_in_help"
  | "task_list"
  | "task_detail"
  | "health_log"
  | "emergency"
  | "emergency_confirmation"
  | "emergency_calling"
  | "profile"
  | "accessibility";

export const SCREEN_LIST: { id: ScreenId; title: string; description: string }[] = [
  { id: "welcome", title: "Welcome / Login", description: "Start screen for patient/caregiver" },
  { id: "sign_in_help", title: "Sign In Help", description: "Sign-in instructions and help" },
  { id: "task_list", title: "Task List", description: "List of tasks for the day" },
  { id: "task_detail", title: "Task Detail", description: "Details for a selected task" },
  { id: "health_log", title: "Health Log", description: "Log mood/symptoms/vitals" },
  { id: "emergency", title: "Emergency SOS", description: "Start SOS flow" },
  { id: "emergency_confirmation", title: "Emergency Confirmation", description: "Confirm SOS action" },
  { id: "emergency_calling", title: "Emergency Calling", description: "Calling/connecting screen" },
  { id: "profile", title: "Profile", description: "User settings/profile" },
  { id: "accessibility", title: "Accessibility", description: "Accessibility options/guidelines" },
];
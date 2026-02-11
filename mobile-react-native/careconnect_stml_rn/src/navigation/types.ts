import { Routes } from './routes';

export type RootStackParamList = {
  [Routes.Dashboard]: undefined;
  [Routes.WelcomeLogin]: undefined;
  [Routes.Emergency]: undefined;
  [Routes.EmergencyCalling]: undefined;
  [Routes.EmergencyConfirmation]: undefined;
  [Routes.EmergencyAlertSent]: undefined;
  [Routes.TaskList]: undefined;
  [Routes.TaskDetail]: { taskId: string } | undefined; // adjust if you want required
  [Routes.HealthLogging]: undefined;
  [Routes.Profile]: undefined;
  [Routes.AccessibilitySettings]: undefined;
  [Routes.SignInHelp]: undefined;
};

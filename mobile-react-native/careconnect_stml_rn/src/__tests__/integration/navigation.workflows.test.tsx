import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { renderWithNav } from "../../test-utils/renderWithNav";
import { Routes } from "../../navigation/routes";

// Screens (adjust paths to match your repo)
import WelcomeLoginScreen from "../../screens/Welcome/WelcomeLoginScreen";
import DashboardScreen from "../../screens/Dashboard/DashboardScreen";
import SignInHelpScreen from "../../screens/SignInHelp/SignInHelpScreen";
import TaskListScreen from "../../screens/Tasks/TaskListScreen";
import TaskDetailScreen from "../../screens/Tasks/TaskDetailScreen";
import HowIFeelTodayScreen from "../../screens/HealthLogging/HealthLoggingScreen";
import EmergencyScreen from "../../screens/Emergency/EmergencyScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";

// --------------------
// Mocks to keep integration stable
// --------------------

// Dashboard uses this version
jest.mock("../../storage/taskStatusStore", () => ({
  TaskStatusStore: jest.fn().mockImplementation(() => ({
    getCompletedAt: jest.fn(async () => null),
    setCompletedAt: jest.fn(async () => null),
    clearCompletedAt: jest.fn(async () => null),
  })),
}));

// TaskList/TaskDetail use this shared version
jest.mock("../../shared/storage/taskStatusStore", () => ({
  getCompletedAt: jest.fn(async () => null),
  setCompletedAt: jest.fn(async () => null),
  clearAllTasks: jest.fn(async () => null),
}));

// If your task list/detail pulls from shared mocks, make sure it exists.
// If this path is different in your repo, adjust accordingly.
jest.mock("../../shared/mocks/mockTasks", () => {
  const now = new Date("2026-02-12T09:00:00.000Z");
  return {
    mockTasks: [
      {
        id: "task-1",
        title: "Take medication",
        description: "Take morning pills",
        scheduledAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour later
        steps: ["Step 1: Get pills", "Step 2: Take pills", "Step 3: Drink water"],
        imageKey: "medication",
      },
    ],
  };
});

describe("Integration workflows (Navigation + multi-screen)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Welcome -> Face ID -> Dashboard", async () => {
    const { getByTestId, findByText } = renderWithNav(Routes.WelcomeLogin, {
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
      [Routes.Dashboard]: DashboardScreen,
    });

    fireEvent.press(getByTestId("face_id_button"));

    // Dashboard date header exists
    expect(await findByText(/Today:/i)).toBeTruthy();
  });

  it("Dashboard -> Messages -> SignInHelp", async () => {
    const { getByTestId, findByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.SignInHelp]: SignInHelpScreen,
    });

    fireEvent.press(getByTestId("messages_button"));

    expect(await findByText(/Need help/i)).toBeTruthy();
  });

  it("Dashboard -> Health Logging -> Save validation appears when no mood selected", async () => {
    const { getByTestId, findByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.HealthLogging]: HowIFeelTodayScreen,
    });

    fireEvent.press(getByTestId("feeling_button"));

    // Press Save without selecting a mood
    const saveButton = await findByText(/^Save$/i);
    fireEvent.press(saveButton);

    // Your overlay title
    expect(await findByText(/Something went wrong/i)).toBeTruthy();

    // Close overlay
    fireEvent.press(await findByText(/^OK$/i));
  });

  it("Dashboard -> Schedule -> TaskList -> TaskDetail -> Mark Done -> Return to Tasks", async () => {
    const { getByTestId, findByText, queryByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.TaskList]: TaskListScreen,
      [Routes.TaskDetail]: TaskDetailScreen,
    });

    // Go to TaskList from dashboard
    fireEvent.press(getByTestId("schedule_button"));

    // TaskList should show the task
    expect(await findByText(/Take medication/i)).toBeTruthy();

    // Start the task (your TaskList uses Start button text)
    fireEvent.press(await findByText(/^Start$/i));

    // TaskDetail should show "Task Step" pill and the step UI
    expect(await findByText(/You are on:/i)).toBeTruthy();
    expect(await findByText(/Task Step/i)).toBeTruthy();

    // Press through steps until "Mark Done" appears (depending on your implementation)
    // If there are 3 steps, Next Step -> Next Step -> Mark Done
    // We'll just keep pressing until Done overlay appears or Mark Done appears.
    for (let i = 0; i < 6; i++) {
      const nextStepBtn = queryByText(/Next Step/i);
      const markDoneBtn = queryByText(/Mark Done/i);
      if (markDoneBtn) {
        fireEvent.press(markDoneBtn);
        break;
      }
      if (nextStepBtn) {
        fireEvent.press(nextStepBtn);
      } else {
        // Some variants use "Next"
        const nextBtn = queryByText(/^Next$/i);
        if (nextBtn) fireEvent.press(nextBtn);
      }
    }

    // Done overlay appears
    expect(await findByText(/^Done$/i)).toBeTruthy();

    // Return to Tasks from overlay
    fireEvent.press(await findByText(/Return to Tasks/i));

    // Back on TaskList
    expect(await findByText(/You are on:.*Tasks/i)).toBeTruthy();
  });

  it("Dashboard -> Emergency -> SOS -> Confirm -> Alert Sent -> OK -> Dashboard", async () => {
    const { getByTestId, findByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.Emergency]: EmergencyScreen,
    });

    // Go to emergency
    fireEvent.press(getByTestId("emergency_help_button"));

    // Emergency page has SOS button
    fireEvent.press(getByTestId("sos_button"));

    // Confirm send
    fireEvent.press(getByTestId("confirm_send_alert"));

    // Alert sent popup
    expect(await findByText(/Alert Sent/i)).toBeTruthy();

    // OK returns to Dashboard (your screen does navigation.navigate("Dashboard"))
    fireEvent.press(getByTestId("alert_sent_ok"));

    // Dashboard date header exists again
    expect(await findByText(/Today:/i)).toBeTruthy();
  });
});

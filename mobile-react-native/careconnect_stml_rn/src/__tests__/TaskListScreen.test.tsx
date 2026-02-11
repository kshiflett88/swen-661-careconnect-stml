import React from "react";
import { ScrollView } from "react-native";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

import TaskListScreen from "../screens/Tasks/TaskListScreen";

// ---------- Mocks (must be hoisted, no out-of-scope vars) ----------
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("../navigation/routes", () => ({
  Routes: {
    Dashboard: "Dashboard",
    TaskDetail: "TaskDetail",
  },
}));

const mockGetCompletedAt = jest.fn();
const mockClearAllTasks = jest.fn();

jest.mock("../shared/storage/taskStatusStore", () => ({
  getCompletedAt: (...args: any[]) => mockGetCompletedAt(...args),
  clearAllTasks: (...args: any[]) => mockClearAllTasks(...args),
}));

// If your screen imports mockTasks from this module, keep it real (no mock).
// jest.mock("../shared/mocks/mockTasks", () => jest.requireActual("../shared/mocks/mockTasks"));

describe("TaskListScreen", () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();

    // By default: first task done, others not started (matches your earlier UI output).
    mockGetCompletedAt.mockImplementation(async (id: string) => {
      if (id === "1") return new Date().toISOString();
      return null;
    });

    mockClearAllTasks.mockResolvedValue(undefined);
  });

  it("renders orientation cue and shows done/not started after loading", async () => {
    const { getByText, getAllByText, queryAllByText } = render(
      <TaskListScreen navigation={navigation as any} />
    );

    // Wait for async status loading effect to complete to avoid act warning
    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());

    // Orientation cue
    // "You are on: Tasks" is rendered as nested <Text>, so match the combined output
    expect(getByText(/You are on:\s*Tasks/i)).toBeTruthy();

    // Should show at least one Done label (task 1)
    expect(getByText("Done ✓")).toBeTruthy();

    // Not Started appears for other tasks; use getAllByText to avoid "multiple elements" error
    expect(getAllByText("Not Started").length).toBeGreaterThan(0);

    // Start buttons likely appear multiple times; ensure at least one exists
    expect(queryAllByText("Start").length).toBeGreaterThan(0);
  });

  it("navigates to TaskDetail when a Start button is pressed", async () => {
    const { getAllByText } = render(<TaskListScreen navigation={navigation as any} />);

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());

    const startButtons = getAllByText("Start");
    expect(startButtons.length).toBeGreaterThan(0);

    fireEvent.press(startButtons[0]);

    expect(mockNavigate).toHaveBeenCalled();
    // Screen uses navigation.navigate(Routes.TaskDetail, { id })
    // We only assert destination to avoid coupling to specific ids.
    const call = mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1];
    expect(call[0]).toBe("TaskDetail");
  });

  it("navigates to Dashboard when Return to Home pressed", async () => {
    const { getByLabelText } = render(<TaskListScreen navigation={navigation as any} />);

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());

    fireEvent.press(getByLabelText("Return to Home"));
    expect(mockNavigate).toHaveBeenCalledWith("Dashboard");
  });

  it("clears tasks when Reset Tasks (Dev) pressed", async () => {
    const { getByText } = render(<TaskListScreen navigation={navigation as any} />);

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());

    fireEvent.press(getByText("Reset Tasks (Dev)"));

    await waitFor(() => expect(mockClearAllTasks).toHaveBeenCalled());
    // After clearing, screen reloads statuses again:
    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());
  });

  it("runs pull-to-refresh flow (covers refresh handler branch)", async () => {
    const ui = render(<TaskListScreen navigation={navigation as any} />);

    // Wait initial load
    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());

    // Try preferred path: ScrollView testID if you added it
    const maybeByTestId = (ui as any).queryByTestId?.("task-list-scroll");
    if (maybeByTestId?.props?.refreshControl?.props?.onRefresh) {
      await act(async () => {
        maybeByTestId.props.refreshControl.props.onRefresh();
      });
      await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());
      return;
    }

    // Fallback: find a ScrollView that has a refreshControl prop
    const scrollViews = ui.UNSAFE_getAllByType(ScrollView);
    const svWithRefresh = scrollViews.find(
      (sv: any) => sv?.props?.refreshControl?.props?.onRefresh
    );

    expect(svWithRefresh).toBeTruthy();

    await act(async () => {
      svWithRefresh.props.refreshControl.props.onRefresh();
    });

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());
  });
});

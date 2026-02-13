// src/__tests__/TaskDetailScreen.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Image } from "react-native";

import TaskDetailScreen from "../screens/Tasks/TaskDetailScreen";

// -------------------- Hoisted mocks --------------------
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("../navigation/routes", () => ({
  Routes: {
    TaskList: "TaskList",
    Dashboard: "Dashboard",
  },
}));

const mockGetCompletedAt = jest.fn();
const mockSetCompletedAt = jest.fn();

jest.mock("../shared/storage/taskStatusStore", () => ({
  getCompletedAt: (...args: any[]) => mockGetCompletedAt(...args),
  setCompletedAt: (...args: any[]) => mockSetCompletedAt(...args),
}));

jest.mock("../shared/assets/taskImages", () => ({
  TASK_IMAGES: {
    medication: 1,
    meal: 2,
    exercise: 3,
    water: 4,
  },
}));

jest.mock("../shared/mocks/mockTasks", () => ({
  mockTasks: [
    {
      id: "1",
      title: "Take Morning Medication",
      description: "Take pills with water.",
      steps: ["Step 1: Open bottle", "Step 2: Take pill", "Step 3: Drink water"],
      imageKey: "medication",
    },
    {
      id: "desc",
      title: "Wash Hands",
      description: "Use soap and warm water.",
      // no steps => description branch => 4-step flow
    },
    {
      id: "empty",
      title: "Stretch",
      description: "",
      // no steps + no description => 2-step fallback
    },
    {
      id: "no-image",
      title: "Call Friend",
      description: "Say hello.",
      steps: ["Do something"], // cleanStepText else-branch
      imageKey: null, // forces placeholder (no <Image />)
    },
  ],
}));

// Vector icons: simple mock that renders the accessibilityLabel text if provided
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props: any) => <Text>{props?.accessibilityLabel ?? "Ionicons"}</Text>,
  };
});

// -------------------- Tests --------------------
describe("TaskDetailScreen (Task Step)", () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCompletedAt.mockResolvedValue(null);
    mockSetCompletedAt.mockResolvedValue(undefined);
  });

  it("renders orientation cue, title, and step progress; advances via Next Step", async () => {
    const route = { params: { id: "1" } };

    const { getByText, queryByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("1"));

    // Nested <Text> causes exact string matching to fail; use regex
    expect(getByText(/You are on:/i)).toBeTruthy();
    expect(getByText("Task Step")).toBeTruthy();

    expect(getByText("Take Morning Medication")).toBeTruthy();

    expect(getByText(/Step\s*1\s*of\s*3/i)).toBeTruthy();
    expect(getByText("Open bottle")).toBeTruthy();

    fireEvent.press(getByText("Next Step"));

    expect(getByText(/Step\s*2\s*of\s*3/i)).toBeTruthy();
    expect(getByText("Take pill")).toBeTruthy();

    // Not done yet
    expect(queryByText("Completed")).toBeNull();
  });

  it("covers getSteps(description) branch and reaches final step label change (Mark Done)", async () => {
    const route = { params: { id: "desc" } };

    const { getByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("desc"));

    expect(getByText(/Step\s*1\s*of\s*4/i)).toBeTruthy();
    expect(getByText("Get what you need")).toBeTruthy();

    fireEvent.press(getByText("Next Step"));
    fireEvent.press(getByText("Next Step"));
    fireEvent.press(getByText("Next Step"));

    expect(getByText(/Step\s*4\s*of\s*4/i)).toBeTruthy();
    expect(getByText("Mark done")).toBeTruthy();
    expect(getByText("Mark Done")).toBeTruthy();
  });

  it("marks done via last-step CTA, shows Done overlay; overlay button returns to tasks", async () => {
    const route = { params: { id: "1" } };

    const { getByText, getAllByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("1"));

    // Go to last step (3 of 3)
    fireEvent.press(getByText("Next Step"));
    fireEvent.press(getByText("Next Step"));
    expect(getByText(/Step\s*3\s*of\s*3/i)).toBeTruthy();

    // Mark done
    fireEvent.press(getByText("Mark Done"));

    await waitFor(() => {
      expect(mockSetCompletedAt).toHaveBeenCalledTimes(1);
      const [idArg, isoArg] = mockSetCompletedAt.mock.calls[0];
      expect(idArg).toBe("1");
      expect(typeof isoArg).toBe("string");
    });

    // ✅ Assert the modal content (the real "user visible" success state now)
    expect(getAllByText("Done").length).toBeGreaterThan(0);
    expect(getByText("Task marked as complete.")).toBeTruthy();

    // Press overlay "Return to Tasks"
    const buttons = getAllByText("Return to Tasks");
    fireEvent.press(buttons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("TaskList");
  });

  it("covers isDone=true + showNextWhenDone=true path: shows Next (not Next Step) and advances; CTA disappears on last step", async () => {
    mockGetCompletedAt.mockResolvedValue("2026-02-08T12:00:00.000Z");

    const route = { params: { id: "1" } };

    const { getByText, queryByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("1"));

    expect(getByText("Completed")).toBeTruthy();
    expect(getByText("Next")).toBeTruthy();
    expect(queryByText("Next Step")).toBeNull();

    fireEvent.press(getByText("Next"));
    expect(getByText(/Step\s*2\s*of\s*3/i)).toBeTruthy();

    fireEvent.press(getByText("Next"));
    expect(getByText(/Step\s*3\s*of\s*3/i)).toBeTruthy();

    // CTA disappears on last step when already done
    expect(queryByText("Next")).toBeNull();
  });

  it("covers image placeholder branch (no <Image/>) and cleanStepText else branch", async () => {
    const route = { params: { id: "no-image" } };

    const { getByText, UNSAFE_queryAllByType } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("no-image"));

    expect(getByText("Do something")).toBeTruthy();
    expect(UNSAFE_queryAllByType(Image).length).toBe(0);
  });

  it("covers fallback task object when id is unknown", async () => {
    const route = { params: { id: "does-not-exist" } };

    const { getByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalled());

    expect(getByText("Task not found")).toBeTruthy();

    // For unknown task, getSteps() goes to description-present branch => 4 generic steps
    expect(getByText(/Step\s*1\s*of\s*4/i)).toBeTruthy();
    expect(getByText("Get what you need")).toBeTruthy();
  });

  it("covers getSteps fallback (no steps + no description) => 2-step flow", async () => {
    const route = { params: { id: "empty" } };

    const { getByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("empty"));

    expect(getByText(/Step\s*1\s*of\s*2/i)).toBeTruthy();

    fireEvent.press(getByText("Next Step"));
    expect(getByText(/Step\s*2\s*of\s*2/i)).toBeTruthy();
    expect(getByText("Mark Done")).toBeTruthy();
  });

  it("navigates to TaskList when bottom Return to Tasks pressed", async () => {
    const route = { params: { id: "1" } };

    const { getByText } = render(
      <TaskDetailScreen navigation={navigation as any} route={route as any} />
    );

    await waitFor(() => expect(mockGetCompletedAt).toHaveBeenCalledWith("1"));

    fireEvent.press(getByText("Return to Tasks"));
    expect(mockNavigate).toHaveBeenCalledWith("TaskList");
  });
});

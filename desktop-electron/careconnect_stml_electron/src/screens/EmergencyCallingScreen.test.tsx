// src/screens/__tests__/EmergencyCallingScreen.test.tsx
import { describe, expect, test, jest} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import EmergencyCallingScreen from "../EmergencyCallingScreen";

// Mock ScreenShell so tests focus on this screen (same pattern as your other tests)
jest.mock("../_ScreenShell", () => ({
  __esModule: true,
  default: ({ title, description, children }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe("EmergencyCallingScreen", () => {
  test("renders WCAG semantics and status content", () => {
    render(<EmergencyCallingScreen onGo={jest.fn() as any} />);

    // ScreenShell content
    expect(screen.getByRole("heading", { name: /emergency calling/i })).toBeInTheDocument();
    expect(screen.getByText(/caregiver contact is in progress/i)).toBeInTheDocument();

    // Region semantics
    expect(screen.getByRole("region", { name: /emergency calling panel/i })).toBeInTheDocument();

    // Status text + aria-live element exists
    expect(screen.getByText(/^Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/calling caregiver now/i)).toBeInTheDocument();

    // Calling actions group + buttons
    expect(screen.getByRole("group", { name: /calling actions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return to emergency screen/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return to tasks after emergency/i })).toBeInTheDocument();
  });

  test("handles Return and Done navigation actions", () => {
    const onGo = jest.fn();

    render(<EmergencyCallingScreen onGo={onGo as any} />);

    fireEvent.click(screen.getByRole("button", { name: /return to emergency screen/i }));
    fireEvent.click(screen.getByRole("button", { name: /return to tasks after emergency/i }));

    expect(onGo).toHaveBeenCalledTimes(2);
    expect(onGo).toHaveBeenNthCalledWith(1, "emergency");
    expect(onGo).toHaveBeenNthCalledWith(2, "task-list");
  });

  test("focus moves to the heading on mount for keyboard/screen reader users", () => {
    render(<EmergencyCallingScreen onGo={jest.fn() as any} />);

    const heading = screen.getAllByRole("heading", { name: /emergency calling/i })[1];
    // Explanation: first heading is from mocked ScreenShell, second is the actual h1 inside the screen.
    expect(document.activeElement).toBe(heading);
  });
});
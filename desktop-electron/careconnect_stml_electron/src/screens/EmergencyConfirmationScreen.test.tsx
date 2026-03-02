// src/screens/__tests__/EmergencyConfirmationScreen.test.tsx
import { describe, expect, test, jest} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import EmergencyConfirmationScreen from "../EmergencyConfirmationScreen";

// Match the style of your other tests: mock ScreenShell to keep focus on this screen
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

describe("EmergencyConfirmationScreen", () => {
  test("renders WCAG semantics and content", () => {
    render(<EmergencyConfirmationScreen onGo={jest.fn() as any} />);

    // ScreenShell content
    expect(screen.getByRole("heading", { name: /emergency confirmation/i })).toBeInTheDocument();
    expect(
      screen.getByText(/confirms that contacting the caregiver will begin/i)
    ).toBeInTheDocument();

    // Main region semantics
    const region = screen.getByRole("region", { name: /emergency confirmation panel/i });
    expect(region).toBeInTheDocument();

    // Visible content
    expect(screen.getByText(/confirm emergency contact/i)).toBeInTheDocument();
    expect(screen.getByText(/call 911 immediately/i)).toBeInTheDocument();

    // Actions
    expect(screen.getByRole("button", { name: /go back to emergency screen/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start contacting caregiver/i })).toBeInTheDocument();
  });

  test("handles Back and Start Calling navigation actions", () => {
    const onGo = jest.fn();

    render(<EmergencyConfirmationScreen onGo={onGo as any} />);

    fireEvent.click(screen.getByRole("button", { name: /go back to emergency screen/i }));
    fireEvent.click(screen.getByRole("button", { name: /start contacting caregiver/i }));

    expect(onGo).toHaveBeenCalledTimes(2);
    expect(onGo).toHaveBeenNthCalledWith(1, "emergency");
    expect(onGo).toHaveBeenNthCalledWith(2, "emergency-calling");
  });

  test("focus moves to the heading on mount for keyboard/screen reader users", () => {
    render(<EmergencyConfirmationScreen onGo={jest.fn() as any} />);

    // The component focuses the <h1> with tabIndex={-1}
    // Testing Library can assert activeElement points to it.
    const heading = screen.getByText(/confirm emergency contact/i);
    expect(document.activeElement).toBe(heading);
  });
});
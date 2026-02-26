import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

describe("App pre-sign-in flow", () => {
  test("starts on sign-in welcome screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with this device/i })).toBeInTheDocument();
  });

  test("navigates to sign-in help and back", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: /need help signing in\?/i }));
    expect(screen.getByRole("heading", { name: /having trouble signing in\?/i })).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /reset access/i }));
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("opens and closes caregiver confirmation dialog from help screen", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: /need help signing in\?/i }));
    fireEvent.click(screen.getByRole("button", { name: /contact caregiver/i }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(/caregiver contact request/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("closes caregiver confirmation on confirm", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: /need help signing in\?/i }));
    fireEvent.click(screen.getByRole("button", { name: /contact caregiver/i }));

    fireEvent.click(screen.getByRole("button", { name: /contact this action/i }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("enters main app after sign in", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /sign in with this device/i }));

    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  });
});

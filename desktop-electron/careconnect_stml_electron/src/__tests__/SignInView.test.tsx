import { fireEvent, render, screen } from "@testing-library/react";
import { SignInView } from "../components/SignInView";

describe("SignInView", () => {
  test("renders accessible welcome content and primary sign-in action", () => {
    render(<SignInView onSignIn={() => undefined} onNeedHelp={() => undefined} />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByText(/sign in to access your tasks and reminders/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with this device/i })).toBeInTheDocument();
  });

  test("calls onSignIn when sign-in button is clicked", () => {
    const onSignIn = jest.fn();
    render(<SignInView onSignIn={onSignIn} onNeedHelp={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /sign in with this device/i }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  test("shows and triggers help link when onNeedHelp is provided", () => {
    const onNeedHelp = jest.fn();
    render(<SignInView onSignIn={() => undefined} onNeedHelp={onNeedHelp} />);

    const helpLink = screen.getByRole("link", { name: /need help signing in\?/i });
    fireEvent.click(helpLink);

    expect(onNeedHelp).toHaveBeenCalledTimes(1);
  });

  test("supports Enter-key activation for help link", () => {
    const onNeedHelp = jest.fn();
    render(<SignInView onSignIn={() => undefined} onNeedHelp={onNeedHelp} />);

    const helpLink = screen.getByRole("link", { name: /need help signing in\?/i });
    fireEvent.keyDown(helpLink, { key: "Enter" });

    expect(onNeedHelp).toHaveBeenCalledTimes(1);
  });
});

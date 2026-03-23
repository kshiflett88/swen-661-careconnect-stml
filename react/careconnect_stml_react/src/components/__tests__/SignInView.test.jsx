import { render, screen, fireEvent } from "@testing-library/react";
import { SignInView } from "../SignInView";

describe("SignInView", () => {
  const defaultProps = {
    onSignIn: jest.fn(),
    onNeedHelp: jest.fn(),
  };

  it("renders welcome heading", () => {
    render(<SignInView {...defaultProps} />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("renders CareConnect brand name", () => {
    render(<SignInView {...defaultProps} />);
    expect(screen.getByText("CareConnect")).toBeInTheDocument();
  });

  it("renders sign-in subtitle", () => {
    render(<SignInView {...defaultProps} />);
    expect(screen.getByText("Sign in to access your tasks and reminders")).toBeInTheDocument();
  });

  it("calls onSignIn when sign-in button is clicked", () => {
    const onSignIn = jest.fn();
    render(<SignInView onSignIn={onSignIn} onNeedHelp={jest.fn()} />);
    const signInBtn = screen.getByRole("button", { name: /sign in with this device/i });
    fireEvent.click(signInBtn);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("calls onNeedHelp when help link is clicked", () => {
    const onNeedHelp = jest.fn();
    render(<SignInView onSignIn={jest.fn()} onNeedHelp={onNeedHelp} />);
    const helpLink = screen.getByText(/Need help signing in/i);
    fireEvent.click(helpLink);
    expect(onNeedHelp).toHaveBeenCalledTimes(1);
  });

  it("renders with main role", () => {
    render(<SignInView {...defaultProps} />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("calls onNeedHelp with keyboard Enter", () => {
    const onNeedHelp = jest.fn();
    render(<SignInView onSignIn={jest.fn()} onNeedHelp={onNeedHelp} />);
    const helpLink = screen.getByText(/Need help signing in/i);
    fireEvent.keyDown(helpLink, { key: "Enter" });
    expect(onNeedHelp).toHaveBeenCalledTimes(1);
  });

  it("calls onNeedHelp with keyboard Space", () => {
    const onNeedHelp = jest.fn();
    render(<SignInView onSignIn={jest.fn()} onNeedHelp={onNeedHelp} />);
    const helpLink = screen.getByText(/Need help signing in/i);
    fireEvent.keyDown(helpLink, { key: " " });
    expect(onNeedHelp).toHaveBeenCalledTimes(1);
  });

  it("applies focus styles on help link focus", () => {
    render(<SignInView {...defaultProps} />);
    const helpLink = screen.getByText(/Need help signing in/i);
    fireEvent.focus(helpLink);
    expect(helpLink.style.boxShadow).toBeTruthy();
  });

  it("clears focus styles on help link blur", () => {
    render(<SignInView {...defaultProps} />);
    const helpLink = screen.getByText(/Need help signing in/i);
    fireEvent.focus(helpLink);
    fireEvent.blur(helpLink);
    expect(helpLink.style.boxShadow).toBe("none");
  });

  it("renders heart icon", () => {
    render(<SignInView {...defaultProps} />);
    expect(screen.getByText("♥")).toBeInTheDocument();
  });

  it("renders help text about secure sign-in", () => {
    render(<SignInView {...defaultProps} />);
    expect(screen.getByText(/fingerprint/)).toBeInTheDocument();
  });
});

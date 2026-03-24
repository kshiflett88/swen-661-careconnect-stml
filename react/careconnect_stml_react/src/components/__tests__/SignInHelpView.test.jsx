import { render, screen, fireEvent } from "@testing-library/react";
import { SignInHelpView } from "../SignInHelpView";

describe("SignInHelpView", () => {
  const defaultProps = {
    onResetAccess: jest.fn(),
    onContactCaregiver: jest.fn(),
    onClose: jest.fn(),
    caregiverRequestSent: false,
  };

  it("renders help heading", () => {
    render(<SignInHelpView {...defaultProps} />);
    expect(screen.getByText("Having trouble signing in?")).toBeInTheDocument();
  });

  it("renders Reset Access button", () => {
    render(<SignInHelpView {...defaultProps} />);
    expect(screen.getByText("Reset Access")).toBeInTheDocument();
  });

  it("renders Contact Caregiver button", () => {
    render(<SignInHelpView {...defaultProps} />);
    expect(screen.getByText("Contact Caregiver")).toBeInTheDocument();
  });

  it("calls onResetAccess when reset button clicked", () => {
    const onResetAccess = jest.fn();
    render(<SignInHelpView {...defaultProps} onResetAccess={onResetAccess} />);
    fireEvent.click(screen.getByText("Reset Access"));
    expect(onResetAccess).toHaveBeenCalledTimes(1);
  });

  it("calls onContactCaregiver when contact button clicked", () => {
    const onContactCaregiver = jest.fn();
    render(<SignInHelpView {...defaultProps} onContactCaregiver={onContactCaregiver} />);
    fireEvent.click(screen.getByText("Contact Caregiver"));
    expect(onContactCaregiver).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(<SignInHelpView {...defaultProps} onClose={onClose} />);
    const closeBtn = screen.getByLabelText("Close sign in help modal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows success message when caregiverRequestSent is true", () => {
    render(<SignInHelpView {...defaultProps} caregiverRequestSent={true} />);
    expect(screen.getByText(/Caregiver request sent/)).toBeInTheDocument();
  });
});

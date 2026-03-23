import { render, screen, fireEvent } from "@testing-library/react";
import { EmergencyModal } from "../EmergencyModal";

describe("EmergencyModal", () => {
  const defaultProps = {
    isOpen: true,
    confirmed: false,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    onClose: jest.fn(),
  };

  it("renders nothing when closed", () => {
    const { container } = render(<EmergencyModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders default title and message", () => {
    render(<EmergencyModal {...defaultProps} />);
    expect(screen.getByText("Emergency")).toBeInTheDocument();
    expect(screen.getByText("Contact caregiver now?")).toBeInTheDocument();
  });

  it("renders custom title and message", () => {
    render(<EmergencyModal {...defaultProps} title="Custom Title" message="Custom message text" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom message text")).toBeInTheDocument();
  });

  it("renders confirm and cancel buttons", () => {
    render(<EmergencyModal {...defaultProps} />);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", () => {
    const onConfirm = jest.fn();
    render(<EmergencyModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = jest.fn();
    render(<EmergencyModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("hides confirm button when confirmed is true", () => {
    render(<EmergencyModal {...defaultProps} confirmed={true} />);
    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    // Shows placeholder message
    expect(screen.getByText(/Caregiver contact has been triggered/)).toBeInTheDocument();
    // Cancel changes to Close
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = jest.fn();
    render(<EmergencyModal {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = jest.fn();
    render(<EmergencyModal {...defaultProps} onClose={onClose} />);
    const overlay = screen.getByRole("presentation");
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA dialog attributes", () => {
    render(<EmergencyModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
  });

  it("renders aria hint when provided", () => {
    render(<EmergencyModal {...defaultProps} ariaHint="Press Enter to confirm" />);
    expect(screen.getByText("Press Enter to confirm")).toBeInTheDocument();
  });

  it("renders custom button text", () => {
    render(<EmergencyModal {...defaultProps} confirmText="Call Now" cancelText="Go Back" />);
    expect(screen.getByText("Call Now")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("does not call onClose when mousedown starts inside the dialog", () => {
    const onClose = jest.fn();
    render(<EmergencyModal {...defaultProps} onClose={onClose} />);
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("applies a custom border color", () => {
    render(<EmergencyModal {...defaultProps} borderColor="#123456" />);
    expect(screen.getByRole("dialog")).toHaveStyle({ borderColor: "#123456" });
  });

  it("traps focus when tabbing forward from the last button", () => {
    render(<EmergencyModal {...defaultProps} />);
    const confirmButton = screen.getByText("Confirm");
    const cancelButton = screen.getByText("Cancel");

    cancelButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(confirmButton).toHaveFocus();
  });

  it("traps focus when tabbing backward from the first button", () => {
    render(<EmergencyModal {...defaultProps} />);
    const confirmButton = screen.getByText("Confirm");
    const cancelButton = screen.getByText("Cancel");

    confirmButton.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

    expect(cancelButton).toHaveFocus();
  });

  it("returns focus to the previously focused element when closed", () => {
    const previousButton = document.createElement("button");
    document.body.appendChild(previousButton);
    previousButton.focus();

    const { unmount } = render(<EmergencyModal {...defaultProps} />);
    unmount();

    expect(previousButton).toHaveFocus();
    previousButton.remove();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactActionModal } from "../ContactActionModal";

describe("ContactActionModal", () => {
  const defaultProps = {
    isOpen: true,
    title: "Confirm Call",
    description: "You are about to call Sarah Miller.",
    contextText: "(555) 123-4567",
    confirmLabel: "Call Now",
    variant: "primary",
    icon: "phone",
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
  };

  it("renders nothing when closed", () => {
    const { container } = render(<ContactActionModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders title", () => {
    render(<ContactActionModal {...defaultProps} />);
    expect(screen.getByText("Confirm Call")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ContactActionModal {...defaultProps} />);
    expect(screen.getByText("You are about to call Sarah Miller.")).toBeInTheDocument();
  });

  it("renders context text", () => {
    render(<ContactActionModal {...defaultProps} />);
    expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("renders confirm button with custom label", () => {
    render(<ContactActionModal {...defaultProps} />);
    expect(screen.getByText("Call Now")).toBeInTheDocument();
  });

  it("renders Cancel button", () => {
    render(<ContactActionModal {...defaultProps} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<ContactActionModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText("Call Now"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();
    render(<ContactActionModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Escape is pressed", () => {
    const onCancel = vi.fn();
    render(<ContactActionModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when overlay is clicked", () => {
    const onCancel = vi.fn();
    render(<ContactActionModal {...defaultProps} onCancel={onCancel} />);
    const overlay = document.querySelector(".contact-action-overlay");
    fireEvent.click(overlay);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not render contextText when not provided", () => {
    render(<ContactActionModal {...defaultProps} contextText={undefined} />);
    expect(screen.queryByText("(555) 123-4567")).not.toBeInTheDocument();
  });

  it("has correct ARIA alertdialog attributes", () => {
    render(<ContactActionModal {...defaultProps} />);
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "contact-action-title");
    expect(dialog).toHaveAttribute("aria-describedby", "contact-action-description");
  });

  it("has close button with aria-label", () => {
    render(<ContactActionModal {...defaultProps} />);
    expect(screen.getByLabelText("Close contact action confirmation")).toBeInTheDocument();
  });
});

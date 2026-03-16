import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteTaskConfirmModal } from "../DeleteTaskConfirmModal";

const makeTask = () => ({
  id: "42",
  title: "Doctor appointment",
  description: "Annual checkup.",
  dueDateTime: new Date("2026-03-20T14:00:00"),
  priority: "high",
  status: "pending",
});

describe("DeleteTaskConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    task: makeTask(),
    onCancel: vi.fn(),
    onConfirmDelete: vi.fn(),
  };

  it("renders nothing when closed", () => {
    const { container } = render(<DeleteTaskConfirmModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when task is null", () => {
    const { container } = render(<DeleteTaskConfirmModal {...defaultProps} task={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders Delete Task? title", () => {
    render(<DeleteTaskConfirmModal {...defaultProps} />);
    expect(screen.getByText("Delete Task?")).toBeInTheDocument();
  });

  it("renders warning message", () => {
    render(<DeleteTaskConfirmModal {...defaultProps} />);
    expect(screen.getByText(/cannot be undone/)).toBeInTheDocument();
  });

  it("displays task name in quotes", () => {
    render(<DeleteTaskConfirmModal {...defaultProps} />);
    expect(screen.getByText(/"Doctor appointment"/)).toBeInTheDocument();
  });

  it("renders Delete Task and Cancel buttons", () => {
    render(<DeleteTaskConfirmModal {...defaultProps} />);
    expect(screen.getByText("Delete Task")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onConfirmDelete with task id on delete click", () => {
    const onConfirmDelete = vi.fn();
    render(<DeleteTaskConfirmModal {...defaultProps} onConfirmDelete={onConfirmDelete} />);
    fireEvent.click(screen.getByText("Delete Task"));
    expect(onConfirmDelete).toHaveBeenCalledWith("42");
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();
    render(<DeleteTaskConfirmModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Escape is pressed", () => {
    const onCancel = vi.fn();
    render(<DeleteTaskConfirmModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when overlay is clicked", () => {
    const onCancel = vi.fn();
    render(<DeleteTaskConfirmModal {...defaultProps} onCancel={onCancel} />);
    const overlay = document.querySelector(".delete-task-confirm-overlay");
    fireEvent.click(overlay);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA alertdialog attributes", () => {
    render(<DeleteTaskConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "delete-task-title");
    expect(dialog).toHaveAttribute("aria-describedby", "delete-task-description");
  });

  it("has close button with aria-label", () => {
    render(<DeleteTaskConfirmModal {...defaultProps} />);
    expect(screen.getByLabelText("Close delete task confirmation")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { AddTaskModal } from "../AddTaskModal";

describe("AddTaskModal", () => {
  const defaultProps = {
    isOpen: true,
    onCancel: jest.fn(),
    onSave: jest.fn(),
  };

  it("renders nothing when closed", () => {
    const { container } = render(<AddTaskModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders modal title", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByText("Add New Task")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Task Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
  });

  it("defaults priority to medium", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Priority")).toHaveValue("medium");
  });

  it("renders Save and Cancel buttons", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows validation when submitting without date and time", () => {
    render(<AddTaskModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Please select a due date and time.")).toBeInTheDocument();
  });

  it("does not show validation initially", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.queryByText("Please select a due date and time.")).not.toBeInTheDocument();
  });

  it("calls onSave with form data when valid", () => {
    const onSave = jest.fn();
    render(<AddTaskModal {...defaultProps} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("Task Name"), { target: { value: "New task" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Some description" } });
    fireEvent.change(screen.getByLabelText("Due Date"), { target: { value: "2026-03-20" } });
    fireEvent.change(screen.getByLabelText("Due Time"), { target: { value: "10:00" } });
    fireEvent.change(screen.getByLabelText("Priority"), { target: { value: "high" } });

    fireEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledWith({
      title: "New task",
      description: "Some description",
      dueDate: "2026-03-20",
      dueTime: "10:00",
      priority: "high",
    });
  });

  it("uses 'Untitled Task' when name is empty", () => {
    const onSave = jest.fn();
    render(<AddTaskModal {...defaultProps} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("Due Date"), { target: { value: "2026-03-20" } });
    fireEvent.change(screen.getByLabelText("Due Time"), { target: { value: "10:00" } });
    fireEvent.click(screen.getByText("Save"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Untitled Task" })
    );
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = jest.fn();
    render(<AddTaskModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key", () => {
    const onCancel = jest.fn();
    render(<AddTaskModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA dialog attributes", () => {
    render(<AddTaskModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "add-task-title");
  });

  it("has a close button with aria-label", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });
});

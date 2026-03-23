import { render, screen, fireEvent } from "@testing-library/react";
import { EditTaskModal } from "../EditTaskModal";

const makeTask = () => ({
  id: "42",
  title: "Doctor appointment",
  description: "Annual checkup with Dr. Johnson.",
  dueDateTime: new Date("2026-03-20T14:30:00"),
  priority: "high",
  status: "pending",
});

describe("EditTaskModal", () => {
  const defaultProps = {
    isOpen: true,
    onCancel: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
    task: makeTask(),
  };

  it("renders nothing when closed", () => {
    const { container } = render(<EditTaskModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when task is null", () => {
    const { container } = render(<EditTaskModal {...defaultProps} task={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders modal title", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("pre-populates task name", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Task Name")).toHaveValue("Doctor appointment");
  });

  it("pre-populates description", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Description")).toHaveValue("Annual checkup with Dr. Johnson.");
  });

  it("pre-populates due date", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Due Date")).toHaveValue("2026-03-20");
  });

  it("pre-populates due time", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Due Time")).toHaveValue("14:30");
  });

  it("pre-populates priority", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByLabelText("Priority")).toHaveValue("high");
  });

  it("renders Save Changes and Cancel buttons", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders Delete Task button", () => {
    render(<EditTaskModal {...defaultProps} />);
    expect(screen.getByText("Delete Task")).toBeInTheDocument();
  });

  it("calls onSave with task id and updated data on submit", () => {
    const onSave = jest.fn();
    render(<EditTaskModal {...defaultProps} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("Task Name"), { target: { value: "Updated task" } });
    fireEvent.click(screen.getByText("Save Changes"));

    expect(onSave).toHaveBeenCalledWith("42", expect.objectContaining({ title: "Updated task" }));
  });

  it("calls onDelete with task id when Delete is clicked", () => {
    const onDelete = jest.fn();
    render(<EditTaskModal {...defaultProps} onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete Task"));
    expect(onDelete).toHaveBeenCalledWith("42");
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = jest.fn();
    render(<EditTaskModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key", () => {
    const onCancel = jest.fn();
    render(<EditTaskModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows validation when date and time are cleared and submitted", () => {
    render(<EditTaskModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText("Due Date"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Due Time"), { target: { value: "" } });
    fireEvent.submit(screen.getByRole("dialog").querySelector("form"));
    expect(screen.getByText("Please select a due date and time.")).toBeInTheDocument();
  });

  it("has correct ARIA dialog attributes", () => {
    render(<EditTaskModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "edit-task-title");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardView } from "../DashboardView";

const makeTasks = () => [
  {
    id: "1",
    title: "Take morning medication",
    description: "Take prescribed medication with food.",
    dueDateTime: new Date("2026-03-16T09:00:00"),
    priority: "high",
    status: "pending",
  },
  {
    id: "2",
    title: "Doctor appointment",
    description: "Annual checkup.",
    dueDateTime: new Date("2026-03-16T14:00:00"),
    priority: "high",
    assignedTo: "Dr. Johnson",
    status: "pending",
  },
  {
    id: "3",
    title: "Call Sarah",
    description: "Weekly check-in.",
    dueDateTime: new Date("2026-03-17T10:00:00"),
    priority: "medium",
    status: "pending",
  },
];

describe("DashboardView", () => {
  const defaultProps = {
    tasks: makeTasks(),
    onOpenTasks: jest.fn(),
    onMarkComplete: jest.fn(),
    onQuickAddTask: jest.fn(),
  };

  it("renders Dashboard heading", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders mood check-in heading", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByText("How are You Feeling Today?")).toBeInTheDocument();
  });

  it("renders Next Task section with first pending task", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByText("Next Task")).toBeInTheDocument();
    expect(screen.getByText("Take morning medication")).toBeInTheDocument();
  });

  it("renders Upcoming Tasks section", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByText("Upcoming Tasks")).toBeInTheDocument();
  });

  it("renders mood check-in section", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByText("How are You Feeling Today?")).toBeInTheDocument();
  });

  it("renders Quick Add Task section", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByText("Quick Add Task")).toBeInTheDocument();
  });

  it("calls onMarkComplete when Mark Complete is clicked", () => {
    const onMarkComplete = jest.fn();
    render(<DashboardView {...defaultProps} onMarkComplete={onMarkComplete} />);
    const btn = screen.getByText("Mark Complete");
    fireEvent.click(btn);
    expect(onMarkComplete).toHaveBeenCalledWith("1");
  });

  it("shows empty state when no tasks", () => {
    render(<DashboardView {...defaultProps} tasks={[]} />);
    expect(screen.getByText(/no pending tasks/i)).toBeInTheDocument();
  });

  it("renders mood buttons", () => {
    render(<DashboardView {...defaultProps} />);
    expect(screen.getByLabelText("Select mood Happy")).toBeInTheDocument();
    expect(screen.getByLabelText("Select mood Okay")).toBeInTheDocument();
    expect(screen.getByLabelText("Select mood Sad")).toBeInTheDocument();
  });

  it("saves mood and shows confirmation message", () => {
    render(<DashboardView {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Select mood Happy"));
    fireEvent.click(screen.getByLabelText("Save selected mood"));
    expect(screen.getByText("Happy saved for today.")).toBeInTheDocument();
  });

  it("clears mood selection", () => {
    render(<DashboardView {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Select mood Happy"));
    fireEvent.click(screen.getByLabelText("Clear mood check-in"));
    expect(screen.getByLabelText("Select mood Happy")).toHaveAttribute("aria-pressed", "false");
  });

  it("does not save mood when none selected", () => {
    render(<DashboardView {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Save selected mood"));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("updates mood note text", () => {
    render(<DashboardView {...defaultProps} />);
    const textarea = screen.getByLabelText("Optional Note");
    fireEvent.change(textarea, { target: { value: "Feeling great" } });
    expect(textarea).toHaveValue("Feeling great");
    expect(screen.getByText("13/200 characters")).toBeInTheDocument();
  });

  it("renders upcoming tasks with click handler", () => {
    const onOpenTasks = jest.fn();
    render(<DashboardView {...defaultProps} onOpenTasks={onOpenTasks} />);
    // Click an upcoming task card
    fireEvent.click(screen.getByLabelText(/Open tasks and view Doctor appointment/));
    expect(onOpenTasks).toHaveBeenCalledTimes(1);
  });

  it("shows no additional upcoming tasks when only one task", () => {
    const single = [makeTasks()[0]];
    render(<DashboardView {...defaultProps} tasks={single} />);
    expect(screen.getByText("No additional upcoming tasks.")).toBeInTheDocument();
  });

  it("submits quick add task", () => {
    const onQuickAddTask = jest.fn();
    render(<DashboardView {...defaultProps} onQuickAddTask={onQuickAddTask} />);
    fireEvent.change(screen.getByLabelText("What do you need to remember?"), { target: { value: "Buy groceries" } });
    fireEvent.change(screen.getByLabelText("Due Date"), { target: { value: "2026-04-01" } });
    fireEvent.change(screen.getByLabelText("Due Time"), { target: { value: "12:00" } });
    fireEvent.click(screen.getByLabelText("Add quick task"));
    expect(onQuickAddTask).toHaveBeenCalledWith({ title: "Buy groceries", dueDate: "2026-04-01", dueTime: "12:00" });
  });

  it("does not submit empty quick add task", () => {
    const onQuickAddTask = jest.fn();
    render(<DashboardView {...defaultProps} onQuickAddTask={onQuickAddTask} />);
    fireEvent.click(screen.getByLabelText("Add quick task"));
    expect(onQuickAddTask).not.toHaveBeenCalled();
  });

  it("clears quick add form", () => {
    render(<DashboardView {...defaultProps} />);
    const input = screen.getByLabelText("What do you need to remember?");
    fireEvent.change(input, { target: { value: "Something" } });
    fireEvent.click(screen.getByLabelText("Clear quick add form"));
    expect(input).toHaveValue("");
  });

  it("formats due time as tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const tasks = [{ id: "1", title: "Tomorrow task", description: "", dueDateTime: tomorrow, priority: "low", status: "pending" }];
    render(<DashboardView {...defaultProps} tasks={tasks} />);
    expect(screen.getByText(/Tomorrow at/)).toBeInTheDocument();
  });

  it("formats due time for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    future.setHours(14, 0, 0, 0);
    const tasks = [{ id: "1", title: "Future task", description: "", dueDateTime: future, priority: "low", status: "pending" }];
    render(<DashboardView {...defaultProps} tasks={tasks} />);
    // Should show month & day format
    expect(screen.getByText(/Future task/)).toBeInTheDocument();
  });
});

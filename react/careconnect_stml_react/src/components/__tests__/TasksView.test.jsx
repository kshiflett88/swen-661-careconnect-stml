import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TasksView } from "../TasksView";

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
    priority: "medium",
    assignedTo: "Dr. Johnson",
    status: "pending",
  },
  {
    id: "3",
    title: "Completed task",
    description: "Already done.",
    dueDateTime: new Date("2026-03-15T10:00:00"),
    priority: "low",
    status: "completed",
  },
];

describe("TasksView", () => {
  const defaultProps = {
    tasks: makeTasks(),
    filterMode: "all",
    searchQuery: "",
    onClearFilter: vi.fn(),
    onEditTask: vi.fn(),
    onDeleteTask: vi.fn(),
    onMarkComplete: vi.fn(),
    onUndoComplete: vi.fn(),
    onContextMenu: vi.fn(),
  };

  it("renders All Tasks heading", () => {
    render(<TasksView {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("All Tasks");
  });

  it("renders pending task cards", () => {
    render(<TasksView {...defaultProps} />);
    expect(screen.getAllByText("Take morning medication").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Doctor appointment").length).toBeGreaterThanOrEqual(1);
  });

  it("renders completed tasks section", () => {
    render(<TasksView {...defaultProps} />);
    expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();
  });

  it("shows task count in filter state", () => {
    render(<TasksView {...defaultProps} />);
    expect(screen.getByText(/active/)).toBeInTheDocument();
  });

  it("shows detail pane for selected task", () => {
    render(<TasksView {...defaultProps} />);
    // First task is selected by default
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Take prescribed medication with food.")).toBeInTheDocument();
  });

  it("shows Mark Complete, Edit, Delete buttons in detail pane for pending tasks", () => {
    render(<TasksView {...defaultProps} />);
    expect(screen.getAllByText("Mark Complete").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByText("Delete Task")).toBeInTheDocument();
  });

  it("calls onMarkComplete when Mark Complete clicked", () => {
    const onMarkComplete = vi.fn();
    render(<TasksView {...defaultProps} onMarkComplete={onMarkComplete} />);
    // Click the detail pane's Mark Complete button
    const completeButtons = screen.getAllByText("Mark Complete");
    fireEvent.click(completeButtons[0]);
    expect(onMarkComplete).toHaveBeenCalledWith("1");
  });

  it("calls onEditTask when Edit clicked", () => {
    const onEditTask = vi.fn();
    render(<TasksView {...defaultProps} onEditTask={onEditTask} />);
    fireEvent.click(screen.getByText("Edit Task"));
    expect(onEditTask).toHaveBeenCalledWith("1");
  });

  it("calls onDeleteTask when Delete clicked", () => {
    const onDeleteTask = vi.fn();
    render(<TasksView {...defaultProps} onDeleteTask={onDeleteTask} />);
    fireEvent.click(screen.getByText("Delete Task"));
    expect(onDeleteTask).toHaveBeenCalledWith("1");
  });

  it("selects a task when card is clicked", () => {
    render(<TasksView {...defaultProps} />);
    fireEvent.click(screen.getByText("Doctor appointment"));
    // Detail pane should update to show the clicked task's description
    expect(screen.getByText("Annual checkup.")).toBeInTheDocument();
  });

  it("shows search filter state", () => {
    render(<TasksView {...defaultProps} filterMode="search" searchQuery="medication" />);
    expect(screen.getByText(/Search results for/)).toBeInTheDocument();
  });

  it("shows today filter state", () => {
    render(<TasksView {...defaultProps} filterMode="today" />);
    expect(screen.getByText(/Today's Tasks/i)).toBeInTheDocument();
  });

  it("shows clear filter button in search mode", () => {
    render(<TasksView {...defaultProps} filterMode="search" searchQuery="test" />);
    expect(screen.getByText("✕ Clear Search")).toBeInTheDocument();
  });

  it("calls onClearFilter when clear button clicked", () => {
    const onClearFilter = vi.fn();
    render(<TasksView {...defaultProps} filterMode="search" searchQuery="test" onClearFilter={onClearFilter} />);
    fireEvent.click(screen.getByText("✕ Clear Search"));
    expect(onClearFilter).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when no filtered tasks", () => {
    render(<TasksView {...defaultProps} tasks={[]} filterMode="search" searchQuery="nothing" />);
    expect(screen.getByText("No tasks found matching your search.")).toBeInTheDocument();
  });

  it("shows empty state for today filter with View all tasks button", () => {
    render(<TasksView {...defaultProps} tasks={[]} filterMode="today" />);
    expect(screen.getByText("No tasks due today.")).toBeInTheDocument();
    expect(screen.getByText("View all tasks")).toBeInTheDocument();
  });

  it("calls onClearFilter when View all tasks is clicked", () => {
    const onClearFilter = vi.fn();
    render(<TasksView {...defaultProps} tasks={[]} filterMode="today" onClearFilter={onClearFilter} />);
    fireEvent.click(screen.getByText("View all tasks"));
    expect(onClearFilter).toHaveBeenCalledTimes(1);
  });

  it("shows completed task info in detail pane when completed task is selected", () => {
    render(<TasksView {...defaultProps} />);
    // Click on completed task
    fireEvent.click(screen.getByText("Completed task"));
    expect(screen.getByText("Task Completed")).toBeInTheDocument();
    expect(screen.getByText("This task has been marked as complete.")).toBeInTheDocument();
  });

  it("shows assigned-to in detail pane", () => {
    render(<TasksView {...defaultProps} />);
    fireEvent.click(screen.getByText("Doctor appointment"));
    expect(screen.getByText(/Assigned to:/)).toBeInTheDocument();
    expect(screen.getByText("Dr. Johnson")).toBeInTheDocument();
  });

  it("handles keyboard Enter to select task", () => {
    render(<TasksView {...defaultProps} />);
    const cards = screen.getAllByRole("listitem");
    // Press Enter on second task card (Doctor appointment)
    fireEvent.keyDown(cards[1], { key: "Enter" });
    expect(screen.getByText("Annual checkup.")).toBeInTheDocument();
  });

  it("handles keyboard Space to select task", () => {
    render(<TasksView {...defaultProps} />);
    const cards = screen.getAllByRole("listitem");
    fireEvent.keyDown(cards[1], { key: " " });
    expect(screen.getByText("Annual checkup.")).toBeInTheDocument();
  });

  it("fires onContextMenu on right-click", () => {
    const onContextMenu = vi.fn();
    render(<TasksView {...defaultProps} onContextMenu={onContextMenu} />);
    const cards = screen.getAllByRole("listitem");
    fireEvent.contextMenu(cards[0]);
    expect(onContextMenu).toHaveBeenCalled();
  });

  it("shows clear filter button in today mode", () => {
    render(<TasksView {...defaultProps} filterMode="today" />);
    expect(screen.getByText("✕ Clear Filter")).toBeInTheDocument();
  });

  it("renders medium priority badge", () => {
    render(<TasksView {...defaultProps} />);
    expect(screen.getAllByText("MEDIUM PRIORITY").length).toBeGreaterThanOrEqual(1);
  });
});

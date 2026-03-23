import { render, screen, fireEvent, within } from "@testing-library/react";
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
  afterEach(() => {
    jest.useRealTimers();
  });

  const defaultProps = {
    tasks: makeTasks(),
    filterMode: "all",
    searchQuery: "",
    onClearFilter: jest.fn(),
    onEditTask: jest.fn(),
    onDeleteTask: jest.fn(),
    onMarkComplete: jest.fn(),
    onUndoComplete: jest.fn(),
    onContextMenu: jest.fn(),
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
    const onMarkComplete = jest.fn();
    render(<TasksView {...defaultProps} onMarkComplete={onMarkComplete} />);
    // Click the detail pane's Mark Complete button
    const completeButtons = screen.getAllByText("Mark Complete");
    fireEvent.click(completeButtons[0]);
    expect(onMarkComplete).toHaveBeenCalledWith("1");
  });

  it("calls onEditTask when Edit clicked", () => {
    const onEditTask = jest.fn();
    render(<TasksView {...defaultProps} onEditTask={onEditTask} />);
    fireEvent.click(screen.getByText("Edit Task"));
    expect(onEditTask).toHaveBeenCalledWith("1");
  });

  it("calls onDeleteTask when Delete clicked", () => {
    const onDeleteTask = jest.fn();
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
    const onClearFilter = jest.fn();
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
    const onClearFilter = jest.fn();
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
    const onContextMenu = jest.fn();
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

  it("renders low priority badge for completed tasks", () => {
    render(<TasksView {...defaultProps} />);
    fireEvent.click(screen.getByText("Completed task"));
    expect(screen.getAllByText("LOW PRIORITY").length).toBeGreaterThanOrEqual(1);
  });

  it("uses the singular task label when one task is in the search results", () => {
    render(<TasksView {...defaultProps} filterMode="search" searchQuery="Doctor" />);
    expect(screen.getByText("1 task found")).toBeInTheDocument();
  });

  it("uses the singular task label when one task is due today", () => {
    render(
      <TasksView
        {...defaultProps}
        tasks={[
          {
            ...makeTasks()[0],
            dueDateTime: new Date(),
          },
        ]}
        filterMode="today"
      />
    );
    expect(screen.getByText("1 task due today")).toBeInTheDocument();
  });

  it("falls back to the first filtered task when the previously selected task is not in the result set", () => {
    const { rerender } = render(<TasksView {...defaultProps} />);
    fireEvent.click(screen.getByText("Doctor appointment"));
    rerender(<TasksView {...defaultProps} filterMode="search" searchQuery="medication" />);
    expect(screen.getByText("Take prescribed medication with food.")).toBeInTheDocument();
  });

  it("does not change selection for unrelated key presses", () => {
    render(<TasksView {...defaultProps} />);
    const cards = screen.getAllByRole("listitem");
    fireEvent.keyDown(cards[1], { key: "ArrowDown" });
    expect(screen.getByText("Take prescribed medication with food.")).toBeInTheDocument();
  });

  it("toggles card expansion when a task card is clicked twice", () => {
    render(<TasksView {...defaultProps} />);
    const doctorCard = screen.getAllByText("Doctor appointment")[0].closest("article");

    fireEvent.click(screen.getAllByText("Doctor appointment")[0]);
    expect(doctorCard).toHaveClass("expanded");

    fireEvent.click(screen.getAllByText("Doctor appointment")[0]);
    expect(doctorCard).not.toHaveClass("expanded");
  });

  it("marks a task complete from the mobile action button and clears expansion", () => {
    jest.useFakeTimers();
    const onMarkComplete = jest.fn();
    render(<TasksView {...defaultProps} onMarkComplete={onMarkComplete} />);
    const doctorCard = screen.getAllByText("Doctor appointment")[0].closest("article");

    fireEvent.click(screen.getAllByText("Doctor appointment")[0]);
    expect(doctorCard).toHaveClass("expanded");

    fireEvent.click(doctorCard.querySelector(".mobile-action-complete"));
    expect(onMarkComplete).toHaveBeenCalledWith("2");
    expect(doctorCard).not.toHaveClass("expanded");

    jest.runAllTimers();
  });

  it("calls edit from the mobile action button without changing the selection", () => {
    const onEditTask = jest.fn();
    render(<TasksView {...defaultProps} onEditTask={onEditTask} />);
    const doctorCard = screen.getAllByText("Doctor appointment")[0].closest("article");
    fireEvent.click(screen.getAllByText("Doctor appointment")[0]);
    fireEvent.click(doctorCard.querySelector(".mobile-action-edit"));
    expect(onEditTask).toHaveBeenCalledWith("2");
    expect(screen.getByText("Annual checkup.")).toBeInTheDocument();
  });

  it("calls delete from the mobile action button without changing the selection", () => {
    const onDeleteTask = jest.fn();
    render(<TasksView {...defaultProps} onDeleteTask={onDeleteTask} />);
    const doctorCard = screen.getAllByText("Doctor appointment")[0].closest("article");
    fireEvent.click(screen.getAllByText("Doctor appointment")[0]);
    fireEvent.click(doctorCard.querySelector(".mobile-action-delete"));
    expect(onDeleteTask).toHaveBeenCalledWith("2");
    expect(screen.getByText("Annual checkup.")).toBeInTheDocument();
  });

  it("shows the undo completion action after completing a task from the detail pane", () => {
    jest.useFakeTimers();
    const onMarkComplete = jest.fn();
    const completedTask = { ...makeTasks()[0], status: "completed" };
    const { rerender } = render(<TasksView {...defaultProps} onMarkComplete={onMarkComplete} />);

    fireEvent.click(screen.getAllByText("Mark Complete")[0]);
    rerender(<TasksView {...defaultProps} onMarkComplete={onMarkComplete} tasks={[completedTask, ...makeTasks().slice(1)]} />);

    expect(screen.getByText("Undo Completion")).toBeInTheDocument();

    jest.advanceTimersByTime(5000);
  });

  it("calls undo from the detail pane after a recent completion", () => {
    jest.useFakeTimers();
    const onUndoComplete = jest.fn();
    const completedTask = { ...makeTasks()[0], status: "completed" };
    const { rerender } = render(<TasksView {...defaultProps} />);

    fireEvent.click(screen.getAllByText("Mark Complete")[0]);
    rerender(<TasksView {...defaultProps} onUndoComplete={onUndoComplete} tasks={[completedTask, ...makeTasks().slice(1)]} />);

    fireEvent.click(screen.getByText("Undo Completion"));
    expect(onUndoComplete).toHaveBeenCalledWith("1");

    jest.runAllTimers();
  });

  it("calls undo from the completed task mobile action button", () => {
    const onUndoComplete = jest.fn();
    render(<TasksView {...defaultProps} onUndoComplete={onUndoComplete} />);
    fireEvent.click(screen.getByText("Completed task"));
    fireEvent.click(document.querySelector(".mobile-action-undo"));
    expect(onUndoComplete).toHaveBeenCalledWith("3");
  });

  it("shows no view-all button when the filter mode is all and there are no tasks", () => {
    render(<TasksView {...defaultProps} tasks={[]} filterMode="all" />);
    expect(screen.getByText("No tasks due today.")).toBeInTheDocument();
    expect(screen.queryByText("View all tasks")).not.toBeInTheDocument();
  });
});

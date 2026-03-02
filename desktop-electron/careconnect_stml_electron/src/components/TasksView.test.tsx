import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TasksView } from "./TasksView";

const baseTasks = [
  {
    id: "pending-1",
    title: "Take medication",
    description: "Morning medication dose",
    dueDateTime: new Date(2026, 1, 26, 9, 0, 0),
    priority: "high" as const,
    status: "pending" as const,
  },
  {
    id: "completed-1",
    title: "Refill prescription",
    description: "Completed yesterday",
    dueDateTime: new Date(2026, 1, 25, 12, 0, 0),
    priority: "medium" as const,
    status: "completed" as const,
  },
  {
    id: "completed-2",
    title: "Call daughter",
    description: "Weekly check-in",
    dueDateTime: new Date(2026, 1, 24, 15, 0, 0),
    priority: "low" as const,
    status: "completed" as const,
  },
];

describe("TasksView component", () => {
  test("search mode includes matching completed tasks and excludes non-matches", () => {
    render(
      <TasksView
        tasks={baseTasks}
        filterMode="search"
        searchQuery="prescription"
        onClearFilter={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        onMarkComplete={jest.fn()}
        onUndoComplete={jest.fn()}
      />
    );

    expect(screen.getByText('Search results for: "prescription"')).toBeInTheDocument();
    expect(screen.getAllByText("Refill prescription").length).toBeGreaterThan(0);
    expect(screen.queryByText("Call daughter")).not.toBeInTheDocument();
    expect(screen.queryByText("Take medication")).not.toBeInTheDocument();
  });

  test("clear search button triggers onClearFilter", async () => {
    const user = userEvent.setup();
    const onClearFilter = jest.fn();

    render(
      <TasksView
        tasks={baseTasks}
        filterMode="search"
        searchQuery="medication"
        onClearFilter={onClearFilter}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        onMarkComplete={jest.fn()}
        onUndoComplete={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "✕ Clear Search" }));
    expect(onClearFilter).toHaveBeenCalledTimes(1);
  });

  test("mark complete action calls onMarkComplete for selected pending task", async () => {
    const user = userEvent.setup();
    const onMarkComplete = jest.fn();

    render(
      <TasksView
        tasks={baseTasks}
        filterMode="all"
        searchQuery=""
        onClearFilter={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        onMarkComplete={onMarkComplete}
        onUndoComplete={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "Mark Complete" }));
    expect(onMarkComplete).toHaveBeenCalledWith("pending-1");
  });

  test("pressing Enter on a task card selects that task", () => {
    render(
      <TasksView
        tasks={baseTasks}
        filterMode="all"
        searchQuery=""
        onClearFilter={jest.fn()}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        onMarkComplete={jest.fn()}
        onUndoComplete={jest.fn()}
      />
    );

    const completedTaskCard = screen.getByRole("listitem", { name: "Refill prescription - Completed" });
    completedTaskCard.focus();
    fireEvent.keyDown(completedTaskCard, { key: "Enter" });

    expect(screen.getByRole("heading", { name: "Refill prescription" })).toBeInTheDocument();
  });
});

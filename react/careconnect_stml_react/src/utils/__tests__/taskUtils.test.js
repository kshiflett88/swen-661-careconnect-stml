import {
  filterTasks,
  formatDueDate,
  isDueToday,
  sortTasksByDueDate,
  splitTasksByStatus,
} from "../taskUtils";

describe("taskUtils", () => {
  const pendingTask = {
    id: "1",
    title: "Take medication",
    description: "Morning dose",
    dueDateTime: new Date("2026-03-23T09:00:00"),
    status: "pending",
  };

  const completedTask = {
    id: "2",
    title: "Call doctor",
    description: "Follow-up call",
    dueDateTime: new Date("2026-03-24T10:00:00"),
    status: "completed",
  };

  it("identifies when a task is due today", () => {
    expect(isDueToday(new Date("2026-03-23T15:30:00"), new Date("2026-03-23T08:00:00"))).toBe(true);
    expect(isDueToday(new Date("2026-03-24T15:30:00"), new Date("2026-03-23T08:00:00"))).toBe(false);
  });

  it("formats a same-day due date as today", () => {
    expect(formatDueDate(new Date("2026-03-23T09:00:00"), new Date("2026-03-23T08:00:00"))).toBe("Today at 9:00 AM");
  });

  it("formats a next-day due date as tomorrow", () => {
    expect(formatDueDate(new Date("2026-03-24T09:00:00"), new Date("2026-03-23T08:00:00"))).toBe("Tomorrow at 9:00 AM");
  });

  it("sorts tasks by due date ascending", () => {
    const tasks = [
      { ...completedTask, dueDateTime: new Date("2026-03-25T10:00:00") },
      { ...pendingTask, dueDateTime: new Date("2026-03-23T09:00:00") },
    ];

    expect(sortTasksByDueDate(tasks).map((task) => task.id)).toEqual(["1", "2"]);
  });

  it("splits tasks into pending and completed groups", () => {
    const result = splitTasksByStatus([pendingTask, completedTask]);

    expect(result.pending).toEqual([pendingTask]);
    expect(result.completed).toEqual([completedTask]);
  });

  it("filters today tasks correctly", () => {
    const result = filterTasks(
      [pendingTask],
      [completedTask],
      "today",
      "",
      new Date("2026-03-23T08:00:00")
    );

    expect(result.pending).toEqual([pendingTask]);
    expect(result.completed).toEqual([]);
  });

  it("filters search results across pending and completed tasks", () => {
    const result = filterTasks([pendingTask], [completedTask], "search", "doctor");

    expect(result.pending).toEqual([]);
    expect(result.completed).toEqual([completedTask]);
  });

  it("returns all tasks when no special filter is active", () => {
    const result = filterTasks([pendingTask], [completedTask], "all", "");

    expect(result.pending).toEqual([pendingTask]);
    expect(result.completed).toEqual([completedTask]);
  });
});
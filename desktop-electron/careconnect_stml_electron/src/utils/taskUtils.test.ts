import { filterTasks, formatDueDate, isDueToday, sortTasksByDueDate, splitTasksByStatus } from "./taskUtils";

type TestTask = {
  id: string;
  title: string;
  description: string;
  dueDateTime: Date;
  status: "pending" | "completed";
};

describe("taskUtils business logic", () => {
  test("isDueToday compares by calendar day", () => {
    const reference = new Date(2026, 1, 26, 8, 0, 0);

    expect(isDueToday(new Date(2026, 1, 26, 22, 15, 0), reference)).toBe(true);
    expect(isDueToday(new Date(2026, 1, 27, 0, 1, 0), reference)).toBe(false);
  });

  test("formatDueDate returns Today/Tomorrow/weekday labels", () => {
    const reference = new Date(2026, 1, 26, 8, 0, 0);

    expect(formatDueDate(new Date(2026, 1, 26, 9, 30, 0), reference)).toMatch(/^Today at /);
    expect(formatDueDate(new Date(2026, 1, 27, 9, 30, 0), reference)).toMatch(/^Tomorrow at /);
    expect(formatDueDate(new Date(2026, 2, 2, 9, 30, 0), reference)).toMatch(/ at /);
  });

  test("sorts tasks by due date and splits by status", () => {
    const tasks: TestTask[] = [
      {
        id: "3",
        title: "Third",
        description: "Later",
        dueDateTime: new Date(2026, 1, 28, 9, 0, 0),
        status: "completed",
      },
      {
        id: "1",
        title: "First",
        description: "Earliest",
        dueDateTime: new Date(2026, 1, 26, 9, 0, 0),
        status: "pending",
      },
      {
        id: "2",
        title: "Second",
        description: "Middle",
        dueDateTime: new Date(2026, 1, 27, 9, 0, 0),
        status: "pending",
      },
    ];

    const sorted = sortTasksByDueDate(tasks);
    expect(sorted.map((task) => task.id)).toEqual(["1", "2", "3"]);

    const split = splitTasksByStatus(sorted);
    expect(split.pending.map((task) => task.id)).toEqual(["1", "2"]);
    expect(split.completed.map((task) => task.id)).toEqual(["3"]);
  });

  test("filters today and search across pending and completed", () => {
    const reference = new Date(2026, 1, 26, 8, 0, 0);
    const pending: TestTask[] = [
      {
        id: "1",
        title: "Take medication",
        description: "Morning dose",
        dueDateTime: new Date(2026, 1, 26, 9, 0, 0),
        status: "pending",
      },
      {
        id: "2",
        title: "Call clinic",
        description: "Reschedule follow-up",
        dueDateTime: new Date(2026, 1, 27, 11, 0, 0),
        status: "pending",
      },
    ];

    const completed: TestTask[] = [
      {
        id: "3",
        title: "Refill prescription",
        description: "Picked up at pharmacy",
        dueDateTime: new Date(2026, 1, 25, 16, 0, 0),
        status: "completed",
      },
    ];

    const todayFiltered = filterTasks(pending, completed, "today", "", reference);
    expect(todayFiltered.pending.map((task) => task.id)).toEqual(["1"]);
    expect(todayFiltered.completed).toEqual([]);

    const searchFiltered = filterTasks(pending, completed, "search", "prescription", reference);
    expect(searchFiltered.pending).toEqual([]);
    expect(searchFiltered.completed.map((task) => task.id)).toEqual(["3"]);
  });
});

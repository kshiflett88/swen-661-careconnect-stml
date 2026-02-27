export type TaskFilterMode = "all" | "today" | "search";

type TaskLike = {
  title: string;
  description: string;
  dueDateTime: Date;
  status: "pending" | "completed";
};

export function isDueToday(date: Date, referenceDate = new Date()): boolean {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  return taskDate.getTime() === today.getTime();
}

export function formatDueDate(date: Date, referenceDate = new Date()): string {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (taskDate.getTime() === today.getTime()) {
    return `Today at ${timeStr}`;
  }

  if (taskDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow at ${timeStr}`;
  }

  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  return `${dayName} at ${timeStr}`;
}

export function sortTasksByDueDate<T extends TaskLike>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => a.dueDateTime.getTime() - b.dueDateTime.getTime());
}

export function splitTasksByStatus<T extends TaskLike>(tasks: T[]): { pending: T[]; completed: T[] } {
  return {
    pending: tasks.filter((task) => task.status === "pending"),
    completed: tasks.filter((task) => task.status === "completed"),
  };
}

export function filterTasks<T extends TaskLike>(
  pendingTasks: T[],
  completedTasks: T[],
  filterMode: TaskFilterMode,
  searchQuery: string,
  referenceDate = new Date()
): { pending: T[]; completed: T[] } {
  if (filterMode === "today") {
    return {
      pending: pendingTasks.filter((task) => isDueToday(task.dueDateTime, referenceDate)),
      completed: [],
    };
  }

  if (filterMode === "search" && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    const matchesQuery = (task: T) =>
      task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);

    return {
      pending: pendingTasks.filter(matchesQuery),
      completed: completedTasks.filter(matchesQuery),
    };
  }

  return {
    pending: pendingTasks,
    completed: completedTasks,
  };
}

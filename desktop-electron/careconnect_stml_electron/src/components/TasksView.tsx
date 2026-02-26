import type { MouseEvent } from "react";
import type { Task } from "../App";

interface TasksViewProps {
  tasks: Task[];
  filterMode: "all" | "today" | "search";
  searchQuery: string;
  onClearFilter: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMarkComplete: (taskId: string) => void;
  onUndoComplete: (taskId: string) => void;
  onContextMenu?: (event: MouseEvent, taskId: string) => void;
}

export function TasksView({
  tasks,
  filterMode,
  searchQuery,
  onClearFilter,
  onEditTask,
  onDeleteTask,
  onMarkComplete,
  onUndoComplete,
  onContextMenu,
}: TasksViewProps) {
  const today = new Date();

  const filteredTasks = tasks.filter((task) => {
    if (filterMode === "today") {
      return task.dueDateTime.toDateString() === today.toDateString();
    }

    if (filterMode === "search") {
      const query = searchQuery.trim().toLowerCase();
      return task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query);
    }

    return true;
  });

  return (
    <section>
      <h1>Tasks</h1>
      {(filterMode === "today" || filterMode === "search") && (
        <div style={{ marginBottom: 12 }}>
          <span>Active filter: {filterMode === "today" ? "Today" : `Search: ${searchQuery}`}</span>
          <button onClick={onClearFilter} style={{ marginLeft: 8 }}>
            Clear filter
          </button>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <p>No tasks match the current filter.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              onContextMenu={(event) => onContextMenu?.(event, task.id)}
              style={{ border: "1px solid #d0d0d0", borderRadius: 8, padding: 12 }}
            >
              <strong>{task.title}</strong>
              <p style={{ margin: "6px 0" }}>{task.description || "No description"}</p>
              <p style={{ margin: "6px 0" }}>
                Due: {task.dueDateTime.toLocaleDateString()} {task.dueDateTime.toLocaleTimeString()}
              </p>
              <p style={{ margin: "6px 0" }}>Priority: {task.priority}</p>
              <p style={{ margin: "6px 0" }}>Status: {task.status}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {task.status === "pending" ? (
                  <button onClick={() => onMarkComplete(task.id)}>Mark complete</button>
                ) : (
                  <button onClick={() => onUndoComplete(task.id)}>Undo complete</button>
                )}
                <button onClick={() => onEditTask(task.id)}>Edit</button>
                <button onClick={() => onDeleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
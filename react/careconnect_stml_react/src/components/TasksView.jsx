import { useMemo, useState } from "react";
import { filterTasks, formatDueDate, isDueToday, sortTasksByDueDate, splitTasksByStatus } from "../utils/taskUtils";
import "./TasksView.css";

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
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? "");
  const [recentlyCompletedId, setRecentlyCompletedId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const getPriorityClass = (priority) => {
    if (priority === "high") return "priority-badge priority-high";
    if (priority === "medium") return "priority-badge priority-medium";
    return "priority-badge priority-low";
  };

  const sortedTasks = useMemo(() => sortTasksByDueDate(tasks), [tasks]);
  const { pending: pendingTasks, completed: completedTasks } = useMemo(() => splitTasksByStatus(sortedTasks), [sortedTasks]);
  const { pending: filteredPendingTasks, completed: filteredCompletedTasks } = useMemo(
    () => filterTasks(pendingTasks, completedTasks, filterMode, searchQuery),
    [pendingTasks, completedTasks, filterMode, searchQuery]
  );

  const filteredTasks = useMemo(
    () => [...filteredPendingTasks, ...filteredCompletedTasks],
    [filteredPendingTasks, filteredCompletedTasks]
  );

  const effectiveSelectedTaskId =
    filteredTasks.length === 0
      ? ""
      : filteredTasks.some((task) => task.id === selectedTaskId)
      ? selectedTaskId
      : filteredTasks[0].id;

  const selectedTask = filteredTasks.find((task) => task.id === effectiveSelectedTaskId) ?? null;

  const handleTaskCardClick = (taskId) => {
    setSelectedTaskId(taskId);
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const handleTaskCardKeyDown = (event, taskId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedTaskId(taskId);
    }
  };

  return (
    <div className="tasks-layout">
      <section className="tasks-list-pane" aria-label="Task List">
        <div className="tasks-list-header-wrap">
          <div className="tasks-list-header">
            <h1>All Tasks</h1>
          </div>

          <div className="tasks-filter-state">
            {filterMode === "all" && (
              <div className="filter-card filter-all">
                <p>
                  <strong>Showing:</strong> All Tasks
                </p>
                <p className="filter-subtext">
                  {filteredTasks.length} active {filteredTasks.length === 1 ? "task" : "tasks"}
                </p>
              </div>
            )}

            {filterMode === "search" && (
              <div className="filter-card filter-search">
                <div>
                  <p className="filter-title">Search results for: &quot;{searchQuery}&quot;</p>
                  <p className="filter-subtext">
                    {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} found
                  </p>
                </div>
                <button type="button" className="filter-clear search" onClick={onClearFilter}>
                  ✕ Clear Search
                </button>
              </div>
            )}

            {filterMode === "today" && (
              <div className="filter-card filter-today">
                <div>
                  <p className="filter-title">Showing: Today&apos;s Tasks</p>
                  <p className="filter-subtext">
                    {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} due today
                  </p>
                </div>
                <button type="button" className="filter-clear today" onClick={onClearFilter}>
                  ✕ Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="tasks-list-scroll" role="list">
          {(filteredPendingTasks.length > 0 || filteredCompletedTasks.length > 0) && (
            <>
              {filteredPendingTasks.map((task) => {
                const isSelected = effectiveSelectedTaskId === task.id;
                const isToday = isDueToday(task.dueDateTime);

                return (
                  <article
                    key={task.id}
                    onClick={() => handleTaskCardClick(task.id)}
                    onKeyDown={(event) => handleTaskCardKeyDown(event, task.id)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      onContextMenu?.(event, task.id);
                    }}
                    className={`task-card ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${expandedTaskId === task.id ? "expanded" : ""}`}
                    tabIndex={0}
                    role="listitem"
                  >
                    <div className="task-row title-row">
                      <span className="task-icon" aria-hidden="true">
                        ☐
                      </span>
                      <p className="task-title">{task.title}</p>
                    </div>

                    <div className="task-row meta-row">
                      <span className="task-icon small" aria-hidden="true">
                        ⏰
                      </span>
                      <span className="task-meta-text">{formatDueDate(task.dueDateTime)}</span>
                    </div>

                    <div className="task-priority-wrap">
                      <span className={getPriorityClass(task.priority)}>{task.priority.toUpperCase()} PRIORITY</span>
                    </div>

                    <div className="task-card-actions">
                      <button
                        type="button"
                        className="mobile-action-complete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkComplete(task.id);
                          setRecentlyCompletedId(task.id);
                          setExpandedTaskId(null);
                          window.setTimeout(() => {
                            setRecentlyCompletedId((prev) => (prev === task.id ? null : prev));
                          }, 5000);
                        }}
                      >
                        ✓ Complete
                      </button>
                      <button
                        type="button"
                        className="mobile-action-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task.id);
                        }}
                      >
                        ✎ Edit
                      </button>
                      <button
                        type="button"
                        className="mobile-action-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </article>
                );
              })}

              {filteredCompletedTasks.length > 0 && (
                <>
                  <div className="completed-divider" role="listitem" aria-label="Completed tasks section">
                    <div />
                    <span>Completed Tasks</span>
                    <div />
                  </div>

                  {filteredCompletedTasks.map((task) => {
                    const isSelected = effectiveSelectedTaskId === task.id;
                    return (
                      <article
                        key={task.id}
                        onClick={() => handleTaskCardClick(task.id)}
                        onKeyDown={(event) => handleTaskCardKeyDown(event, task.id)}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          onContextMenu?.(event, task.id);
                        }}
                        className={`task-card completed ${isSelected ? "selected-completed" : ""} ${expandedTaskId === task.id ? "expanded" : ""}`}
                        tabIndex={0}
                        role="listitem"
                        aria-label={`${task.title} - Completed`}
                      >
                        <div className="task-row title-row">
                          <span className="task-icon done" aria-hidden="true">
                            ☑
                          </span>
                          <div>
                            <p className="task-title completed-title">{task.title}</p>
                            <span className="completed-pill">COMPLETED</span>
                          </div>
                        </div>

                        <div className="task-row meta-row">
                          <span className="task-icon small" aria-hidden="true">
                            ⏰
                          </span>
                          <span className="task-meta-text">{formatDueDate(task.dueDateTime)}</span>
                        </div>

                        <div className="task-card-actions">
                          <button
                            type="button"
                            className="mobile-action-undo"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUndoComplete(task.id);
                              setExpandedTaskId(null);
                            }}
                          >
                            ↩ Undo
                          </button>
                          <button
                            type="button"
                            className="mobile-action-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task.id);
                            }}
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </>
              )}
            </>
          )}

          {filteredTasks.length === 0 && (
            <div className="empty-state" role="listitem">
              <p>{filterMode === "search" ? "No tasks found matching your search." : "No tasks due today."}</p>
              {filterMode !== "all" && (
                <button type="button" onClick={onClearFilter}>
                  View all tasks
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedTask && (
        <section className="task-detail-pane" aria-label="Task Details">
          <div className="task-detail-header">
            <div className="task-detail-title-row">
              <h2>{selectedTask.title}</h2>
              <span className={getPriorityClass(selectedTask.priority)}>{selectedTask.priority.toUpperCase()} PRIORITY</span>
            </div>

            <div className="task-detail-meta">
              <div className="task-row">
                <span className="task-icon small" aria-hidden="true">
                  ⏰
                </span>
                <span>
                  <strong>Due:</strong> {formatDueDate(selectedTask.dueDateTime)}
                </span>
              </div>
              {selectedTask.assignedTo && (
                <div className="task-row">
                  <span className="task-icon small" aria-hidden="true">
                    👤
                  </span>
                  <span>
                    <strong>Assigned to:</strong> {selectedTask.assignedTo}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="task-detail-body">
            <h3>Description</h3>
            <p>{selectedTask.description}</p>

            {selectedTask.status === "pending" ? (
              <div className="task-actions">
                <button
                  type="button"
                  className="action-complete"
                  onClick={() => {
                    onMarkComplete(selectedTask.id);
                    setRecentlyCompletedId(selectedTask.id);
                    window.setTimeout(() => {
                      setRecentlyCompletedId((prev) => (prev === selectedTask.id ? null : prev));
                    }, 5000);
                  }}
                >
                  Mark Complete
                </button>
                <button type="button" className="action-edit" onClick={() => onEditTask(selectedTask.id)}>
                  Edit Task
                </button>
                <button type="button" className="action-delete" onClick={() => onDeleteTask(selectedTask.id)}>
                  Delete Task
                </button>
              </div>
            ) : (
              <>
                <div className="completed-info">
                  <div className="task-row">
                    <span className="task-icon done" aria-hidden="true">
                      ☑
                    </span>
                    <div>
                      <p className="completed-info-title">Task Completed</p>
                      <p className="completed-info-subtitle">This task has been marked as complete.</p>
                    </div>
                  </div>
                </div>

                {recentlyCompletedId === selectedTask.id && (
                  <div className="undo-wrap">
                    <button type="button" className="action-undo" onClick={() => onUndoComplete(selectedTask.id)}>
                      Undo Completion
                    </button>
                    <p>This option will disappear in a few seconds</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="task-detail-footer">Right-click on any task in the list for quick actions</div>
        </section>
      )}
    </div>
  );
}

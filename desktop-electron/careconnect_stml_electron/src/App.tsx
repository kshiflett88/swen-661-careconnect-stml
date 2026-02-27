import { useState, type MouseEvent } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DashboardView } from "./components/DashboardView";
import { TasksView } from "./components/TasksView";
import { SettingsView } from "./components/SettingsView";
import { ContactsView } from "./components/ContactsView";
import { ContextMenu } from "./components/ContextMenu";
import { EmergencyModal } from "./components/EmergencyModal";
import { AddTaskModal } from "./components/AddTaskModal";
import { EditTaskModal } from "./components/EditTaskModal";
import { DeleteTaskConfirmModal } from "./components/DeleteTaskConfirmModal";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInHelpScreen from "./screens/SignInHelpScreen";
import type { ScreenId } from "./types";

type NavPage = "Dashboard" | "Tasks" | "Contacts" | "Settings";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDateTime: Date;
  priority: "high" | "medium" | "low";
  assignedTo?: string;
  status: "pending" | "completed";
}

export default function App() {
  const [entryScreen, setEntryScreen] = useState<"welcome" | "signin-help" | "app">("welcome");
  const [activeNav, setActiveNav] = useState<NavPage>("Dashboard");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCompleteTaskId, setPendingCompleteTaskId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; taskId: string } | null>(null);
  const [taskFilterMode, setTaskFilterMode] = useState<"all" | "today" | "search">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyConfirmed, setEmergencyConfirmed] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showDeleteTaskConfirmModal, setShowDeleteTaskConfirmModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Take morning medication",
      description: "Take prescribed medication with food.",
      dueDateTime: new Date("2026-02-20T09:00:00"),
      priority: "high",
      status: "pending",
    },
    {
      id: "2",
      title: "Doctor appointment",
      description: "Annual checkup with Dr. Johnson.",
      dueDateTime: new Date("2026-02-20T14:00:00"),
      priority: "high",
      assignedTo: "Dr. Johnson",
      status: "pending",
    },
    {
      id: "3",
      title: "Call Sarah (daughter)",
      description: "Weekly check-in call.",
      dueDateTime: new Date("2026-02-21T10:00:00"),
      priority: "medium",
      status: "pending",
    },
  ]);

  const handleEntryNavigation = (screen: ScreenId) => {
    if (screen === "dashboard") {
      setActiveNav("Dashboard");
      setEntryScreen("app");
      return;
    }

    if (screen === "signin-help") {
      setEntryScreen("signin-help");
      return;
    }

    setEntryScreen("welcome");
  };

  if (entryScreen === "welcome") {
    return <WelcomeScreen onGo={handleEntryNavigation} />;
  }

  if (entryScreen === "signin-help") {
    return <SignInHelpScreen onGo={handleEntryNavigation} />;
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)));
  };

  const handleUndoComplete = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "pending" } : task)));
  };

  const handleContextMenu = (e: MouseEvent, taskId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, taskId });
  };

  const handleContextEdit = () => {
    setEditingTaskId(contextMenu?.taskId ?? null);
    setShowEditTaskModal(true);
    setContextMenu(null);
  };

  const handleContextMarkComplete = () => {
    setPendingCompleteTaskId(contextMenu?.taskId ?? null);
    setShowConfirmDialog(true);
    setContextMenu(null);
  };

  const handleContextDelete = () => {
    setDeletingTaskId(contextMenu?.taskId ?? null);
    setShowDeleteTaskConfirmModal(true);
    setContextMenu(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    setActiveNav("Tasks");
    if (value.trim()) {
      setTaskFilterMode("search");
      setSearchQuery(value);
      return;
    }
    setTaskFilterMode("all");
    setSearchQuery("");
  };

  const handleTodayClick = () => {
    setActiveNav("Tasks");
    setTaskFilterMode((prev) => (prev === "today" ? "all" : "today"));
    setSearchQuery("");
    setSearchInputValue("");
  };

  const handleClearFilter = () => {
    setTaskFilterMode("all");
    setSearchQuery("");
    setSearchInputValue("");
  };

  const handleAddTaskSubmit = (taskData: {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "high" | "medium" | "low";
  }) => {
    const newTask: Task = {
      id: String(Date.now()),
      title: taskData.title,
      description: taskData.description,
      dueDateTime: new Date(`${taskData.dueDate}T${taskData.dueTime}`),
      priority: taskData.priority,
      status: "pending",
    };

    setTasks((prev) => [...prev, newTask]);
    setShowAddTaskModal(false);
    setActiveNav("Tasks");
    handleClearFilter();
  };

  const handleEditTaskSubmit = (
    taskId: string,
    taskData: {
      title: string;
      description: string;
      dueDate: string;
      dueTime: string;
      priority: "high" | "medium" | "low";
    }
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: taskData.title,
              description: taskData.description,
              dueDateTime: new Date(`${taskData.dueDate}T${taskData.dueTime}`),
              priority: taskData.priority,
            }
          : task
      )
    );
    setShowEditTaskModal(false);
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setShowEditTaskModal(false);
    setEditingTaskId(null);
  };

  let content: React.ReactNode;
  if (activeNav === "Dashboard") {
    content = <DashboardView tasks={tasks} onOpenTasks={() => setActiveNav("Tasks")} />;
  } else if (activeNav === "Tasks") {
    content = (
      <TasksView
        onContextMenu={handleContextMenu}
        filterMode={taskFilterMode}
        searchQuery={searchQuery}
        onClearFilter={handleClearFilter}
        tasks={tasks}
        onEditTask={(taskId) => {
          setEditingTaskId(taskId);
          setShowEditTaskModal(true);
        }}
        onDeleteTask={(taskId) => {
          setDeletingTaskId(taskId);
          setShowDeleteTaskConfirmModal(true);
        }}
        onMarkComplete={handleMarkComplete}
        onUndoComplete={handleUndoComplete}
      />
    );
  } else if (activeNav === "Contacts") {
    content = <ContactsView />;
  } else {
    content = <SettingsView />;
  }

  const activeTaskCount = tasks.filter((task) => task.status !== "completed").length;
  const nextPendingTask = [...tasks]
    .filter((task) => task.status === "pending")
    .sort((a, b) => a.dueDateTime.getTime() - b.dueDateTime.getTime())[0];

  const currentDateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const nextTaskDueLabel = (() => {
    if (!nextPendingTask) {
      return "No upcoming tasks";
    }

    const date = nextPendingTask.dueDateTime;
    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueDay = new Date(date);
    dueDay.setHours(0, 0, 0, 0);

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (dueDay.getTime() === today.getTime()) {
      return `Today at ${time}`;
    }

    if (dueDay.getTime() === tomorrow.getTime()) {
      return `Tomorrow at ${time}`;
    }

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${weekday} at ${time}`;
  })();

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <button className="toolbar-button toolbar-primary toolbar-with-icon" onClick={() => setShowAddTaskModal(true)}>
          <svg
            className="toolbar-add-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>Add Task</span>
        </button>
        <div className="toolbar-search-wrap">
          <span className="toolbar-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={searchInputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="toolbar-search"
          />
        </div>
        <button
          className={`toolbar-button toolbar-with-icon toolbar-today ${taskFilterMode === "today" ? "toolbar-today-active" : ""}`}
          onClick={handleTodayClick}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>Today</span>
        </button>
        <button
          className="toolbar-button toolbar-with-icon toolbar-sos"
          onClick={() => {
            setEmergencyConfirmed(false);
            setShowEmergencyModal(true);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7.5V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
          </svg>
          <span>SOS</span>
        </button>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <div className="app-sidebar-title">CareConnect</div>
          <nav className="app-sidebar-nav" aria-label="Primary">
            {(["Dashboard", "Tasks", "Contacts", "Settings"] as NavPage[]).map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={activeNav === item ? "is-active" : undefined}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="app-content">
          <div className="app-context-bar">
            <strong>You are on:</strong> {activeNav}
          </div>
          {content}
        </main>
      </div>

      <footer className="app-footer" role="contentinfo">
        <span className="app-footer-item">
          <strong>Current Date:</strong> {currentDateLabel}
        </span>
        <span className="app-footer-item app-footer-divider">
          <strong>Active Tasks:</strong> {activeTaskCount}
        </span>
        <span className="app-footer-item app-footer-divider">
          <strong>Next Task Due:</strong> {nextTaskDueLabel}
        </span>
        <span className="app-footer-help">Help is always available in the Help menu</span>
      </footer>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Mark task complete?"
        message="This will move the task to completed status."
        confirmText="Complete"
        cancelText="Cancel"
        variant="success"
        onConfirm={() => {
          if (pendingCompleteTaskId) {
            handleMarkComplete(pendingCompleteTaskId);
          }
          setPendingCompleteTaskId(null);
          setShowConfirmDialog(false);
        }}
        onCancel={() => {
          setPendingCompleteTaskId(null);
          setShowConfirmDialog(false);
        }}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={handleContextEdit}
          onMarkComplete={handleContextMarkComplete}
          onDelete={handleContextDelete}
          onClose={() => setContextMenu(null)}
        />
      )}

      <EmergencyModal
        isOpen={showEmergencyModal}
        onConfirm={() => setEmergencyConfirmed(true)}
        onCancel={() => {
          setEmergencyConfirmed(false);
          setShowEmergencyModal(false);
        }}
        onClose={() => {
          setEmergencyConfirmed(false);
          setShowEmergencyModal(false);
        }}
        confirmed={emergencyConfirmed}
      />

      <AddTaskModal isOpen={showAddTaskModal} onCancel={() => setShowAddTaskModal(false)} onSave={handleAddTaskSubmit} />

      <EditTaskModal
        isOpen={showEditTaskModal}
        onCancel={() => {
          setShowEditTaskModal(false);
          setEditingTaskId(null);
        }}
        onSave={handleEditTaskSubmit}
        onDelete={(taskId) => {
          setDeletingTaskId(taskId);
          setShowDeleteTaskConfirmModal(true);
          setShowEditTaskModal(false);
          setEditingTaskId(null);
        }}
        task={tasks.find((task) => task.id === editingTaskId) ?? null}
      />

      <DeleteTaskConfirmModal
        isOpen={showDeleteTaskConfirmModal}
        task={tasks.find((task) => task.id === deletingTaskId) ?? null}
        onCancel={() => {
          setShowDeleteTaskConfirmModal(false);
          setDeletingTaskId(null);
        }}
        onConfirmDelete={(taskId) => {
          handleDeleteTask(taskId);
          setShowDeleteTaskConfirmModal(false);
          setDeletingTaskId(null);
        }}
      />
    </div>
  );
}
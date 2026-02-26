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
import { SignInView } from "./components/SignInView";
import { SignInHelpView } from "./components/SignInHelpView";

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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authStep, setAuthStep] = useState<"signin" | "help">("signin");
  const [showContactCaregiverConfirm, setShowContactCaregiverConfirm] = useState(false);
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
    dueDate: string;
    dueTime: string;
    priority: "high" | "medium" | "low";
  }) => {
    const newTask: Task = {
      id: String(Date.now()),
      title: taskData.title,
      description: "",
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
    taskData: { title: string; dueDate: string; dueTime: string; priority: "high" | "medium" | "low" }
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: taskData.title,
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

  if (!isSignedIn) {
    return (
      <>
        <SignInView onSignIn={() => setIsSignedIn(true)} onNeedHelp={() => setAuthStep("help")} />
        {authStep === "help" && (
          <SignInHelpView
            onResetAccess={() => {
              setAuthStep("signin");
              setShowContactCaregiverConfirm(false);
            }}
            onClose={() => {
              setAuthStep("signin");
              setShowContactCaregiverConfirm(false);
            }}
            onContactCaregiver={() => setShowContactCaregiverConfirm(true)}
          />
        )}
        <ConfirmDialog
          isOpen={showContactCaregiverConfirm}
          title="Contact caregiver?"
          message="This will send a caregiver contact request."
          confirmText="Contact"
          cancelText="Cancel"
          variant="primary"
          onConfirm={() => setShowContactCaregiverConfirm(false)}
          onCancel={() => setShowContactCaregiverConfirm(false)}
        />
      </>
    );
  }

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

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <button className="toolbar-button toolbar-primary" onClick={() => setShowAddTaskModal(true)}>
          Add Task
        </button>
        <input
          value={searchInputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="toolbar-search"
        />
        <button className="toolbar-button" onClick={handleTodayClick}>
          {taskFilterMode === "today" ? "Today ✓" : "Today"}
        </button>
        <button
          className="toolbar-button toolbar-sos"
          onClick={() => {
            setEmergencyConfirmed(false);
            setShowEmergencyModal(true);
          }}
        >
          SOS
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

        <main className="app-content">{content}</main>
      </div>

      <footer className="app-footer">
        Active tasks: {tasks.filter((task) => task.status !== "completed").length}
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
        onDelete={handleDeleteTask}
        task={tasks.find((task) => task.id === editingTaskId) ?? null}
      />

      <DeleteTaskConfirmModal
        isOpen={showDeleteTaskConfirmModal}
        taskTitle={tasks.find((task) => task.id === deletingTaskId)?.title ?? ""}
        onCancel={() => {
          setShowDeleteTaskConfirmModal(false);
          setDeletingTaskId(null);
        }}
        onConfirm={() => {
          if (deletingTaskId) {
            handleDeleteTask(deletingTaskId);
          }
          setShowDeleteTaskConfirmModal(false);
          setDeletingTaskId(null);
        }}
      />
    </div>
  );
}
import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DashboardView } from "./components/DashboardView";
import { TasksView } from "./components/TasksView";
import SettingsView from "./components/SettingsView";
import { ContactsView } from "./components/ContactsView";
import { ContextMenu } from "./components/ContextMenu";
import { EmergencyModal } from "./components/EmergencyModal";
import { AddTaskModal } from "./components/AddTaskModal";
import { EditTaskModal } from "./components/EditTaskModal";
import { DeleteTaskConfirmModal } from "./components/DeleteTaskConfirmModal";
import { SuccessBanner } from "./components/SuccessBanner";
import { SignInView } from "./components/SignInView";
import { SignInHelpView } from "./components/SignInHelpView";

const NAV_ROUTES = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/contacts": "Contacts",
  "/settings": "Settings",
};

const NAV_PATHS = {
  Dashboard: "/dashboard",
  Tasks: "/tasks",
  Contacts: "/contacts",
  Settings: "/settings",
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = NAV_ROUTES[location.pathname] ?? "Dashboard";

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authStep, setAuthStep] = useState("signin");
  const [showContactCaregiverConfirm, setShowContactCaregiverConfirm] = useState(false);
  const [caregiverRequestSent, setCaregiverRequestSent] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCompleteTaskId, setPendingCompleteTaskId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [taskFilterMode, setTaskFilterMode] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyConfirmed, setEmergencyConfirmed] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showDeleteTaskConfirmModal, setShowDeleteTaskConfirmModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [textScalePercent, setTextScalePercent] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerVisible, setBannerVisible] = useState(false);
  const desktopSearchInputId = "global-task-search";
  const mobileSearchInputId = "global-task-search-mobile";

  const showBanner = useCallback((message) => {
    setBannerMessage(message);
    setBannerVisible(true);
  }, []);

  const dismissBanner = useCallback(() => {
    setBannerVisible(false);
  }, []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const applyTextScaleAction = (action) => {
    setTextScalePercent((prev) => {
      if (action === "reset") return 100;
      if (action === "up") return Math.min(prev + 10, 150);
      return Math.max(prev - 10, 80);
    });
  };

  const [tasks, setTasks] = useState([
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

  // Keyboard zoom (Ctrl+/-, Ctrl+0)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

      if (event.key === "+" || event.key === "=" || event.code === "NumpadAdd") {
        event.preventDefault();
        applyTextScaleAction("up");
        return;
      }

      if (event.key === "-" || event.key === "_" || event.code === "NumpadSubtract") {
        event.preventDefault();
        applyTextScaleAction("down");
        return;
      }

      if (event.key === "0" || event.code === "Numpad0") {
        event.preventDefault();
        applyTextScaleAction("reset");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!isSignedIn) {
    return (
      <>
        <SignInView
          onSignIn={() => setIsSignedIn(true)}
          onNeedHelp={() => {
            setAuthStep("help");
            setCaregiverRequestSent(false);
          }}
        />
        {authStep === "help" && (
          <SignInHelpView
            onResetAccess={() => {
              setAuthStep("signin");
              setShowContactCaregiverConfirm(false);
              setCaregiverRequestSent(false);
            }}
            onClose={() => {
              setAuthStep("signin");
              setShowContactCaregiverConfirm(false);
              setCaregiverRequestSent(false);
            }}
            onContactCaregiver={() => setShowContactCaregiverConfirm(true)}
            caregiverRequestSent={caregiverRequestSent}
          />
        )}
        <ConfirmDialog
          isOpen={showContactCaregiverConfirm}
          title="Contact caregiver?"
          message="This will send a caregiver contact request."
          confirmText="Contact"
          cancelText="Cancel"
          variant="primary"
          onConfirm={() => {
            setShowContactCaregiverConfirm(false);
            setCaregiverRequestSent(true);
          }}
          onCancel={() => setShowContactCaregiverConfirm(false)}
        />
      </>
    );
  }

  const handleMarkComplete = (taskId) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)));
  };

  const handleUndoComplete = (taskId) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "pending" } : task)));
  };

  const handleContextMenu = (e, taskId) => {
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

  const handleSearchChange = (value) => {
    setSearchInputValue(value);
    navigate("/tasks");
    if (value.trim()) {
      setTaskFilterMode("search");
      setSearchQuery(value);
      return;
    }
    setTaskFilterMode("all");
    setSearchQuery("");
  };

  const handleTodayClick = () => {
    navigate("/tasks");
    setTaskFilterMode((prev) => (prev === "today" ? "all" : "today"));
    setSearchQuery("");
    setSearchInputValue("");
  };

  const handleClearFilter = () => {
    setTaskFilterMode("all");
    setSearchQuery("");
    setSearchInputValue("");
  };

  const handleAddTaskSubmit = (taskData) => {
    const newTask = {
      id: String(Date.now()),
      title: taskData.title,
      description: taskData.description,
      dueDateTime: new Date(`${taskData.dueDate}T${taskData.dueTime}`),
      priority: taskData.priority,
      status: "pending",
    };

    setTasks((prev) => [...prev, newTask]);
    setShowAddTaskModal(false);
    navigate("/tasks");
    handleClearFilter();
    showBanner(`Success: ${newTask.title} was added!`);
  };

  const handleEditTaskSubmit = (taskId, taskData) => {
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

  const handleDeleteTask = (taskId) => {
    const deletedTask = tasks.find((task) => task.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setShowEditTaskModal(false);
    setEditingTaskId(null);
    if (deletedTask) {
      showBanner(`Success: ${deletedTask.title} was deleted!`);
    }
  };

  const handleQuickAddTask = (taskData) => {
    const now = new Date();
    const fallbackDate = now.toISOString().slice(0, 10);
    const fallbackTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newTask = {
      id: String(Date.now()),
      title: taskData.title,
      description: "",
      dueDateTime: new Date(`${taskData.dueDate ?? fallbackDate}T${taskData.dueTime ?? fallbackTime}`),
      priority: "medium",
      status: "pending",
    };

    setTasks((prev) => [...prev, newTask]);
    showBanner(`Success: ${newTask.title} was added!`);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setAuthStep("signin");
    navigate("/dashboard");
    setShowEmergencyModal(false);
    setEmergencyConfirmed(false);
    setContextMenu(null);
  };

  const routeContent = (
    <Routes>
      <Route path="/dashboard" element={
        <DashboardView
          tasks={tasks}
          onOpenTasks={() => navigate("/tasks")}
          onMarkComplete={handleMarkComplete}
          onQuickAddTask={handleQuickAddTask}
        />
      } />
      <Route path="/tasks" element={
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
      } />
      <Route path="/contacts" element={<ContactsView />} />
      <Route path="/settings" element={<SettingsView onSignOut={handleSignOut} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );

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
    if (!nextPendingTask) return "No upcoming tasks";

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

    if (dueDay.getTime() === today.getTime()) return `Today at ${time}`;
    if (dueDay.getTime() === tomorrow.getTime()) return `Tomorrow at ${time}`;

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${weekday} at ${time}`;
  })();

  const handleNavClick = (item) => {
    navigate(NAV_PATHS[item]);
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell" style={{ zoom: textScalePercent / 100 }}>
      <header className="app-toolbar">
        <button
          className="toolbar-hamburger"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
        >
          ☰
        </button>
        <span className="toolbar-mobile-title">CareConnect</span>
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
          <label htmlFor={desktopSearchInputId} className="sr-only">
            Search tasks
          </label>
          <span className="toolbar-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id={desktopSearchInputId}
            value={searchInputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="toolbar-search"
            aria-label="Search tasks"
          />
        </div>
        <button
          className="toolbar-search-btn"
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          aria-label="Search tasks"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
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

      {mobileSearchOpen && (
        <div style={{ padding: "8px 10px", background: "var(--color-card)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="toolbar-search-wrap" style={{ maxWidth: "100%", display: "block" }}>
            <label htmlFor={mobileSearchInputId} className="sr-only">
              Search tasks
            </label>
            <span className="toolbar-search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id={mobileSearchInputId}
              value={searchInputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="toolbar-search"
              style={{ maxWidth: "100%" }}
              autoFocus
              aria-label="Search tasks"
            />
          </div>
        </div>
      )}

      <div className="app-body">
        {sidebarOpen && (
          <div className="sidebar-overlay sidebar-overlay-visible" onClick={closeSidebar} />
        )}
        <aside className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
          <div className="app-sidebar-title">CareConnect</div>
          <nav className="app-sidebar-nav" aria-label="Primary">
            {["Dashboard", "Tasks", "Contacts", "Settings"].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
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
          {routeContent}
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

      {/* Bottom navigation bar for mobile/tablet */}
      <nav className="bottom-nav" aria-label="Primary navigation">
        <button
          className={`bottom-nav-btn${activeNav === "Dashboard" ? " bottom-nav-active" : ""}`}
          onClick={() => handleNavClick("Dashboard")}
          aria-current={activeNav === "Dashboard" ? "page" : undefined}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>Dashboard</span>
        </button>
        <button
          className={`bottom-nav-btn${activeNav === "Tasks" ? " bottom-nav-active" : ""}`}
          onClick={() => handleNavClick("Tasks")}
          aria-current={activeNav === "Tasks" ? "page" : undefined}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Tasks</span>
        </button>
        <button
          className={`bottom-nav-btn${activeNav === "Contacts" ? " bottom-nav-active" : ""}`}
          onClick={() => handleNavClick("Contacts")}
          aria-current={activeNav === "Contacts" ? "page" : undefined}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
            <path d="M3 19C3 16.2386 5.23858 14 8 14H10C12.7614 14 15 16.2386 15 19V20H3V19Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
            <path d="M17 14.5C19.2091 14.5 21 16.2909 21 18.5V20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Contacts</span>
        </button>
        <button
          className={`bottom-nav-btn${activeNav === "Settings" ? " bottom-nav-active" : ""}`}
          onClick={() => handleNavClick("Settings")}
          aria-current={activeNav === "Settings" ? "page" : undefined}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Settings</span>
        </button>
      </nav>

      <SuccessBanner
        message={bannerMessage}
        isVisible={bannerVisible}
        onDismiss={dismissBanner}
      />

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

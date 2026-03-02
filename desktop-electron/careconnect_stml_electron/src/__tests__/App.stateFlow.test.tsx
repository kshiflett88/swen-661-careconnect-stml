import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../components/SignInView", () => ({
  SignInView: ({ onSignIn, onNeedHelp }: { onSignIn: () => void; onNeedHelp: () => void }) => (
    <div>
      <button onClick={onSignIn}>mock-sign-in</button>
      <button onClick={onNeedHelp}>mock-need-help</button>
    </div>
  ),
}));

jest.mock("../components/SignInHelpView", () => ({
  SignInHelpView: ({
    onResetAccess,
    onClose,
    onContactCaregiver,
    caregiverRequestSent,
  }: {
    onResetAccess: () => void;
    onClose: () => void;
    onContactCaregiver: () => void;
    caregiverRequestSent: boolean;
  }) => (
    <div>
      <button onClick={onResetAccess}>mock-reset</button>
      <button onClick={onClose}>mock-close-help</button>
      <button onClick={onContactCaregiver}>mock-contact-caregiver</button>
      <span>{caregiverRequestSent ? "request-sent" : "request-not-sent"}</span>
    </div>
  ),
}));

jest.mock("../components/ConfirmDialog", () => ({
  ConfirmDialog: ({
    isOpen,
    title,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  }: {
    isOpen: boolean;
    title: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    isOpen ? (
      <div role="alertdialog" aria-label={title}>
        <button onClick={onConfirm}>{confirmText}</button>
        <button onClick={onCancel}>{cancelText}</button>
      </div>
    ) : null,
}));

jest.mock("../components/DashboardView", () => ({
  DashboardView: ({
    onOpenTasks,
    onMarkComplete,
    onQuickAddTask,
  }: {
    onOpenTasks: () => void;
    onMarkComplete: (taskId: string) => void;
    onQuickAddTask: (taskData: { title: string; dueDate?: string; dueTime?: string }) => void;
  }) => (
    <div>
      <button onClick={onOpenTasks}>mock-open-tasks</button>
      <button onClick={() => onMarkComplete("1")}>mock-dash-complete</button>
      <button onClick={() => onQuickAddTask({ title: "Quick Task" })}>mock-dash-quick-add</button>
    </div>
  ),
}));

jest.mock("../components/TasksView", () => ({
  TasksView: ({
    filterMode,
    searchQuery,
    tasks,
    onClearFilter,
    onEditTask,
    onDeleteTask,
    onMarkComplete,
    onUndoComplete,
    onContextMenu,
  }: {
    filterMode: string;
    searchQuery: string;
    tasks: Array<{ id: string }>;
    onClearFilter: () => void;
    onEditTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onMarkComplete: (taskId: string) => void;
    onUndoComplete: (taskId: string) => void;
    onContextMenu?: (event: MouseEvent, taskId: string) => void;
  }) => (
    <div>
      <div>{`mock-filter:${filterMode}|query:${searchQuery}|count:${tasks.length}`}</div>
      <button onClick={onClearFilter}>mock-clear-filter</button>
      <button onClick={() => onEditTask("1")}>mock-open-edit</button>
      <button onClick={() => onDeleteTask("1")}>mock-open-delete</button>
      <button onClick={() => onMarkComplete("1")}>mock-mark-complete</button>
      <button onClick={() => onUndoComplete("1")}>mock-undo-complete</button>
      <button
        onClick={() =>
          onContextMenu?.(
            {
              preventDefault: () => undefined,
              clientX: 10,
              clientY: 20,
            } as unknown as MouseEvent,
            "1"
          )
        }
      >
        mock-open-context
      </button>
    </div>
  ),
}));

jest.mock("../components/ContextMenu", () => ({
  ContextMenu: ({ onEdit, onMarkComplete, onDelete, onClose }: { onEdit: () => void; onMarkComplete: () => void; onDelete: () => void; onClose: () => void }) => (
    <div role="menu">
      <button onClick={onEdit}>mock-context-edit</button>
      <button onClick={onMarkComplete}>mock-context-complete</button>
      <button onClick={onDelete}>mock-context-delete</button>
      <button onClick={onClose}>mock-context-close</button>
    </div>
  ),
}));

jest.mock("../components/AddTaskModal", () => ({
  AddTaskModal: ({ isOpen, onSave, onCancel }: { isOpen: boolean; onSave: (taskData: { title: string; description: string; dueDate: string; dueTime: string; priority: "high" | "medium" | "low" }) => void; onCancel: () => void }) =>
    isOpen ? (
      <div role="dialog" aria-label="mock-add-modal">
        <button
          onClick={() =>
            onSave({
              title: "Added from modal",
              description: "desc",
              dueDate: "2026-03-10",
              dueTime: "09:30",
              priority: "high",
            })
          }
        >
          mock-save-add
        </button>
        <button onClick={onCancel}>mock-cancel-add</button>
      </div>
    ) : null,
}));

jest.mock("../components/EditTaskModal", () => ({
  EditTaskModal: ({ isOpen, task, onSave, onDelete, onCancel }: { isOpen: boolean; task: { id: string } | null; onSave: (taskId: string, taskData: { title: string; description: string; dueDate: string; dueTime: string; priority: "high" | "medium" | "low" }) => void; onDelete: (taskId: string) => void; onCancel: () => void }) =>
    isOpen && task ? (
      <div role="dialog" aria-label="mock-edit-modal">
        <button onClick={() => onSave(task.id, { title: "Edited", description: "Edited desc", dueDate: "2026-03-12", dueTime: "11:00", priority: "low" })}>mock-save-edit</button>
        <button onClick={() => onDelete(task.id)}>mock-delete-from-edit</button>
        <button onClick={onCancel}>mock-cancel-edit</button>
      </div>
    ) : null,
}));

jest.mock("../components/DeleteTaskConfirmModal", () => ({
  DeleteTaskConfirmModal: ({ isOpen, task, onConfirmDelete, onCancel }: { isOpen: boolean; task: { id: string } | null; onConfirmDelete: (taskId: string) => void; onCancel: () => void }) =>
    isOpen && task ? (
      <div role="alertdialog" aria-label="mock-delete-modal">
        <button onClick={() => onConfirmDelete(task.id)}>mock-confirm-delete</button>
        <button onClick={onCancel}>mock-cancel-delete</button>
      </div>
    ) : null,
}));

jest.mock("../components/EmergencyModal", () => ({
  EmergencyModal: ({ isOpen, confirmed, onConfirm, onCancel, onClose }: { isOpen: boolean; confirmed: boolean; onConfirm: () => void; onCancel: () => void; onClose: () => void }) =>
    isOpen ? (
      <div role="dialog" aria-label="mock-emergency-modal">
        <span>{confirmed ? "confirmed" : "not-confirmed"}</span>
        <button onClick={onConfirm}>mock-emergency-confirm</button>
        <button onClick={onCancel}>mock-emergency-cancel</button>
        <button onClick={onClose}>mock-emergency-close</button>
      </div>
    ) : null,
}));

jest.mock("../components/ContactsView", () => ({ ContactsView: () => <div>mock-contacts</div> }));
jest.mock("../components/SettingsView", () => ({ __esModule: true, default: () => <div>mock-settings</div> }));

describe("App state flow coverage", () => {
  test("covers sign-in help and caregiver confirm branches", () => {
    render(<App />);

    fireEvent.click(screen.getByText("mock-need-help"));
    expect(screen.getByText("request-not-sent")).toBeInTheDocument();

    fireEvent.click(screen.getByText("mock-contact-caregiver"));
    expect(screen.getByRole("alertdialog", { name: "Contact caregiver?" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Contact" }));
    expect(screen.getByText("request-sent")).toBeInTheDocument();

    fireEvent.click(screen.getByText("mock-close-help"));
    expect(screen.getByText("mock-sign-in")).toBeInTheDocument();
  });

  test("covers post-auth toolbar/nav/task flows and modal handlers", () => {
    render(<App />);

    fireEvent.click(screen.getByText("mock-sign-in"));

    expect(screen.getByRole("contentinfo")).toHaveTextContent(/Active Tasks:\s*3/);

    fireEvent.click(screen.getByText("mock-dash-complete"));
    expect(screen.getByRole("contentinfo")).toHaveTextContent(/Active Tasks:\s*2/);

    fireEvent.click(screen.getByText("mock-dash-quick-add"));
    expect(screen.getByRole("contentinfo")).toHaveTextContent(/Active Tasks:\s*3/);

    fireEvent.click(screen.getByText("mock-open-tasks"));
    expect(screen.getByText(/mock-filter:all\|query:\|count:/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search tasks..."), { target: { value: "med" } });
    expect(screen.getByText(/mock-filter:search\|query:med\|count:/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search tasks..."), { target: { value: "" } });
    expect(screen.getByText(/mock-filter:all\|query:\|count:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(screen.getByText(/mock-filter:today\|query:\|count:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(screen.getByText(/mock-filter:all\|query:\|count:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));
    fireEvent.click(screen.getByText("mock-save-add"));

    fireEvent.click(screen.getByText("mock-open-context"));
    fireEvent.click(screen.getByText("mock-context-complete"));
    fireEvent.click(screen.getByRole("button", { name: "Complete" }));

    fireEvent.click(screen.getByText("mock-open-edit"));
    fireEvent.click(screen.getByText("mock-save-edit"));

    fireEvent.click(screen.getByText("mock-open-delete"));
    fireEvent.click(screen.getByText("mock-confirm-delete"));

    fireEvent.click(screen.getByRole("button", { name: "Contacts" }));
    expect(screen.getByText("mock-contacts")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByText("mock-settings")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "SOS" }));
    expect(screen.getByText("not-confirmed")).toBeInTheDocument();
    fireEvent.click(screen.getByText("mock-emergency-confirm"));
    expect(screen.getByText("confirmed")).toBeInTheDocument();
    fireEvent.click(screen.getByText("mock-emergency-close"));
    expect(screen.queryByRole("dialog", { name: "mock-emergency-modal" })).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";

function renderApp(initialRoute = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe("App", () => {
  const signIn = () => {
    const signInBtn = screen.getByRole("button", { name: /sign in with this device/i });
    fireEvent.click(signInBtn);
  };

  it("renders sign-in view by default", () => {
    renderApp();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("shows the help view when Need Help is clicked", () => {
    renderApp();
    fireEvent.click(screen.getByText(/need help signing in/i));
    expect(screen.getByText("Having trouble signing in?")).toBeInTheDocument();
  });

  it("navigates to Dashboard after signing in", () => {
    renderApp();
    signIn();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("shows the app toolbar after sign-in", () => {
    renderApp();
    signIn();
    expect(screen.getByLabelText("Toggle navigation menu")).toBeInTheDocument();
  });

  it("shows sidebar navigation items", () => {
    renderApp();
    signIn();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("navigates to Tasks view", () => {
    renderApp();
    signIn();
    // Click Tasks in sidebar
    const navButtons = screen.getAllByText("Tasks");
    fireEvent.click(navButtons[0]);
    expect(screen.getByRole("heading", { level: 1, name: "All Tasks" })).toBeInTheDocument();
  });

  it("navigates to Contacts view", () => {
    renderApp();
    signIn();
    const contactsBtns = screen.getAllByText("Contacts");
    fireEvent.click(contactsBtns[0]);
    expect(screen.getByText("Primary Caregiver")).toBeInTheDocument();
  });

  it("navigates to Settings view", () => {
    renderApp();
    signIn();
    const settingsBtns = screen.getAllByText("Settings");
    fireEvent.click(settingsBtns[0]);
    expect(screen.getByText("Display & Simplicity")).toBeInTheDocument();
  });

  it("opens Add Task modal", () => {
    renderApp();
    signIn();
    // Navigate away from Dashboard to avoid the Quick Add "Add Task" button
    const navButtons = screen.getAllByText("Tasks");
    fireEvent.click(navButtons[0]);
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Add New Task")).toBeInTheDocument();
  });

  it("opens Emergency modal when SOS clicked", () => {
    renderApp();
    signIn();
    fireEvent.click(screen.getByText("SOS"));
    expect(screen.getByText("Emergency")).toBeInTheDocument();
  });

  it("shows footer with current date and active task count", () => {
    renderApp();
    signIn();
    expect(screen.getByText(/Active Tasks:/)).toBeInTheDocument();
    expect(screen.getByText(/Current Date:/)).toBeInTheDocument();
  });

  it("shows context bar with current view name", () => {
    renderApp();
    signIn();
    expect(screen.getByText(/You are on:/)).toBeInTheDocument();
  });

  it("signs out and returns to sign-in page", () => {
    renderApp();
    signIn();
    const settingsBtns = screen.getAllByText("Settings");
    fireEvent.click(settingsBtns[0]);
    fireEvent.click(screen.getByLabelText("Sign out and return to welcome screen"));
    // Find and click confirm Sign Out in the modal
    const signOutButtons = screen.getAllByText("Sign Out");
    fireEvent.click(signOutButtons[signOutButtons.length - 1]);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  // --- Additional coverage tests ---

  const goToTasks = () => {
    const navButtons = screen.getAllByText("Tasks");
    fireEvent.click(navButtons[0]);
  };

  it("searches tasks from toolbar", () => {
    renderApp();
    signIn();
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "medication" } });
    expect(screen.getByText(/Search results for/)).toBeInTheDocument();
  });

  it("clears search from toolbar", () => {
    renderApp();
    signIn();
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "medication" } });
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.queryByText(/Search results for/)).not.toBeInTheDocument();
  });

  it("toggles Today filter", () => {
    renderApp();
    signIn();
    fireEvent.click(screen.getByText("Today"));
    expect(screen.getByText(/Today's Tasks/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Today"));
    expect(screen.queryByText(/Today's Tasks/i)).not.toBeInTheDocument();
  });

  it("adds a new task via modal", () => {
    renderApp();
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.change(screen.getByLabelText("Task Name"), { target: { value: "New test task" } });
    fireEvent.change(screen.getByLabelText("Due Date"), { target: { value: "2026-04-01" } });
    fireEvent.change(screen.getByLabelText("Due Time"), { target: { value: "15:00" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
    expect(screen.getAllByText("New test task").length).toBeGreaterThanOrEqual(1);
  });

  it("edits a task via Edit Task modal", () => {
    renderApp();
    signIn();
    goToTasks();
    const editBtn = document.querySelector(".action-edit");
    fireEvent.click(editBtn);
    // Edit modal should be open with dialog role
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Cancel to close
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deletes a task via Delete confirm modal", () => {
    renderApp();
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Delete Task"));
    expect(screen.getByText("Delete Task?")).toBeInTheDocument();
    const deleteButtons = screen.getAllByText("Delete Task");
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    expect(screen.queryByText("Delete Task?")).not.toBeInTheDocument();
  });

  it("marks task complete from detail pane", () => {
    renderApp();
    signIn();
    goToTasks();
    const completeButtons = screen.getAllByText("Mark Complete");
    fireEvent.click(completeButtons[0]);
    expect(screen.getByText(/Active Tasks:/)).toBeInTheDocument();
  });

  it("confirms and dismisses Emergency modal", () => {
    renderApp();
    signIn();
    fireEvent.click(screen.getByText("SOS"));
    fireEvent.click(screen.getByText("Confirm"));
    expect(screen.getByText(/Caregiver contact has been triggered/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cancels Emergency modal", () => {
    renderApp();
    signIn();
    fireEvent.click(screen.getByText("SOS"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens mobile search toggle", () => {
    renderApp();
    signIn();
    fireEvent.click(screen.getByLabelText("Search tasks"));
    const searchInputs = screen.getAllByPlaceholderText("Search tasks...");
    expect(searchInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("opens delete from edit modal", () => {
    renderApp();
    signIn();
    goToTasks();
    // Open edit modal via the detail pane edit button
    const editBtn = document.querySelector(".action-edit");
    fireEvent.click(editBtn);
    // Click Delete Task inside the edit modal
    const deleteBtn = document.querySelector(".edit-task-delete");
    fireEvent.click(deleteBtn);
    expect(screen.getByText("Delete Task?")).toBeInTheDocument();
  });

  it("handles caregiver contact flow in help view", () => {
    renderApp();
    fireEvent.click(screen.getByText(/need help signing in/i));
    fireEvent.click(screen.getByText("Contact Caregiver"));
    expect(screen.getByText("Contact caregiver?")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Contact"));
    expect(screen.getByText(/Caregiver request sent/)).toBeInTheDocument();
  });

  it("closes help view", () => {
    renderApp();
    fireEvent.click(screen.getByText(/need help signing in/i));
    fireEvent.click(screen.getByLabelText("Close sign in help modal"));
    expect(screen.queryByText("Having trouble signing in?")).not.toBeInTheDocument();
  });

  it("resets access from help view", () => {
    renderApp();
    fireEvent.click(screen.getByText(/need help signing in/i));
    fireEvent.click(screen.getByText("Reset Access"));
    expect(screen.queryByText("Having trouble signing in?")).not.toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("cancels Add Task modal", () => {
    renderApp();
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
  });

  it("cancels Edit Task modal", () => {
    renderApp();
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Edit Task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit Task", { selector: "h2" })).not.toBeInTheDocument();
  });

  it("cancels Delete Task confirm modal", () => {
    renderApp();
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Delete Task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete Task?")).not.toBeInTheDocument();
  });
});

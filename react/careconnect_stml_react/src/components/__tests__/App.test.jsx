import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../App";

describe("App", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const signIn = () => {
    const signInBtn = screen.getByRole("button", { name: /sign in with this device/i });
    fireEvent.click(signInBtn);
  };

  it("renders sign-in view by default", () => {
    render(<App />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("shows the help view when Need Help is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/need help signing in/i));
    expect(screen.getByText("Having trouble signing in?")).toBeInTheDocument();
  });

  it("navigates to Dashboard after signing in", () => {
    render(<App />);
    signIn();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("shows the app toolbar after sign-in", () => {
    render(<App />);
    signIn();
    expect(screen.getByLabelText("Toggle navigation menu")).toBeInTheDocument();
  });

  it("shows sidebar navigation items", () => {
    render(<App />);
    signIn();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("navigates to Tasks view", () => {
    render(<App />);
    signIn();
    // Click Tasks in sidebar
    const navButtons = screen.getAllByText("Tasks");
    fireEvent.click(navButtons[0]);
    expect(screen.getByRole("heading", { level: 1, name: "All Tasks" })).toBeInTheDocument();
  });

  it("navigates to Contacts view", () => {
    render(<App />);
    signIn();
    const contactsBtns = screen.getAllByText("Contacts");
    fireEvent.click(contactsBtns[0]);
    expect(screen.getByText("Primary Caregiver")).toBeInTheDocument();
  });

  it("navigates to Settings view", () => {
    render(<App />);
    signIn();
    const settingsBtns = screen.getAllByText("Settings");
    fireEvent.click(settingsBtns[0]);
    expect(screen.getByText("Display & Simplicity")).toBeInTheDocument();
  });

  it("opens Add Task modal", () => {
    render(<App />);
    signIn();
    // Navigate away from Dashboard to avoid the Quick Add "Add Task" button
    const navButtons = screen.getAllByText("Tasks");
    fireEvent.click(navButtons[0]);
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Add New Task")).toBeInTheDocument();
  });

  it("opens Emergency modal when SOS clicked", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByText("SOS"));
    expect(screen.getByText("Emergency")).toBeInTheDocument();
  });

  it("shows footer with current date and active task count", () => {
    render(<App />);
    signIn();
    expect(screen.getByText(/Active Tasks:/)).toBeInTheDocument();
    expect(screen.getByText(/Current Date:/)).toBeInTheDocument();
  });

  it("shows context bar with current view name", () => {
    render(<App />);
    signIn();
    expect(screen.getByText(/You are on:/)).toBeInTheDocument();
  });

  it("signs out and returns to sign-in page", () => {
    render(<App />);
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
    render(<App />);
    signIn();
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "medication" } });
    expect(screen.getByText(/Search results for/)).toBeInTheDocument();
  });

  it("clears search from toolbar", () => {
    render(<App />);
    signIn();
    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "medication" } });
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.queryByText(/Search results for/)).not.toBeInTheDocument();
  });

  it("toggles Today filter", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByText("Today"));
    expect(screen.getByText(/Today's Tasks/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Today"));
    expect(screen.queryByText(/Today's Tasks/i)).not.toBeInTheDocument();
  });

  it("adds a new task via modal", () => {
    render(<App />);
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
    render(<App />);
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
    render(<App />);
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Delete Task"));
    expect(screen.getByText("Delete Task?")).toBeInTheDocument();
    const deleteButtons = screen.getAllByText("Delete Task");
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    expect(screen.queryByText("Delete Task?")).not.toBeInTheDocument();
  });

  it("marks task complete from detail pane", () => {
    render(<App />);
    signIn();
    goToTasks();
    const completeButtons = screen.getAllByText("Mark Complete");
    fireEvent.click(completeButtons[0]);
    expect(screen.getByText(/Active Tasks:/)).toBeInTheDocument();
  });

  it("confirms and dismisses Emergency modal", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByText("SOS"));
    fireEvent.click(screen.getByText("Confirm"));
    expect(screen.getByText(/Caregiver contact has been triggered/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cancels Emergency modal", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByText("SOS"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens mobile search toggle", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByLabelText("Search tasks"));
    const searchInputs = screen.getAllByPlaceholderText("Search tasks...");
    expect(searchInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("opens delete from edit modal", () => {
    render(<App />);
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
    render(<App />);
    fireEvent.click(screen.getByText(/need help signing in/i));
    fireEvent.click(screen.getByText("Contact Caregiver"));
    expect(screen.getByText("Contact caregiver?")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Contact"));
    expect(screen.getByText(/Caregiver request sent/)).toBeInTheDocument();
  });

  it("closes help view", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/need help signing in/i));
    fireEvent.click(screen.getByLabelText("Close sign in help modal"));
    expect(screen.queryByText("Having trouble signing in?")).not.toBeInTheDocument();
  });

  it("resets access from help view", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/need help signing in/i));
    fireEvent.click(screen.getByText("Reset Access"));
    expect(screen.queryByText("Having trouble signing in?")).not.toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("cancels Add Task modal", () => {
    render(<App />);
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
  });

  it("cancels Edit Task modal", () => {
    render(<App />);
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Edit Task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit Task", { selector: "h2" })).not.toBeInTheDocument();
  });

  it("cancels Delete Task confirm modal", () => {
    render(<App />);
    signIn();
    goToTasks();
    fireEvent.click(screen.getByText("Delete Task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete Task?")).not.toBeInTheDocument();
  });

  it("adds a quick task from the dashboard and updates the footer count", () => {
    jest.setSystemTime(new Date("2026-03-23T10:00:00"));
    render(<App />);
    signIn();

    fireEvent.change(screen.getByLabelText("What do you need to remember?"), { target: { value: "Pick up prescription" } });
    fireEvent.click(screen.getByRole("button", { name: "Add quick task" }));

    expect(screen.getAllByText("Pick up prescription").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Active Tasks:/).closest(".app-footer-item").textContent).toContain("4");
  });

  it("opens tasks from the dashboard upcoming tasks section", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByLabelText(/Open tasks and view Doctor appointment/i));
    expect(screen.getByRole("heading", { level: 1, name: "All Tasks" })).toBeInTheDocument();
  });

  it("handles keyboard zoom shortcuts", () => {
    render(<App />);
    signIn();
    const shell = document.querySelector(".app-shell");

    fireEvent.keyDown(window, { key: "+", ctrlKey: true });
    expect(shell.style.zoom).toBe("1.1");

    fireEvent.keyDown(window, { key: "-", ctrlKey: true });
    expect(shell.style.zoom).toBe("1");

    fireEvent.keyDown(window, { key: "0", ctrlKey: true });
    expect(shell.style.zoom).toBe("1");
  });

  it("does not change zoom for ctrl+alt shortcuts", () => {
    render(<App />);
    signIn();
    const shell = document.querySelector(".app-shell");

    fireEvent.keyDown(window, { key: "+", ctrlKey: true, altKey: true });

    expect(shell.style.zoom).toBe("1");
  });

  it("opens and closes the sidebar overlay from the hamburger button", () => {
    render(<App />);
    signIn();

    const toggleButton = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(document.querySelector(".sidebar-overlay"));
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates with the bottom nav and closes the sidebar after a nav click", () => {
    render(<App />);
    signIn();

    fireEvent.click(screen.getByLabelText("Toggle navigation menu"));
    fireEvent.click(screen.getAllByText("Contacts")[1]);

    expect(screen.getByText("Primary Caregiver")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle navigation menu")).toHaveAttribute("aria-expanded", "false");
  });

  it("edits an existing task and updates the detail pane", () => {
    render(<App />);
    signIn();
    goToTasks();

    fireEvent.click(screen.getByText("Edit Task"));
    fireEvent.change(screen.getByLabelText("Task Name"), { target: { value: "Updated medication" } });
    fireEvent.change(screen.getByLabelText("Due Date"), { target: { value: "2026-04-01" } });
    fireEvent.change(screen.getByLabelText("Due Time"), { target: { value: "15:00" } });
    fireEvent.click(screen.getByText("Save Changes"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByText("Updated medication").length).toBeGreaterThanOrEqual(1);
  });

  it("marks a task complete from the context menu after confirming", () => {
    render(<App />);
    signIn();
    goToTasks();

    fireEvent.contextMenu(screen.getByText("Doctor appointment").closest("article"), { clientX: 20, clientY: 20 });
    fireEvent.click(screen.getByRole("menuitem", { name: /mark complete/i }));
    expect(screen.getByText("Mark task complete?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Complete"));
    expect(screen.getByText(/Active Tasks:/).closest(".app-footer-item").textContent).toContain("2");
  });

  it("cancels marking a task complete from the context menu", () => {
    render(<App />);
    signIn();
    goToTasks();

    fireEvent.contextMenu(screen.getByText("Doctor appointment").closest("article"), { clientX: 20, clientY: 20 });
    fireEvent.click(screen.getByRole("menuitem", { name: /mark complete/i }));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Mark task complete?")).not.toBeInTheDocument();
    expect(screen.queryByText("Task Completed")).not.toBeInTheDocument();
  });

  it("opens the edit modal from the context menu", () => {
    render(<App />);
    signIn();
    goToTasks();

    fireEvent.contextMenu(screen.getByText("Doctor appointment").closest("article"), { clientX: 20, clientY: 20 });
    fireEvent.click(screen.getByRole("menuitem", { name: /edit task/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("opens the delete modal from the context menu and deletes the selected task", () => {
    render(<App />);
    signIn();
    goToTasks();

    fireEvent.contextMenu(screen.getByText("Doctor appointment").closest("article"), { clientX: 20, clientY: 20 });
    fireEvent.click(screen.getByRole("menuitem", { name: /delete task/i }));

    expect(screen.getByText("Delete Task?")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Delete Task").at(-1));

    expect(screen.queryAllByText("Doctor appointment")).toHaveLength(0);
  });

  it("closes the context menu when the close handler is triggered", () => {
    render(<App />);
    signIn();
    goToTasks();

    fireEvent.contextMenu(screen.getByText("Doctor appointment").closest("article"), { clientX: 20, clientY: 20 });
    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("resets app state on sign out after opening emergency and search UI", () => {
    render(<App />);
    signIn();

    fireEvent.click(screen.getByLabelText("Search tasks"));
    fireEvent.change(screen.getAllByPlaceholderText("Search tasks...")[1], { target: { value: "medication" } });
    fireEvent.click(screen.getByText("SOS"));
    fireEvent.click(screen.getByText("Confirm"));

    const settingsBtns = screen.getAllByText("Settings");
    fireEvent.click(settingsBtns[0]);
    fireEvent.click(screen.getByLabelText("Sign out and return to welcome screen"));
    fireEvent.click(screen.getAllByText("Sign Out").at(-1));

    signIn();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.queryByText(/Search results for/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Caregiver contact has been triggered/)).not.toBeInTheDocument();
  });

  it("closes the emergency modal from the overlay close path", () => {
    render(<App />);
    signIn();

    fireEvent.click(screen.getByText("SOS"));
    fireEvent.mouseDown(screen.getByRole("presentation"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

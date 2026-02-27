import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import "jest-axe/extend-expect";
import App from "../App";
import { AddTaskModal } from "../components/AddTaskModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ContextMenu } from "../components/ContextMenu";
import { EditTaskModal } from "../components/EditTaskModal";
import { SignInHelpView } from "../components/SignInHelpView";
import { SignInView } from "../components/SignInView";

describe("Automated accessibility checks", () => {
  test("SignInView has no obvious axe violations", async () => {
    const { container } = render(<SignInView onSignIn={() => undefined} onNeedHelp={() => undefined} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("SignInHelpView has no obvious axe violations", async () => {
    const { container } = render(
      <SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={() => undefined} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ConfirmDialog has no obvious axe violations", async () => {
    const { container } = render(
      <ConfirmDialog
        isOpen
        title="Contact caregiver?"
        message="This will send a caregiver contact request."
        confirmText="Contact"
        cancelText="Cancel"
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("AddTaskModal has no obvious axe violations", async () => {
    const { container } = render(
      <AddTaskModal isOpen onCancel={() => undefined} onSave={() => undefined} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("EditTaskModal has no obvious axe violations", async () => {
    const { container } = render(
      <EditTaskModal
        isOpen
        onCancel={() => undefined}
        onSave={() => undefined}
        onDelete={() => undefined}
        task={{ id: "task-1", title: "Take medication", dueDateTime: new Date("2026-03-01T09:00:00"), priority: "high" }}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ContextMenu has no obvious axe violations", async () => {
    const { container } = render(
      <ContextMenu x={100} y={100} onEdit={() => undefined} onMarkComplete={() => undefined} onDelete={() => undefined} onClose={() => undefined} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("keyboard-only navigation works on SignInView controls", async () => {
    const user = userEvent.setup();
    render(<SignInView onSignIn={() => undefined} onNeedHelp={() => undefined} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /sign in with this device/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: /need help signing in\?/i })).toHaveFocus();
  });

  test("keyboard-only navigation works on SignInHelpView controls", async () => {
    const user = userEvent.setup();
    render(<SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={() => undefined} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /^close sign in help$/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /reset access and return to sign in/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /contact caregiver/i })).toHaveFocus();
  });

  test("App pre-sign-in flow remains keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(screen.getByRole("button", { name: /sign in with this device/i })).toHaveFocus();

    await user.tab();
    const helpLink = screen.getByRole("link", { name: /need help signing in\?/i });
    expect(helpLink).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: /having trouble signing in\?/i })).toBeInTheDocument();
  });

  test("AddTaskModal supports focus trap and Escape-to-close", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<AddTaskModal isOpen onCancel={onCancel} onSave={() => undefined} />);

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const saveButton = screen.getByRole("button", { name: /^save$/i });

    expect(titleInput).toHaveFocus();

    titleInput.focus();
    await user.tab({ shift: true });
    expect(saveButton).toHaveFocus();

    saveButton.focus();
    await user.tab();
    expect(titleInput).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("EditTaskModal applies required fields and supports Escape", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <EditTaskModal
        isOpen
        onCancel={onCancel}
        onSave={() => undefined}
        onDelete={() => undefined}
        task={{ id: "task-2", title: "Doctor appointment", dueDateTime: new Date("2026-03-01T14:00:00"), priority: "medium" }}
      />
    );

    const titleInput = screen.getByDisplayValue("Doctor appointment");
    expect(titleInput).toHaveAttribute("required");
    expect(screen.getByDisplayValue("14:00")).toHaveAttribute("required");

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("ContextMenu supports arrow key navigation and Escape close", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<ContextMenu x={120} y={80} onEdit={() => undefined} onMarkComplete={() => undefined} onDelete={() => undefined} onClose={onClose} />);

    const editItem = screen.getByRole("menuitem", { name: /edit task/i });
    const markItem = screen.getByRole("menuitem", { name: /mark complete/i });
    const deleteItem = screen.getByRole("menuitem", { name: /delete task/i });

    expect(editItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(markItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(editItem).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

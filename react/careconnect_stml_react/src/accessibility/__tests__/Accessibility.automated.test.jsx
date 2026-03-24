import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import App from "../../App";
import { AddTaskModal } from "../../components/AddTaskModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ContextMenu } from "../../components/ContextMenu";
import { EditTaskModal } from "../../components/EditTaskModal";
import SettingsView from "../../components/SettingsView";
import { SignInHelpView } from "../../components/SignInHelpView";
import { SignInView } from "../../components/SignInView";
import { colors, sizing } from "../../constants/accessibility";

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const value = Number.parseInt(fullHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(foreground, background) {
  const lighter = Math.max(getRelativeLuminance(foreground), getRelativeLuminance(background));
  const darker = Math.min(getRelativeLuminance(foreground), getRelativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Automated accessibility checks", () => {
  const exampleTask = {
    id: "task-1",
    title: "Take medication",
    description: "Take with food and water.",
    dueDateTime: new Date("2026-03-23T09:00:00"),
    priority: "high",
  };

  test("SignInView has no obvious axe violations", async () => {
    const { container } = render(<SignInView onSignIn={() => undefined} onNeedHelp={() => undefined} />);
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  test("SignInHelpView has no obvious axe violations", async () => {
    const { container } = render(
      <SignInHelpView
        onResetAccess={() => undefined}
        onClose={() => undefined}
        onContactCaregiver={() => undefined}
      />
    );

    await expect(axe(container)).resolves.toHaveNoViolations();
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

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  test("AddTaskModal has no obvious axe violations", async () => {
    const { container } = render(<AddTaskModal isOpen onCancel={() => undefined} onSave={() => undefined} />);
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  test("EditTaskModal has no obvious axe violations", async () => {
    const { container } = render(
      <EditTaskModal
        isOpen
        onCancel={() => undefined}
        onSave={() => undefined}
        onDelete={() => undefined}
        task={exampleTask}
      />
    );

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  test("ContextMenu has no obvious axe violations", async () => {
    const { container } = render(
      <ContextMenu
        x={120}
        y={90}
        onEdit={() => undefined}
        onMarkComplete={() => undefined}
        onDelete={() => undefined}
        onClose={() => undefined}
      />
    );

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  test("SettingsView has no obvious axe violations", async () => {
    const { container } = render(<SettingsView onSignOut={() => undefined} />);
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  test("pre-sign-in app flow remains keyboard accessible", async () => {
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

  test("sign-in help dialog supports keyboard-only navigation", async () => {
    const user = userEvent.setup();
    render(
      <SignInHelpView
        onResetAccess={() => undefined}
        onClose={() => undefined}
        onContactCaregiver={() => undefined}
      />
    );

    await user.tab();
    expect(screen.getByRole("button", { name: /^close sign in help$/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /reset access and return to sign in/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /contact caregiver/i })).toHaveFocus();
  });

  test("add task modal keeps keyboard users inside the dialog and supports escape", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<AddTaskModal isOpen onCancel={onCancel} onSave={() => undefined} />);

    const titleInput = screen.getByLabelText(/task name/i);
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

  test("edit task modal keeps required task data keyboard accessible", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <EditTaskModal
        isOpen
        onCancel={onCancel}
        onSave={() => undefined}
        onDelete={() => undefined}
        task={exampleTask}
      />
    );

    const titleInput = await screen.findByDisplayValue("Take medication");
    expect(titleInput).toHaveAttribute("required");
    expect(screen.getByDisplayValue("09:00")).toHaveAttribute("required");

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("context menu supports arrow keys, home/end, and escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ContextMenu
        x={120}
        y={90}
        onEdit={() => undefined}
        onMarkComplete={() => undefined}
        onDelete={() => undefined}
        onClose={onClose}
      />
    );

    const editItem = screen.getByRole("menuitem", { name: /edit task/i });
    const markItem = screen.getByRole("menuitem", { name: /mark complete/i });
    const deleteItem = screen.getByRole("menuitem", { name: /delete task/i });

    expect(editItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(markItem).toHaveFocus();

    await user.keyboard("{End}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{Home}");
    expect(editItem).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("settings view exposes accessible text-size radio controls and switches", async () => {
    const user = userEvent.setup();
    render(<SettingsView onSignOut={() => undefined} />);

    const textSizeGroup = screen.getByRole("radiogroup", { name: /text size options/i });
    expect(within(textSizeGroup).getByRole("radio", { name: /medium/i })).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByRole("switch", { name: /high contrast mode/i }));
    expect(screen.getByRole("switch", { name: /high contrast mode/i })).toHaveAttribute("aria-checked", "true");
  });
});

describe("WCAG 2.1 STML accessibility guardrails", () => {
  test("touch targets meet the minimum WCAG 2.1 target size baseline", () => {
    expect(sizing.minTouchTarget).toBeGreaterThanOrEqual(44);
    expect(sizing.buttonHeightMin).toBeGreaterThanOrEqual(44);
    expect(sizing.inputHeight).toBeGreaterThanOrEqual(44);
  });

  test("large primary actions use STML-friendly touch targets", () => {
    expect(sizing.touchTargetStml).toBeGreaterThanOrEqual(56);
    expect(sizing.buttonHeightLarge).toBeGreaterThanOrEqual(56);
  });

  test("core text and action colors meet at least WCAG AA contrast on light surfaces", () => {
    expect(getContrastRatio(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(colors.textSecondary, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(colors.primary, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(colors.success, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(colors.danger, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  test("focus indicators maintain strong non-text contrast against the background", () => {
    expect(getContrastRatio(colors.focus, colors.background)).toBeGreaterThanOrEqual(3);
  });
});


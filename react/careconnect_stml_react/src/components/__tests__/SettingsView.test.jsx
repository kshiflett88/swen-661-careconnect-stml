import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SettingsView from "../SettingsView";

describe("SettingsView", () => {
  const defaultProps = {
    onSignOut: vi.fn(),
  };

  it("renders Settings heading", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Adjust settings to make CareConnect work best for you")).toBeInTheDocument();
  });

  it("renders Display & Simplicity section", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Display & Simplicity")).toBeInTheDocument();
  });

  it("renders text size options", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("renders High Contrast Mode toggle", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("High Contrast Mode")).toBeInTheDocument();
  });

  it("renders Simplified Layout Mode toggle", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Simplified Layout Mode")).toBeInTheDocument();
  });

  it("renders Reminder Support section", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Reminder Support")).toBeInTheDocument();
  });

  it("renders Support section with caregiver info", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Sarah Miller")).toBeInTheDocument();
    expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("renders Account section with Sign Out", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Sign out and return to welcome screen")).toBeInTheDocument();
  });

  it("changes text size when button is clicked", () => {
    render(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByText("Large"));
    const largeBtn = screen.getByText("Large");
    expect(largeBtn).toHaveAttribute("aria-checked", "true");
  });

  it("toggles high contrast mode", () => {
    render(<SettingsView {...defaultProps} />);
    const toggle = screen.getByRole("switch", { name: "High Contrast Mode" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("shows edit fields when Edit caregiver button is clicked", () => {
    render(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
  });

  it("shows sign out confirmation modal", () => {
    render(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Sign out and return to welcome screen"));
    expect(screen.getByText("Are you sure you want to sign out?")).toBeInTheDocument();
  });

  it("calls onSignOut after confirming sign out", () => {
    const onSignOut = vi.fn();
    render(<SettingsView onSignOut={onSignOut} />);
    fireEvent.click(screen.getByLabelText("Sign out and return to welcome screen"));
    // Click the confirm button inside the modal
    const signOutConfirm = screen.getAllByText("Sign Out");
    fireEvent.click(signOutConfirm[signOutConfirm.length - 1]); // The modal confirm button
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("renders info box about settings autosave", () => {
    render(<SettingsView {...defaultProps} />);
    expect(screen.getByText(/Settings are saved automatically/)).toBeInTheDocument();
  });

  it("toggles simplified layout mode", () => {
    render(<SettingsView {...defaultProps} />);
    const toggle = screen.getByRole("switch", { name: "Simplified Layout Mode" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("shows reset defaults confirmation modal", () => {
    render(<SettingsView {...defaultProps} />);
    const resetButtons = screen.getAllByText("Reset to Defaults");
    fireEvent.click(resetButtons[resetButtons.length - 1]);
    expect(screen.getByText("This will reset all settings to their default values. Continue?")).toBeInTheDocument();
  });

  it("resets settings when confirming reset defaults", () => {
    render(<SettingsView {...defaultProps} />);
    // Change a setting first
    fireEvent.click(screen.getByText("Large"));
    expect(screen.getByText("Large")).toHaveAttribute("aria-checked", "true");
    // Open and confirm reset
    const resetButtons = screen.getAllByText("Reset to Defaults");
    fireEvent.click(resetButtons[resetButtons.length - 1]);
    const confirmButtons = screen.getAllByText("Reset to Defaults");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);
    // Medium should be active again
    expect(screen.getByText("Medium")).toHaveAttribute("aria-checked", "true");
  });

  it("cancels reset defaults modal", () => {
    render(<SettingsView {...defaultProps} />);
    const resetButtons = screen.getAllByText("Reset to Defaults");
    fireEvent.click(resetButtons[resetButtons.length - 1]);
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("This will reset all settings to their default values. Continue?")).not.toBeInTheDocument();
  });

  it("changes reminder frequency", () => {
    render(<SettingsView {...defaultProps} />);
    const select = screen.getByLabelText("Reminder Frequency");
    fireEvent.change(select, { target: { value: "until-completed" } });
    expect(select).toHaveValue("until-completed");
  });

  it("changes default reminder time", () => {
    render(<SettingsView {...defaultProps} />);
    const select = screen.getByLabelText("Default Reminder Time");
    fireEvent.change(select, { target: { value: "14:00" } });
    expect(select).toHaveValue("14:00");
  });

  it("toggles confirm complete setting", () => {
    render(<SettingsView {...defaultProps} />);
    const toggle = screen.getByRole("switch", { name: "Show Confirmation After Completing Task" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("saves caregiver edits", () => {
    render(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("cancels sign out modal", () => {
    render(<SettingsView {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Sign out and return to welcome screen"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Are you sure you want to sign out?")).not.toBeInTheDocument();
  });
});

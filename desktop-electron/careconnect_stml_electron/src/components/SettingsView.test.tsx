// src/screens/__tests__/SettingsPage.test.tsx
import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SettingsPage from "../SettingsPage";

describe("SettingsPage", () => {
  test("renders main landmarks and does not show toast initially", () => {
    render(<SettingsPage />);

    // Skip link
    expect(screen.getByRole("link", { name: /skip to main content/i })).toBeInTheDocument();

    // Toolbar region exists
    expect(screen.getByRole("region", { name: /toolbar/i })).toBeInTheDocument();

    // Main content basics
    expect(screen.getByRole("heading", { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByText(/adjust settings to make careconnect work best for you/i)).toBeInTheDocument();

    // Toast is rendered only when text exists (aria-live sr-only always exists, visible status should not)
    expect(screen.queryByText(/Status:/i)).not.toBeInTheDocument();
  });

  test("renders WCAG semantics for switches and radio group", () => {
    render(<SettingsPage />);

    // Switches
    const contrastSwitch = screen.getByRole("switch", { name: /high contrast mode/i });
    expect(contrastSwitch).toHaveAttribute("aria-checked", "true"); // initial is true

    const layoutSwitch = screen.getByRole("switch", { name: /simplified layout mode/i });
    expect(layoutSwitch).toHaveAttribute("aria-checked", "false"); // initial is false

    const confirmSwitch = screen.getByRole("switch", { name: /show confirmation after completing task/i });
    expect(confirmSwitch).toHaveAttribute("aria-checked", "true"); // initial is true

    // Radio group semantics
    expect(screen.getByRole("radiogroup", { name: /text size options/i })).toBeInTheDocument();

    // Radio buttons exist
    expect(screen.getByRole("radio", { name: /small/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /medium/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /large/i })).toBeInTheDocument();
  });

  test("handles SOS click and keyboard shortcut (Ctrl+E / Cmd+E) and Escape clears toast", () => {
    render(<SettingsPage />);

    // Click SOS button
    fireEvent.click(screen.getByRole("button", { name: /emergency sos/i }));
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/SOS sent to caregiver/i)).toBeInTheDocument();

    // Escape clears toast
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText(/SOS sent to caregiver/i)).not.toBeInTheDocument();

    // Ctrl+E triggers SOS (Windows)
    fireEvent.keyDown(window, { key: "e", ctrlKey: true });
    expect(screen.getByText(/SOS sent to caregiver/i)).toBeInTheDocument();

    // Escape clears again
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText(/SOS sent to caregiver/i)).not.toBeInTheDocument();
  });

  test("updates text size and shows autosave toast", () => {
    render(<SettingsPage />);

    // Click Large
    fireEvent.click(screen.getByRole("radio", { name: /large/i }));
    expect(screen.getByText(/Text size updated\. Settings saved automatically\./i)).toBeInTheDocument();
  });

  test("toggles switches and shows autosave toast", () => {
    render(<SettingsPage />);

    // High contrast starts true -> toggle off
    const contrastSwitch = screen.getByRole("switch", { name: /high contrast mode/i });
    fireEvent.click(contrastSwitch);
    expect(screen.getByText(/Contrast updated\. Settings saved automatically\./i)).toBeInTheDocument();
    expect(contrastSwitch).toHaveAttribute("aria-checked", "false");

    // Simplified layout starts false -> toggle on
    const layoutSwitch = screen.getByRole("switch", { name: /simplified layout mode/i });
    fireEvent.click(layoutSwitch);
    expect(screen.getByText(/Layout mode updated\. Settings saved automatically\./i)).toBeInTheDocument();
    expect(layoutSwitch).toHaveAttribute("aria-checked", "true");
  });

  test("changes selects and shows autosave toast", () => {
    render(<SettingsPage />);

    // Reminder frequency
    fireEvent.change(screen.getByLabelText(/reminder frequency/i), { target: { value: "once" } });
    expect(screen.getByText(/Reminder frequency updated\. Settings saved automatically\./i)).toBeInTheDocument();

    // Default reminder time
    fireEvent.change(screen.getByLabelText(/default reminder time/i), { target: { value: "10:00" } });
    expect(screen.getByText(/Default reminder time updated\. Settings saved automatically\./i)).toBeInTheDocument();
  });

  test("reset filters clears search input and shows toast", () => {
    render(<SettingsPage />);

    const search = screen.getByRole("searchbox", { name: /search tasks/i });
    expect(search).toHaveValue("medication");

    fireEvent.click(screen.getByRole("button", { name: /reset all filters/i }));
    expect(search).toHaveValue("");
    expect(screen.getByText(/Task filters cleared/i)).toBeInTheDocument();
  });

  test("restore defaults resets values and shows toast", () => {
    render(<SettingsPage />);

    // Make changes first
    fireEvent.click(screen.getByRole("radio", { name: /large/i }));
    fireEvent.click(screen.getByRole("switch", { name: /high contrast mode/i })); // true -> false
    fireEvent.click(screen.getByRole("switch", { name: /simplified layout mode/i })); // false -> true
    fireEvent.change(screen.getByLabelText(/reminder frequency/i), { target: { value: "once" } });
    fireEvent.change(screen.getByLabelText(/default reminder time/i), { target: { value: "10:00" } });

    // Restore defaults
    fireEvent.click(screen.getByRole("button", { name: /restore default settings/i }));

    // Check restored defaults
    const contrastSwitch = screen.getByRole("switch", { name: /high contrast mode/i });
    const layoutSwitch = screen.getByRole("switch", { name: /simplified layout mode/i });
    const confirmSwitch = screen.getByRole("switch", { name: /show confirmation after completing task/i });

    expect(contrastSwitch).toHaveAttribute("aria-checked", "false");
    expect(layoutSwitch).toHaveAttribute("aria-checked", "false");
    expect(confirmSwitch).toHaveAttribute("aria-checked", "true");

    // Medium should be selected again
    expect(screen.getByRole("radio", { name: /medium/i })).toHaveAttribute("aria-checked", "true");

    // Select values back to defaults
    expect(screen.getByLabelText(/reminder frequency/i)).toHaveValue("twice");
    expect(screen.getByLabelText(/default reminder time/i)).toHaveValue("09:00");

    expect(screen.getByText(/Defaults restored\. Settings saved automatically\./i)).toBeInTheDocument();
  });
});
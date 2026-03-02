// src/screens/__tests__/EmergencyScreen.test.tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import EmergencyScreen from "../EmergencyScreen";

// ✅ Mock ScreenShell so the test focuses on EmergencyScreen behavior/layout
vi.mock("../_ScreenShell", () => {
  return {
    default: ({ title, description, children }: any) => (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div data-testid="shell-children">{children}</div>
      </div>
    ),
  };
});

// ✅ Mock EmergencyModal so we can assert “open” state + trigger confirm/cancel
vi.mock("../../components/EmergencyModal", () => {
  return {
    EmergencyModal: (props: any) => {
      if (!props.isOpen) return null;

      return (
        <div role="dialog" aria-label={props.title}>
          <p>{props.message}</p>
          {props.ariaHint ? <p>{props.ariaHint}</p> : null}

          <button onClick={props.onConfirm}>{props.confirmText}</button>
          <button onClick={props.onCancel}>{props.cancelText}</button>
          <button onClick={props.onClose}>Close</button>
        </div>
      );
    },
  };
});

describe("EmergencyScreen", () => {
  const onGo = vi.fn();

  beforeEach(() => {
    onGo.mockReset();
  });

  it("renders the main emergency UI content", () => {
    render(<EmergencyScreen onGo={onGo as any} />);

    // Header + number
    expect(screen.getByText("Emergency Services")).toBeInTheDocument();
    expect(screen.getByText("For immediate medical help")).toBeInTheDocument();
    expect(screen.getByText("Emergency Number")).toBeInTheDocument();
    expect(screen.getByText("911")).toBeInTheDocument();

    // CTA button is present
    expect(screen.getByRole("button", { name: /call emergency services/i })).toBeInTheDocument();

    // Region label exists for accessibility
    expect(screen.getByRole("region", { name: /emergency services panel/i })).toBeInTheDocument();
  });

  it("opens the confirmation modal when CTA is clicked", () => {
    render(<EmergencyScreen onGo={onGo as any} />);

    fireEvent.click(screen.getByRole("button", { name: /call emergency services/i }));

    // Modal appears (mocked)
    expect(screen.getByRole("dialog", { name: "Emergency Assistance" })).toBeInTheDocument();
    expect(screen.getByText("If you need help right now, press the button below.")).toBeInTheDocument();
    expect(screen.getByText(/This will contact your caregiver, Sarah Miller/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CONTACT CAREGIVER NOW" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("closes the modal when Cancel is clicked", () => {
    render(<EmergencyScreen onGo={onGo as any} />);

    fireEvent.click(screen.getByRole("button", { name: /call emergency services/i }));
    expect(screen.getByRole("dialog", { name: "Emergency Assistance" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    // Modal should be gone
    expect(screen.queryByRole("dialog", { name: "Emergency Assistance" })).not.toBeInTheDocument();

    // Should NOT navigate on cancel
    expect(onGo).not.toHaveBeenCalled();
  });

  it("navigates to emergency-confirmation when Confirm is clicked", () => {
    render(<EmergencyScreen onGo={onGo as any} />);

    fireEvent.click(screen.getByRole("button", { name: /call emergency services/i }));
    fireEvent.click(screen.getByRole("button", { name: "CONTACT CAREGIVER NOW" }));

    // onGo should be called with your ScreenId string
    expect(onGo).toHaveBeenCalledTimes(1);
    expect(onGo).toHaveBeenCalledWith("emergency-confirmation");
  });

  it("modal closes when Close is clicked (overlay close behavior simulated)", () => {
    render(<EmergencyScreen onGo={onGo as any} />);

    fireEvent.click(screen.getByRole("button", { name: /call emergency services/i }));
    expect(screen.getByRole("dialog", { name: "Emergency Assistance" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: "Emergency Assistance" })).not.toBeInTheDocument();
  });

  it("has the CTA described by emergencyHelp text (aria-describedby)", () => {
    render(<EmergencyScreen onGo={onGo as any} />);

    const btn = screen.getByRole("button", { name: /call emergency services/i });
    expect(btn).toHaveAttribute("aria-describedby", "emergencyHelp");
    expect(screen.getByText(/Use this for medical emergencies/i)).toBeInTheDocument();
  });
});
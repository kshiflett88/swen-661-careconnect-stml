// src/components/__tests__/EmergencyModal.test.tsx
import { describe, expect, test, jest} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EmergencyModal } from "../EmergencyModal";

describe("EmergencyModal", () => {
  test("does not render when closed", () => {
    render(
      <EmergencyModal
        isOpen={false}
        title="Emergency Assistance"
        message="If you need help right now, press the button below."
        confirmText="CONTACT CAREGIVER NOW"
        cancelText="Cancel"
        onConfirm={() => undefined}
        onCancel={() => undefined}
        onClose={() => undefined}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders WCAG semantics and action labels when open", () => {
    render(
      <EmergencyModal
        isOpen
        title="Emergency Assistance"
        message="If you need help right now, press the button below."
        confirmText="CONTACT CAREGIVER NOW"
        cancelText="Cancel"
        ariaHint="This will contact your caregiver, Sarah Miller."
        onConfirm={() => undefined}
        onCancel={() => undefined}
        onClose={() => undefined}
      />
    );

    const dialog = screen.getByRole("dialog", { name: /emergency assistance/i });
    expect(dialog).toHaveAttribute("aria-modal", "true");

    // heading + message + hint
    expect(screen.getByRole("heading", { name: /emergency assistance/i })).toBeInTheDocument();
    expect(screen.getByText(/press the button below/i)).toBeInTheDocument();
    expect(screen.getByText(/contact your caregiver, sarah miller/i)).toBeInTheDocument();

    // action buttons
    expect(screen.getByRole("button", { name: /contact caregiver now/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("handles confirm, cancel, outside click, and escape key", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const onClose = jest.fn();

    const { container } = render(
      <EmergencyModal
        isOpen
        title="Emergency Assistance"
        message="If you need help right now, press the button below."
        confirmText="CONTACT CAREGIVER NOW"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={onClose}
      />
    );

    // Confirm action
    fireEvent.click(screen.getByRole("button", { name: /contact caregiver now/i }));

    // Cancel action
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // Outside click (overlay closes onMouseDown when target === currentTarget)
    const overlay = container.querySelector('[role="presentation"]');
    expect(overlay).not.toBeNull();
    if (overlay) {
      fireEvent.mouseDown(overlay);
    }

    // Escape closes via document keydown listener
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
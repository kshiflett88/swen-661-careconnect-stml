import { fireEvent, render, screen } from "@testing-library/react";
import { ConfirmDialog } from "../components/ConfirmDialog";

describe("ConfirmDialog", () => {
  test("does not render when closed", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Confirm action"
        message="Are you sure?"
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("renders WCAG semantics and action labels when open", () => {
    render(
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

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("heading", { name: /contact caregiver\?/i })).toBeInTheDocument();
    expect(screen.getByText(/caregiver contact request/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contact/i })).toBeInTheDocument();
  });

  test("handles confirm, cancel, outside click, and escape key", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen
        title="Contact caregiver?"
        message="This will send a caregiver contact request."
        confirmText="Contact"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /contact/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    const overlay = container.querySelector('[role="presentation"]');
    expect(overlay).not.toBeNull();
    if (overlay) {
      fireEvent.click(overlay);
    }

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(3);
  });
});

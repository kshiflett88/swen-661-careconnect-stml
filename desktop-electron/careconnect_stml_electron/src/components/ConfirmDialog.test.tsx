import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  test("does not render when closed", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Confirm"
        message="Are you sure?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("renders content and handles confirm/cancel", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete item"
        message="This cannot be undone"
        confirmText="Delete"
        cancelText="Keep"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Delete item")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Keep and close dialog" }));
    await user.click(screen.getByRole("button", { name: "Delete this action" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("escape and outside click cancel", () => {
    const onCancel = jest.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        message="Proceed?"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(dialog.parentElement as HTMLElement);

    expect(onCancel).toHaveBeenCalledTimes(2);
  });
});

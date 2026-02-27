import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactActionModal } from "./ContactActionModal";

describe("ContactActionModal", () => {
  test("does not render when closed", () => {
    render(
      <ContactActionModal
        isOpen={false}
        title="Confirm Call"
        description="Do you want to place this call now?"
        confirmLabel="Call Now"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("renders content and calls confirm/cancel actions", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <ContactActionModal
        isOpen={true}
        title="Send Message"
        description="Do you want to open messaging for this contact?"
        contextText="Sarah Miller"
        confirmLabel="Send Message"
        icon="message"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Send Message" })).toBeInTheDocument();
    expect(screen.getByText("Sarah Miller")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("escape and overlay click cancel", () => {
    const onCancel = jest.fn();

    render(
      <ContactActionModal
        isOpen={true}
        title="Call Emergency Services"
        description="This will call 911 Emergency Services. Continue?"
        contextText="Emergency Number: 911"
        confirmLabel="Call 911"
        variant="danger"
        icon="alert"
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(dialog.parentElement as HTMLElement);

    expect(onCancel).toHaveBeenCalledTimes(2);
  });
});

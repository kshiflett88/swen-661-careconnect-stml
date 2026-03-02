import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactsView } from "./ContactsView";

describe("ContactsView", () => {
  test("renders key sections", () => {
    render(<ContactsView />);

    expect(screen.getByText("Primary Caregiver")).toBeInTheDocument();
    expect(screen.getByText("Emergency Services")).toBeInTheDocument();
    expect(screen.getByText("Family Contact")).toBeInTheDocument();
    expect(screen.getByText("Primary Doctor")).toBeInTheDocument();
  });

  test("opens call modal and confirm closes it without browser alert", async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

    render(<ContactsView />);

    await user.click(screen.getByRole("button", { name: "Call Doctor's Office" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm Call")).toBeInTheDocument();
    expect(screen.getByText("Dr. Jennifer Park • (555) 345-6789")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Call Now" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  test("opens message modal and can cancel", async () => {
    const user = userEvent.setup();

    render(<ContactsView />);

    await user.click(screen.getAllByRole("button", { name: "Message" })[0]);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Send Message" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("opens emergency confirmation modal", async () => {
    const user = userEvent.setup();

    render(<ContactsView />);

    await user.click(screen.getByRole("button", { name: "Call Emergency Services" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Call Emergency Services" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Call 911" })).toBeInTheDocument();
  });
});

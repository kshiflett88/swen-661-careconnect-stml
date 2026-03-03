import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";

function signIn() {
  fireEvent.click(screen.getByRole("button", { name: /sign in with this device/i }));
}

describe("App post-auth integration", () => {
  test("adds a task from toolbar Add Task modal", () => {
    render(<App />);
    signIn();

    fireEvent.click(screen.getByRole("button", { name: /^add task$/i }));

    const dialog = screen.getByRole("dialog", { name: /add new task/i });

    fireEvent.change(within(dialog).getByLabelText("Task Name"), { target: { value: "Walk in the park" } });
    fireEvent.change(within(dialog).getByLabelText("Description"), { target: { value: "20 minute walk" } });
    fireEvent.change(within(dialog).getByLabelText("Due Date"), { target: { value: "2026-03-15" } });
    fireEvent.change(within(dialog).getByLabelText("Due Time"), { target: { value: "08:30" } });
    fireEvent.change(within(dialog).getByLabelText("Priority"), { target: { value: "high" } });

    fireEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));

    expect(screen.getByText("Walk in the park")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "All Tasks" })).toBeInTheDocument();
  });

  test("quick add from dashboard creates a medium-priority task", () => {
    render(<App />);
    signIn();

    expect(screen.getByRole("contentinfo")).toHaveTextContent(/Active Tasks:\s*3/i);

    fireEvent.change(screen.getByLabelText("What do you need to remember?"), {
      target: { value: "Call pharmacy" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add quick task/i }));

    expect(screen.getByRole("contentinfo")).toHaveTextContent(/Active Tasks:\s*4/i);

    fireEvent.click(screen.getByRole("button", { name: "Tasks" }));
    expect(screen.getByText("Call pharmacy")).toBeInTheDocument();
  });

  test("context-menu completion flow supports cancel then confirm", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByRole("button", { name: "Tasks" }));

    fireEvent.contextMenu(screen.getAllByText("Take morning medication")[0]);
    fireEvent.click(screen.getByRole("menuitem", { name: /mark complete/i }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /cancel and close dialog/i }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getAllByText("Take morning medication")[0]);
    fireEvent.click(screen.getByRole("menuitem", { name: /mark complete/i }));
    fireEvent.click(screen.getByRole("button", { name: /complete this action/i }));

    expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
    expect(screen.getByLabelText("Take morning medication - Completed")).toBeInTheDocument();
  });

  test("emergency modal confirm and close works", () => {
    render(<App />);
    signIn();

    fireEvent.click(screen.getByRole("button", { name: /^sos$/i }));
    expect(screen.getByText(/contact caregiver now\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));
    expect(screen.getByText(/caregiver contact has been triggered/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^close$/i }));
    expect(screen.queryByText(/contact caregiver now\?/i)).not.toBeInTheDocument();
  });

  test("delete task confirm removes task from list", () => {
    render(<App />);
    signIn();
    fireEvent.click(screen.getByRole("button", { name: "Tasks" }));

    fireEvent.click(screen.getByRole("button", { name: /^delete task$/i }));

    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /^delete task$/i }));

    expect(screen.queryByText("Take morning medication")).not.toBeInTheDocument();
  });
});

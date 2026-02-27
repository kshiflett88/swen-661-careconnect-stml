import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTaskModal } from "./AddTaskModal";

describe("AddTaskModal", () => {
  test("does not render when closed", () => {
    render(<AddTaskModal isOpen={false} onCancel={jest.fn()} onSave={jest.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("shows validation and blocks save when due date/time are missing", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<AddTaskModal isOpen={true} onCancel={jest.fn()} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: "Save Task" }));

    expect(screen.getByText("Please select a due date and time.")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test("submits entered values", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<AddTaskModal isOpen={true} onCancel={jest.fn()} onSave={onSave} />);

    await user.type(screen.getByLabelText("Task Name"), "  Refill prescription  ");
    await user.type(screen.getByLabelText("Description"), "  Pick up from pharmacy  ");
    await user.type(screen.getByLabelText("Due Date"), "2026-02-27");
    await user.type(screen.getByLabelText("Due Time"), "09:30");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");

    await user.click(screen.getByRole("button", { name: "Save Task" }));

    expect(onSave).toHaveBeenCalledWith({
      title: "Refill prescription",
      description: "Pick up from pharmacy",
      dueDate: "2026-02-27",
      dueTime: "09:30",
      priority: "high",
    });
  });

  test("cancels on escape and overlay click", () => {
    const onCancel = jest.fn();

    render(<AddTaskModal isOpen={true} onCancel={onCancel} onSave={jest.fn()} />);

    fireEvent.keyDown(document, { key: "Escape" });

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog.parentElement as HTMLElement);

    expect(onCancel).toHaveBeenCalledTimes(2);
  });
});

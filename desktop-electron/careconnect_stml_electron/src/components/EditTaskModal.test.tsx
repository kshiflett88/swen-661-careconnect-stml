import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "../App";
import { EditTaskModal } from "./EditTaskModal";

const task: Task = {
  id: "task-1",
  title: "Take medication",
  description: "Morning medication",
  dueDateTime: new Date(2026, 1, 26, 9, 15, 0),
  priority: "medium",
  status: "pending",
};

describe("EditTaskModal", () => {
  test("does not render when closed or task is missing", () => {
    const { rerender } = render(
      <EditTaskModal isOpen={false} task={task} onCancel={jest.fn()} onSave={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <EditTaskModal isOpen={true} task={null} onCancel={jest.fn()} onSave={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("pre-fills task values and saves updates", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<EditTaskModal isOpen={true} task={task} onCancel={jest.fn()} onSave={onSave} onDelete={jest.fn()} />);

    expect(screen.getByLabelText("Task Name")).toHaveValue("Take medication");
    expect(screen.getByLabelText("Description")).toHaveValue("Morning medication");
    expect(screen.getByLabelText("Due Date")).toHaveValue("2026-02-26");
    expect(screen.getByLabelText("Due Time")).toHaveValue("09:15");

    await user.clear(screen.getByLabelText("Task Name"));
    await user.type(screen.getByLabelText("Task Name"), "Updated medication");
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Updated notes");
    await user.clear(screen.getByLabelText("Due Date"));
    await user.type(screen.getByLabelText("Due Date"), "2026-03-01");
    await user.clear(screen.getByLabelText("Due Time"));
    await user.type(screen.getByLabelText("Due Time"), "10:45");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(onSave).toHaveBeenCalledWith("task-1", {
      title: "Updated medication",
      description: "Updated notes",
      dueDate: "2026-03-01",
      dueTime: "10:45",
      priority: "high",
    });
  });

  test("delete button and escape invoke callbacks", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    const onCancel = jest.fn();

    render(<EditTaskModal isOpen={true} task={task} onCancel={onCancel} onSave={jest.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete Task" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onDelete).toHaveBeenCalledWith("task-1");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

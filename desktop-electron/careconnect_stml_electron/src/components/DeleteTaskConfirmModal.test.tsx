import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "../types";
import { DeleteTaskConfirmModal } from "./DeleteTaskConfirmModal";

const task: Task = {
  id: "delete-1",
  title: "Refill prescription",
  description: "",
  priority: "high",
  completed: false,
  createdAt: "2026-02-26T10:00:00.000Z",
};

describe("DeleteTaskConfirmModal", () => {
  test("does not render when closed or task missing", () => {
    const { rerender } = render(
      <DeleteTaskConfirmModal isOpen={false} task={task} onCancel={jest.fn()} onConfirmDelete={jest.fn()} />
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    rerender(
      <DeleteTaskConfirmModal isOpen={true} task={null} onCancel={jest.fn()} onConfirmDelete={jest.fn()} />
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("renders and confirms delete", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onConfirmDelete = jest.fn();

    render(
      <DeleteTaskConfirmModal isOpen={true} task={task} onCancel={jest.fn()} onConfirmDelete={onConfirmDelete} />
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText('"Refill prescription"')).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Task" }));
    expect(onConfirmDelete).toHaveBeenCalledWith("delete-1");

    jest.useRealTimers();
  });

  test("cancel actions call onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <DeleteTaskConfirmModal isOpen={true} task={task} onCancel={onCancel} onConfirmDelete={jest.fn()} />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Close delete task confirmation" }));

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("alertdialog").parentElement as HTMLElement);

    expect(onCancel).toHaveBeenCalledTimes(4);
  });
});

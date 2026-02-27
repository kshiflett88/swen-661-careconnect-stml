import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";

describe("ContextMenu", () => {
  test("renders quick action menu items", () => {
    render(
      <ContextMenu
        x={120}
        y={240}
        onEdit={jest.fn()}
        onMarkComplete={jest.fn()}
        onDelete={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole("menu", { name: "Task quick actions" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Mark Complete" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
  });

  test("fires action callbacks", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onMarkComplete = jest.fn();
    const onDelete = jest.fn();

    render(
      <ContextMenu
        x={10}
        y={20}
        onEdit={onEdit}
        onMarkComplete={onMarkComplete}
        onDelete={onDelete}
        onClose={jest.fn()}
      />
    );

    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    await user.click(screen.getByRole("menuitem", { name: "Mark Complete" }));
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onMarkComplete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking outside, not when clicking inside", () => {
    const onClose = jest.fn();

    render(
      <>
        <div data-testid="outside-target">outside</div>
        <ContextMenu
          x={0}
          y={0}
          onEdit={jest.fn()}
          onMarkComplete={jest.fn()}
          onDelete={jest.fn()}
          onClose={onClose}
        />
      </>
    );

    fireEvent.mouseDown(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByTestId("outside-target"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("supports keyboard navigation and escape to close", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ContextMenu
        x={0}
        y={0}
        onEdit={jest.fn()}
        onMarkComplete={jest.fn()}
        onDelete={jest.fn()}
        onClose={onClose}
      />
    );

    const editItem = screen.getByRole("menuitem", { name: "Edit" });
    const markCompleteItem = screen.getByRole("menuitem", { name: "Mark Complete" });
    const deleteItem = screen.getByRole("menuitem", { name: "Delete" });

    expect(editItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(markCompleteItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(editItem).toHaveFocus();

    await user.keyboard("{End}");
    expect(deleteItem).toHaveFocus();

    await user.keyboard("{Home}");
    expect(editItem).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

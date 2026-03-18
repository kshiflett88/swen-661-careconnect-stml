import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu } from "../ContextMenu";

describe("ContextMenu", () => {
  const defaultProps = {
    x: 100,
    y: 200,
    onEdit: vi.fn(),
    onMarkComplete: vi.fn(),
    onDelete: vi.fn(),
    onClose: vi.fn(),
  };

  it("renders all three menu items", () => {
    render(<ContextMenu {...defaultProps} />);
    expect(screen.getByText("Edit task")).toBeInTheDocument();
    expect(screen.getByText("Mark Complete")).toBeInTheDocument();
    expect(screen.getByText("Delete task")).toBeInTheDocument();
  });

  it("positions at the given x and y", () => {
    render(<ContextMenu {...defaultProps} />);
    const menu = screen.getByRole("menu");
    expect(menu.style.left).toBe("100px");
    expect(menu.style.top).toBe("200px");
  });

  it("has correct aria-label", () => {
    render(<ContextMenu {...defaultProps} />);
    expect(screen.getByRole("menu")).toHaveAttribute("aria-label", "Task quick actions");
  });

  it("renders menu items with menuitem role", () => {
    render(<ContextMenu {...defaultProps} />);
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(3);
  });

  it("calls onEdit when Edit task is clicked", () => {
    const onEdit = vi.fn();
    render(<ContextMenu {...defaultProps} onEdit={onEdit} />);
    fireEvent.click(screen.getByText("Edit task"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onMarkComplete when Mark Complete is clicked", () => {
    const onMarkComplete = vi.fn();
    render(<ContextMenu {...defaultProps} onMarkComplete={onMarkComplete} />);
    fireEvent.click(screen.getByText("Mark Complete"));
    expect(onMarkComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete task is clicked", () => {
    const onDelete = vi.fn();
    render(<ContextMenu {...defaultProps} onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete task"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<ContextMenu {...defaultProps} onClose={onClose} />);
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on outside click", () => {
    const onClose = vi.fn();
    render(<ContextMenu {...defaultProps} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders a separator", () => {
    render(<ContextMenu {...defaultProps} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("supports ArrowDown keyboard navigation", () => {
    render(<ContextMenu {...defaultProps} />);
    const menu = screen.getByRole("menu");
    const items = screen.getAllByRole("menuitem");

    items[0].focus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);
  });

  it("supports ArrowUp keyboard navigation", () => {
    render(<ContextMenu {...defaultProps} />);
    const menu = screen.getByRole("menu");
    const items = screen.getAllByRole("menuitem");

    items[1].focus();
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[0]);
  });
});

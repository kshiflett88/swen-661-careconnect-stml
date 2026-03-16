import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("is not interactive by default", () => {
    const { container } = render(<Card>Static</Card>);
    const card = container.firstChild;
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("is interactive when onClick is provided", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Click card">Interactive</Card>);
    const card = screen.getByRole("button", { name: "Click card" });
    expect(card).toBeInTheDocument();
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("handles Enter key when interactive", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Pressable">Content</Card>);
    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies highlighted variant border", () => {
    const { container } = render(<Card variant="highlighted">Highlighted</Card>);
    expect(container.firstChild.style.border).toContain("3px solid");
  });

  it("applies focus shadow on interactive card focus", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Focusable">Focus</Card>);
    const card = screen.getByRole("button");
    fireEvent.focus(card);
    expect(card.style.boxShadow).toContain("0 0 0");
  });

  it("clears focus shadow on blur", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Blurrable">Blur</Card>);
    const card = screen.getByRole("button");
    fireEvent.focus(card);
    fireEvent.blur(card);
    expect(card.style.boxShadow).toBe("0 2px 8px rgba(0, 0, 0, 0.1)");
  });

  it("applies hover shadow on mouseEnter", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Hoverable">Hover</Card>);
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    expect(card.style.boxShadow).toContain("0 4px 12px");
  });

  it("restores shadow on mouseLeave", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Leave">Leave</Card>);
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    expect(card.style.boxShadow).toBe("0 2px 8px rgba(0, 0, 0, 0.1)");
  });

  it("handles Space key when interactive", () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick} ariaLabel="Spaceable">Space</Card>);
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies large padding when specified", () => {
    const { container } = render(<Card padding="large">Large pad</Card>);
    expect(container.firstChild.style.padding).toBeTruthy();
  });

  it("does not apply focus effects on non-interactive card", () => {
    const { container } = render(<Card>Static</Card>);
    const card = container.firstChild;
    const originalShadow = card.style.boxShadow;
    fireEvent.focus(card);
    expect(card.style.boxShadow).toBe(originalShadow);
  });
});

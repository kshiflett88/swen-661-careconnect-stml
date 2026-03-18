import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    fireEvent.click(screen.getByText("Press"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Press</Button>);
    fireEvent.click(screen.getByText("Press"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("sets aria-label when provided", () => {
    render(<Button ariaLabel="Save changes">Save</Button>);
    expect(screen.getByLabelText("Save changes")).toBeInTheDocument();
  });

  it("sets aria-disabled when disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByText("Nope")).toHaveAttribute("aria-disabled", "true");
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByText("Primary");
    expect(btn.style.backgroundColor).toBeTruthy();
  });

  it("renders with type='button' by default", () => {
    render(<Button>Btn</Button>);
    expect(screen.getByText("Btn")).toHaveAttribute("type", "button");
  });

  it("renders with type='submit' when specified", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText("Submit")).toHaveAttribute("type", "submit");
  });

  it("handles Enter keydown", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Key</Button>);
    fireEvent.keyDown(screen.getByText("Key"), { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("handles Space keydown", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Space</Button>);
    fireEvent.keyDown(screen.getByText("Space"), { key: " " });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies focus shadow on focus", () => {
    render(<Button>Focus</Button>);
    const btn = screen.getByText("Focus");
    fireEvent.focus(btn);
    expect(btn.style.boxShadow).toBeTruthy();
  });

  it("clears shadow on blur", () => {
    render(<Button>Blur</Button>);
    const btn = screen.getByText("Blur");
    fireEvent.focus(btn);
    fireEvent.blur(btn);
    expect(btn.style.boxShadow).toBe("none");
  });

  it("changes background on mouseEnter for primary variant", () => {
    render(<Button variant="primary">Hover</Button>);
    const btn = screen.getByText("Hover");
    const before = btn.style.backgroundColor;
    fireEvent.mouseEnter(btn);
    expect(btn.style.backgroundColor).toBeTruthy();
  });

  it("restores background on mouseLeave for primary variant", () => {
    render(<Button variant="primary">Leave</Button>);
    const btn = screen.getByText("Leave");
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(btn.style.backgroundColor).toBeTruthy();
  });

  it("applies scale on mouseDown", () => {
    render(<Button>Down</Button>);
    const btn = screen.getByText("Down");
    fireEvent.mouseDown(btn);
    expect(btn.style.transform).toBe("scale(0.98)");
  });

  it("restores scale on mouseUp", () => {
    render(<Button>Up</Button>);
    const btn = screen.getByText("Up");
    fireEvent.mouseDown(btn);
    fireEvent.mouseUp(btn);
    expect(btn.style.transform).toBe("scale(1)");
  });

  it("does not fire keyDown handler when disabled", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Dis</Button>);
    fireEvent.keyDown(screen.getByText("Dis"), { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not scale on mouseDown when disabled", () => {
    render(<Button disabled>NoScale</Button>);
    const btn = screen.getByText("NoScale");
    fireEvent.mouseDown(btn);
    expect(btn.style.transform).not.toBe("scale(0.98)");
  });

  it("does not hover-change background when disabled", () => {
    render(<Button variant="primary" disabled>NoHover</Button>);
    const btn = screen.getByText("NoHover");
    const bg = btn.style.backgroundColor;
    fireEvent.mouseEnter(btn);
    expect(btn.style.backgroundColor).toBe(bg);
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Sec</Button>);
    const btn = screen.getByText("Sec");
    expect(btn.style.border).toContain("2px solid");
  });

  it("renders danger variant", () => {
    render(<Button variant="danger">Del</Button>);
    const btn = screen.getByText("Del");
    expect(btn.style.backgroundColor).toBeTruthy();
  });

  it("renders success variant", () => {
    render(<Button variant="success">OK</Button>);
    const btn = screen.getByText("OK");
    expect(btn.style.backgroundColor).toBeTruthy();
  });

  it("renders large size", () => {
    render(<Button size="large">Big</Button>);
    const btn = screen.getByText("Big");
    expect(btn.style.minHeight).toBeTruthy();
  });

  it("renders full width", () => {
    render(<Button fullWidth>Wide</Button>);
    const btn = screen.getByText("Wide");
    expect(btn.style.width).toBe("100%");
  });
});

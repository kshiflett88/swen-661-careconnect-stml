import { render, screen } from "@testing-library/react";
import { PriorityBadge } from "../../components/PriorityBadge";

describe("PriorityBadge", () => {
  it("renders high priority", () => {
    render(<PriorityBadge level="high" />);
    expect(screen.getByRole("status")).toHaveTextContent("High");
  });

  it("renders medium priority", () => {
    render(<PriorityBadge level="medium" />);
    expect(screen.getByRole("status")).toHaveTextContent("Medium");
  });

  it("renders low priority", () => {
    render(<PriorityBadge level="low" />);
    expect(screen.getByRole("status")).toHaveTextContent("Low");
  });

  it("has accessible label", () => {
    render(<PriorityBadge level="high" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-label");
  });

  it("includes priority symbol/badge", () => {
    render(<PriorityBadge level="high" />);
    // The badge should have at least the text and a symbol
    const badge = screen.getByRole("status");
    expect(badge.children.length).toBeGreaterThanOrEqual(2);
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactsView } from "../ContactsView";

describe("ContactsView", () => {
  it("renders Primary Caregiver section", () => {
    render(<ContactsView />);
    expect(screen.getByText("Primary Caregiver")).toBeInTheDocument();
    expect(screen.getByText("Sarah Miller")).toBeInTheDocument();
  });

  it("renders Emergency Services section", () => {
    render(<ContactsView />);
    expect(screen.getByText("Emergency Services")).toBeInTheDocument();
    expect(screen.getByText("911")).toBeInTheDocument();
  });

  it("renders Family Contact section", () => {
    render(<ContactsView />);
    expect(screen.getByText("Family Contact")).toBeInTheDocument();
    expect(screen.getByText("Michael Miller")).toBeInTheDocument();
  });

  it("renders Primary Doctor section", () => {
    render(<ContactsView />);
    expect(screen.getByText("Primary Doctor")).toBeInTheDocument();
    expect(screen.getByText("Dr. Jennifer Park")).toBeInTheDocument();
  });

  it("shows call confirmation modal when Call is clicked", () => {
    render(<ContactsView />);
    const callButtons = screen.getAllByText("Call");
    fireEvent.click(callButtons[0]); // Call Sarah Miller
    expect(screen.getByText("Confirm Call")).toBeInTheDocument();
    expect(screen.getByText("Call Now")).toBeInTheDocument();
  });

  it("shows message confirmation modal when Message is clicked", () => {
    render(<ContactsView />);
    const messageButtons = screen.getAllByText("Message");
    fireEvent.click(messageButtons[0]); // Message Sarah Miller
    expect(screen.getByText("Do you want to open messaging for this contact?")).toBeInTheDocument();
  });

  it("shows emergency call confirmation when emergency button is clicked", () => {
    render(<ContactsView />);
    fireEvent.click(screen.getByText("Call Emergency Services"));
    expect(screen.getByText("This will call 911 Emergency Services. Continue?")).toBeInTheDocument();
    expect(screen.getByText("Call 911")).toBeInTheDocument();
  });

  it("closes modal when Cancel is clicked", () => {
    render(<ContactsView />);
    const callButtons = screen.getAllByText("Call");
    fireEvent.click(callButtons[0]);
    expect(screen.getByText("Confirm Call")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Confirm Call")).not.toBeInTheDocument();
  });

  it("renders info note about updating contacts", () => {
    render(<ContactsView />);
    expect(screen.getByText(/update contact information/i)).toBeInTheDocument();
  });
});

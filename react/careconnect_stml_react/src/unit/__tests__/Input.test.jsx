import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../../components/Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input id="test" label="Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("calls onChange with value", () => {
    const onChange = jest.fn();
    render(<Input id="test" label="Email" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    expect(onChange).toHaveBeenCalledWith("a@b.com");
  });

  it("shows required asterisk", () => {
    render(<Input id="req" label="Required Field" value="" onChange={() => {}} required />);
    expect(screen.getByLabelText("required")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input id="err" label="Field" value="" onChange={() => {}} error="Invalid input" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid input");
  });

  it("sets aria-invalid when error exists", () => {
    render(<Input id="err" label="Field" value="" onChange={() => {}} error="Bad" />);
    expect(screen.getByLabelText("Field")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows help text when no error", () => {
    render(<Input id="help" label="Field" value="" onChange={() => {}} helpText="Helpful info" />);
    expect(screen.getByText("Helpful info")).toBeInTheDocument();
  });

  it("does not show help text when error present", () => {
    render(<Input id="both" label="Field" value="" onChange={() => {}} error="Error" helpText="Help" />);
    expect(screen.queryByText("Help")).not.toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Input id="ph" label="Search" value="" onChange={() => {}} placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("applies focus border on focus", () => {
    render(<Input id="foc" label="Focus" value="" onChange={() => {}} />);
    const input = screen.getByLabelText("Focus");
    fireEvent.focus(input);
    expect(input.style.boxShadow).toBeTruthy();
  });

  it("restores border on blur", () => {
    render(<Input id="blr" label="Blur" value="" onChange={() => {}} />);
    const input = screen.getByLabelText("Blur");
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input.style.boxShadow).toBe("none");
  });

  it("applies error border color on blur when error exists", () => {
    render(<Input id="errblr" label="ErrBlur" value="" onChange={() => {}} error="Bad" />);
    const input = screen.getByLabelText("ErrBlur");
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input.style.borderColor).toBeTruthy();
  });

  it("renders as disabled", () => {
    render(<Input id="dis" label="Disabled" value="" onChange={() => {}} disabled />);
    expect(screen.getByLabelText("Disabled")).toBeDisabled();
  });
});

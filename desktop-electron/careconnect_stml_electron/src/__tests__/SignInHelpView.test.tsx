import { fireEvent, render, screen } from "@testing-library/react";
import { SignInHelpView } from "../components/SignInHelpView";

describe("SignInHelpView", () => {
  test("renders help heading, guidance, and actions", () => {
    render(
      <SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={() => undefined} />
    );

    expect(screen.getByRole("heading", { name: /having trouble signing in\?/i })).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/here are some things you can try/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset access/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contact caregiver/i })).toBeInTheDocument();
  });

  test("calls onResetAccess when reset button is clicked", () => {
    const onResetAccess = jest.fn();
    render(
      <SignInHelpView onResetAccess={onResetAccess} onClose={() => undefined} onContactCaregiver={() => undefined} />
    );

    fireEvent.click(screen.getByRole("button", { name: /reset access/i }));

    expect(onResetAccess).toHaveBeenCalledTimes(1);
  });

  test("calls onContactCaregiver when contact caregiver is clicked", () => {
    const onContactCaregiver = jest.fn();
    render(
      <SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={onContactCaregiver} />
    );

    fireEvent.click(screen.getByRole("button", { name: /contact caregiver/i }));

    expect(onContactCaregiver).toHaveBeenCalledTimes(1);
  });

  test("calls onClose from close controls", () => {
    const onClose = jest.fn();
    render(<SignInHelpView onResetAccess={() => undefined} onClose={onClose} onContactCaregiver={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /^close sign in help$/i }));
    fireEvent.click(screen.getByRole("button", { name: /close sign in help modal/i }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import "jest-axe/extend-expect";
import App from "../App";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { SignInHelpView } from "../components/SignInHelpView";
import { SignInView } from "../components/SignInView";

describe("Automated accessibility checks", () => {
  test("SignInView has no obvious axe violations", async () => {
    const { container } = render(<SignInView onSignIn={() => undefined} onNeedHelp={() => undefined} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("SignInHelpView has no obvious axe violations", async () => {
    const { container } = render(
      <SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={() => undefined} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ConfirmDialog has no obvious axe violations", async () => {
    const { container } = render(
      <ConfirmDialog
        isOpen
        title="Contact caregiver?"
        message="This will send a caregiver contact request."
        confirmText="Contact"
        cancelText="Cancel"
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("keyboard-only navigation works on SignInView controls", async () => {
    const user = userEvent.setup();
    render(<SignInView onSignIn={() => undefined} onNeedHelp={() => undefined} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /sign in with this device/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: /need help signing in\?/i })).toHaveFocus();
  });

  test("keyboard-only navigation works on SignInHelpView controls", async () => {
    const user = userEvent.setup();
    render(<SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={() => undefined} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /^close sign in help$/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /reset access and return to sign in/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /contact caregiver/i })).toHaveFocus();
  });

  test("App pre-sign-in flow remains keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(screen.getByRole("button", { name: /sign in with this device/i })).toHaveFocus();

    await user.tab();
    const helpLink = screen.getByRole("link", { name: /need help signing in\?/i });
    expect(helpLink).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: /having trouble signing in\?/i })).toBeInTheDocument();
  });
});

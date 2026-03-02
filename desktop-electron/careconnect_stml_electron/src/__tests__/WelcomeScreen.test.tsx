import { render, screen } from "@testing-library/react";
import { SignInView } from "../components/SignInView";

test("renders welcome heading and sign-in button", () => {
  const onSignIn = () => undefined;

  render(<SignInView onSignIn={onSignIn} onNeedHelp={() => undefined} />);

  expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sign in with this device/i })).toBeInTheDocument();
});

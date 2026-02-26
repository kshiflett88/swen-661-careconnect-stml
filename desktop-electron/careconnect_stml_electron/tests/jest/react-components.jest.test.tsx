import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SignInHelpView } from '../../src/components/SignInHelpView';
import { SignInView } from '../../src/components/SignInView';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';

describe('React components (RTL + Jest)', () => {
  test('SignInView triggers sign-in action from primary button', () => {
    const onSignIn = jest.fn();

    render(<SignInView onSignIn={onSignIn} onNeedHelp={() => undefined} />);

    fireEvent.click(screen.getByRole('button', { name: /sign in with this device/i }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  test('SignInView supports keyboard navigation to Help link', () => {
    const onNeedHelp = jest.fn();

    render(<SignInView onSignIn={() => undefined} onNeedHelp={onNeedHelp} />);

    const helpLink = screen.getByRole('link', { name: /need help signing in\?/i });
    helpLink.focus();
    fireEvent.keyDown(helpLink, { key: 'Enter' });
    fireEvent.click(helpLink);

    expect(onNeedHelp).toHaveBeenCalledTimes(2);
  });

  test('SignInView supports space key and optional help section behavior', () => {
    const onNeedHelp = jest.fn();
    const { rerender } = render(<SignInView onSignIn={() => undefined} onNeedHelp={onNeedHelp} />);

    const helpLink = screen.getByRole('link', { name: /need help signing in\?/i });
    fireEvent.keyDown(helpLink, { key: ' ' });
    fireEvent.focus(helpLink);
    fireEvent.blur(helpLink);
    fireEvent.mouseEnter(helpLink);
    fireEvent.mouseLeave(helpLink);

    expect(onNeedHelp).toHaveBeenCalledTimes(1);

    rerender(<SignInView onSignIn={() => undefined} />);
    expect(screen.queryByRole('link', { name: /need help signing in\?/i })).not.toBeInTheDocument();
  });

  test('SignInHelpView renders screen-reader friendly structure and actions', () => {
    render(
      <SignInHelpView onResetAccess={() => undefined} onClose={() => undefined} onContactCaregiver={() => undefined} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /having trouble signing in\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset access/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /contact caregiver/i })).toBeInTheDocument();
  });

  test('ConfirmDialog has proper alertdialog semantics', () => {
    render(
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

    const dialog = screen.getByRole('alertdialog', { name: /contact caregiver\?/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(/caregiver contact request/i)).toBeInTheDocument();
  });

  test('ConfirmDialog supports confirm, cancel, outside click, and escape key', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { container } = render(
      <ConfirmDialog
        isOpen
        title="Contact caregiver?"
        message="This will send a caregiver contact request."
        confirmText="Contact"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /contact this action/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel and close dialog/i }));

    const overlay = container.querySelector('[role="presentation"]');
    if (overlay) {
      fireEvent.click(overlay);
    }

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(3);
  });
});

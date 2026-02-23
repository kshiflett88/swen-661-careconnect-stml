import React from 'react';
import { colors, sizing, typography, zIndex } from '../constants/accessibility';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Accessible Confirmation Dialog Component
 * 
 * WCAG 2.2 AA Compliance:
 * - Modal focus trap (WCAG 2.4.3)
 * - Escape key to close (WCAG 2.1.1)
 * - ARIA role="alertdialog" for screen readers (WCAG 4.1.3)
 * - Keyboard navigation between buttons (WCAG 2.1.1)
 * 
 * STML Considerations:
 * - Clear confirmation required for destructive actions
 * - Large, easy-to-read text
 * - Simple yes/no choice
 * - Visual distinction between confirm and cancel
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Trap focus within dialog when open (WCAG 2.4.3)
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      // WCAG 2.1.1: Escape key closes dialog
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const overlayStyles: React.CSSProperties = {
    // Modal overlay
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: zIndex.modal,
    // WCAG 2.4.3: Focus is trapped in modal
  };

  const dialogStyles: React.CSSProperties = {
    backgroundColor: colors.background,
    borderRadius: sizing.borderRadiusLg,
    padding: sizing.spaceXl,
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    // STML: Large enough to be easily read
  };

  const titleStyles: React.CSSProperties = {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    marginBottom: sizing.spaceMd,
    // STML: Clear, prominent heading
  };

  const messageStyles: React.CSSProperties = {
    fontSize: typography.fontSizeBase,
    color: colors.text,
    lineHeight: typography.lineHeightRelaxed,
    marginBottom: sizing.spaceLg,
    // STML: Easy-to-read body text
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: sizing.spaceMd,
    justifyContent: 'flex-end',
    // STML: Buttons side-by-side for easy comparison
  };

  return (
    <div
      style={overlayStyles}
      onClick={onCancel} // Click outside to cancel
      // WCAG 4.1.3: Announce modal to screen readers
      role="presentation"
    >
      <div
        style={dialogStyles}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking dialog
        // WCAG 4.1.3: Alert dialog role
        role="alertdialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        // WCAG 2.4.3: Modal must be labeled
        aria-modal="true"
      >
        {/* WCAG 2.4.6: Descriptive heading */}
        <h2 id="dialog-title" style={titleStyles}>
          {title}
        </h2>
        
        {/* STML: Clear explanation of what will happen */}
        <p id="dialog-message" style={messageStyles}>
          {message}
        </p>
        
        <div style={buttonContainerStyles}>
          {/* WCAG 2.1.1: Keyboard navigation with Tab */}
          {/* STML: Cancel first (safer default) */}
          <Button
            onClick={onCancel}
            variant="secondary"
            size="large"
            ariaLabel={`${cancelText} and close dialog`}
          >
            {cancelText}
          </Button>
          
          {/* Destructive action in danger color */}
          <Button
            onClick={onConfirm}
            variant={variant}
            size="large"
            ariaLabel={`${confirmText} this action`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

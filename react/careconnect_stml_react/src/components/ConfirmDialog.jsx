import { useEffect } from 'react';
import { colors, sizing, typography, zIndex } from '../constants/accessibility';
import { Button } from './Button';

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: zIndex.modal,
  };

  const dialogStyles = {
    backgroundColor: colors.background,
    borderRadius: sizing.borderRadiusLg,
    padding: sizing.spaceXl,
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    fontFamily: typography.fontFamilyBase,
  };

  const titleStyles = {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    fontFamily: typography.fontFamilyBase,
    color: colors.text,
    marginBottom: sizing.spaceMd,
  };

  const messageStyles = {
    fontSize: typography.fontSizeBase,
    fontFamily: typography.fontFamilyBase,
    color: colors.text,
    lineHeight: typography.lineHeightRelaxed,
    marginBottom: sizing.spaceLg,
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: sizing.spaceMd,
    justifyContent: 'flex-end',
  };

  return (
    <div style={overlayStyles} onClick={onCancel} role="presentation">
      <div
        style={dialogStyles}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        aria-modal="true"
      >
        <h2 id="dialog-title" style={titleStyles}>{title}</h2>
        <p id="dialog-message" style={messageStyles}>{message}</p>
        <div style={buttonContainerStyles}>
          <Button onClick={onCancel} variant="secondary" size="large" ariaLabel={`${cancelText} and close dialog`}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant={variant} size="large" ariaLabel={`${confirmText} this action`}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

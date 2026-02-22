import React from 'react';
import { colors, sizing, typography } from '../constants/accessibility';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'default' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string; // WCAG 2.4.6: Descriptive labels
  fullWidth?: boolean;
}

/**
 * Accessible Button Component
 * 
 * WCAG 2.2 AA Compliance:
 * - Minimum 44×44px touch target (WCAG 2.5.5)
 * - 3px visible focus indicator (WCAG 2.4.7)
 * - 3:1 contrast for large text (WCAG 1.4.3)
 * - Keyboard accessible (native button element)
 * - Disabled state clearly indicated (WCAG 1.4.1)
 * 
 * STML Considerations:
 * - Large touch targets (56px for primary actions)
 * - Clear visual feedback on hover/press
 * - High contrast colors
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  disabled = false,
  type = 'button',
  ariaLabel,
  fullWidth = false,
}: ButtonProps) {
  const styles: React.CSSProperties = {
    // WCAG 2.5.5: Minimum 44×44px touch target
    // STML: 56px for better accessibility
    minHeight: size === 'large' ? sizing.touchTargetStml : sizing.buttonHeightMin,
    minWidth: sizing.minTouchTarget,
    padding: `${sizing.buttonPaddingY}px ${sizing.buttonPaddingX}px`,
    
    // Typography - large enough for easy reading
    fontSize: size === 'large' ? typography.fontSizeMd : typography.fontSizeBase,
    fontWeight: typography.fontWeightMedium,
    fontFamily: typography.fontFamilyBase,
    lineHeight: typography.lineHeightNormal,
    
    // Visual styling
    border: 'none',
    borderRadius: sizing.borderRadiusMd,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 150ms, transform 100ms',
    width: fullWidth ? '100%' : 'auto',
    
    // WCAG 2.4.7: Visible focus indicator
    outline: 'none', // We'll use box-shadow for focus
    
    // Color variants with WCAG AA contrast
    ...(variant === 'primary' && {
      backgroundColor: disabled ? '#cccccc' : colors.primary,
      color: '#ffffff', // White text on dark blue: 8.2:1 contrast
    }),
    ...(variant === 'secondary' && {
      backgroundColor: disabled ? '#cccccc' : colors.backgroundAlt,
      color: disabled ? '#999999' : colors.text,
      border: `2px solid ${colors.border}`,
    }),
    ...(variant === 'danger' && {
      backgroundColor: disabled ? '#cccccc' : colors.danger,
      color: '#ffffff', // White text on dark red: 4.5:1 contrast
    }),
    ...(variant === 'success' && {
      backgroundColor: disabled ? '#cccccc' : colors.success,
      color: '#ffffff', // White text on dark green: 4.6:1 contrast
    }),
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // WCAG 2.1.1: Keyboard accessible
    // Enter and Space should trigger button (native behavior)
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      // WCAG 2.1.1: Disabled state communicated to assistive tech
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      style={styles}
      // WCAG 2.4.7: Clear focus indicator
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focus}`;
        e.currentTarget.style.outline = 'none';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      // STML: Clear hover feedback
      onMouseEnter={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = colors.primaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = colors.primary;
        }
      }}
      // STML: Visual "press" feedback
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {children}
    </button>
  );
}

import React from 'react';
import { colors, sizing, typography } from '../constants/accessibility';

interface InputProps {
  id: string; // WCAG 3.3.2: Required for label association
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password' | 'email' | 'tel' | 'date' | 'time';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string; // WCAG 3.3.1: Error identification
  helpText?: string;
}

/**
 * Accessible Input Component
 * 
 * WCAG 2.2 AA Compliance:
 * - Label programmatically associated with input (WCAG 3.3.2)
 * - Error messages clearly identified (WCAG 3.3.1)
 * - 48px height for easy touch interaction (WCAG 2.5.5)
 * - 3px visible focus indicator (WCAG 2.4.7)
 * - 4.5:1 text contrast (WCAG 1.4.3)
 * 
 * STML Considerations:
 * - Large text and input fields
 * - Clear labels above inputs (not placeholders)
 * - Persistent help text for guidance
 */
export function Input({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
}: InputProps) {
  const inputStyles: React.CSSProperties = {
    // WCAG 2.5.5: Large touch target
    height: sizing.inputHeight,
    width: '100%',
    padding: `0 ${sizing.inputPadding}px`,
    
    // Typography
    fontSize: typography.fontSizeBase,
    fontFamily: typography.fontFamilyBase,
    lineHeight: typography.lineHeightNormal,
    
    // WCAG 1.4.3: 4.5:1 contrast for text
    color: colors.text,
    backgroundColor: disabled ? colors.backgroundAlt : colors.background,
    
    // Visual styling
    border: `2px solid ${error ? colors.danger : colors.border}`,
    borderRadius: sizing.borderRadiusMd,
    outline: 'none',
    
    // Transitions
    transition: 'border-color 150ms',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: sizing.spaceSm,
    fontSize: typography.fontSizeBase,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
    // WCAG 3.3.2: Labels must be visible and persistent
    // (not relying on placeholder text)
  };

  const errorStyles: React.CSSProperties = {
    marginTop: sizing.spaceSm,
    fontSize: typography.fontSizeSm,
    color: colors.danger,
    // WCAG 3.3.1: Use icon + text for error (not color alone)
  };

  const helpTextStyles: React.CSSProperties = {
    marginTop: sizing.spaceSm,
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  };

  return (
    <div style={{ marginBottom: sizing.spaceMd }}>
      {/* WCAG 3.3.2: Label programmatically associated via htmlFor */}
      <label htmlFor={id} style={labelStyles}>
        {label}
        {required && (
          <span
            style={{ color: colors.danger, marginLeft: sizing.spaceXs }}
            aria-label="required"
          >
            {' '}*
          </span>
        )}
      </label>
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyles}
        // WCAG 4.1.3: Status messages (aria-invalid for errors)
        aria-invalid={!!error}
        // WCAG 3.3.1: Associate error message with input
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        // WCAG 2.4.7: Visible focus indicator
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.focus;
          e.currentTarget.style.boxShadow = `0 0 0 1px ${colors.focus}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.danger : colors.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      
      {/* WCAG 3.3.1: Error identification */}
      {error && (
        <div id={`${id}-error`} role="alert" style={errorStyles}>
          {/* Icon for non-color identification */}
          ⚠️ {error}
        </div>
      )}
      
      {/* Help text for additional guidance (STML) */}
      {helpText && !error && (
        <div id={`${id}-help`} style={helpTextStyles}>
          {helpText}
        </div>
      )}
    </div>
  );
}

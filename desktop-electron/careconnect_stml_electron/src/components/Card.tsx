import React from 'react';
import { colors, sizing } from '../constants/accessibility';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';
  padding?: 'default' | 'large';
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Accessible Card Component
 * 
 * WCAG 2.2 AA Compliance:
 * - Sufficient color contrast (WCAG 1.4.3)
 * - Keyboard accessible if clickable (WCAG 2.1.1)
 * - Focus indicator for interactive cards (WCAG 2.4.7)
 * - Semantic HTML (article or div)
 * 
 * STML Considerations:
 * - Clear visual boundaries
 * - Adequate padding for easy reading
 * - Optional highlighting for emphasis
 */
export function Card({
  children,
  variant = 'default',
  padding = 'default',
  onClick,
  ariaLabel,
}: CardProps) {
  const isInteractive = !!onClick;

  const baseStyles: React.CSSProperties = {
    backgroundColor: colors.background,
    borderRadius: sizing.borderRadiusMd,
    padding: padding === 'large' ? sizing.spaceXl : sizing.spaceLg,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    // STML: Clear visual boundaries
    border: variant === 'highlighted' 
      ? `3px solid ${colors.warning}` // Yellow border for emphasis
      : `1px solid ${colors.border}`,
    
    // Interactive styles
    cursor: isInteractive ? 'pointer' : 'default',
    transition: 'box-shadow 150ms, transform 100ms',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // WCAG 2.1.1: Keyboard activation for interactive cards
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      style={baseStyles}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      // WCAG 2.1.1: Make interactive cards keyboard accessible
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={ariaLabel}
      // WCAG 2.4.7: Focus indicator for interactive cards
      onFocus={(e) => {
        if (isInteractive) {
          e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focus}, 0 2px 8px rgba(0, 0, 0, 0.1)`;
        }
      }}
      onBlur={(e) => {
        if (isInteractive) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
      }}
      // STML: Hover feedback for interactive cards
      onMouseEnter={(e) => {
        if (isInteractive) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {children}
    </div>
  );
}

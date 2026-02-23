import React from 'react';
import { sizing, typography, priority } from '../constants/accessibility';

interface PriorityBadgeProps {
  level: 'high' | 'medium' | 'low';
}

/**
 * Accessible Priority Badge Component
 * 
 * WCAG 2.2 AA Compliance:
 * - Does NOT rely on color alone (WCAG 1.4.1)
 * - Uses text labels AND colors AND symbols
 * - High contrast text (WCAG 1.4.3)
 * - Screen reader accessible with aria-label
 * 
 * STML Considerations:
 * - Clear visual hierarchy
 * - Easy-to-understand symbols
 * - Multiple cues for priority level
 */
export function PriorityBadge({ level }: PriorityBadgeProps) {
  const config = priority[level];

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizing.spaceXs,
    padding: `${sizing.spaceXs}px ${sizing.spaceSm}px`,
    borderRadius: sizing.borderRadiusSm,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightMedium,
    
    // WCAG 1.4.1: Not using color alone - combining color + text + symbol
    backgroundColor: config.backgroundColor,
    color: config.color,
    
    // WCAG 1.4.3: Ensure sufficient contrast
    // border adds extra visual distinction
    border: `1px solid ${config.color}`,
  };

  return (
    <span
      style={badgeStyles}
      // WCAG 4.1.2: Programmatically communicated to assistive tech
      aria-label={config.label}
      role="status"
    >
      {/* WCAG 1.4.1: Symbol for non-color identification */}
      <span aria-hidden="true">{config.badge}</span>
      
      {/* Text label for clarity */}
      <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
    </span>
  );
}

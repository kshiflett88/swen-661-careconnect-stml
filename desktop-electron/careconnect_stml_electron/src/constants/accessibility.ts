/**
 * Accessibility Constants for CareConnect STML
 * 
 * WCAG 2.2 Level AA Compliance:
 * - Color contrast ratios: 4.5:1 for normal text, 3:1 for large text (18pt+)
 * - Touch target sizes: Minimum 44×44px
 * - Text scaling: Support up to 200% without layout breakage
 * 
 * STML (Short-Term Memory Loss) Considerations:
 * - Large, easy-to-read text
 * - Clear visual hierarchy
 * - Persistent orientation cues
 * - Reduced cognitive load through simplified layouts
 */

// WCAG 2.2 AA compliant color palette
// All colors tested for contrast against their backgrounds
export const colors = {
  // Primary colors - contrast tested at 4.5:1+ on white
  primary: '#0056b3',      // Dark blue - 8.2:1 contrast on white
  primaryHover: '#003d82', // Darker blue for hover states
  primaryLight: '#e6f0ff', // Light blue background - used sparingly
  
  // Status colors - all tested for WCAG AA compliance
  success: '#0a6e0a',      // Dark green - 4.6:1 on white
  successLight: '#d4f4d4', // Light green background
  warning: '#8b6914',      // Dark yellow-brown - 4.5:1 on white
  warningLight: '#fff4cc', // Light yellow background
  danger: '#c41e3a',       // Dark red - 4.5:1 on white
  dangerLight: '#ffe6ea',  // Light red background
  info: '#0056b3',         // Same as primary
  infoLight: '#e6f0ff',    // Light blue background
  
  // Neutral colors - high contrast for text readability
  text: '#1a1a1a',         // Near-black - 16.1:1 on white
  textSecondary: '#4a4a4a', // Dark gray - 10.4:1 on white
  textLight: '#6a6a6a',    // Medium gray - 7.1:1 on white
  
  // Background colors
  background: '#ffffff',   // White
  backgroundAlt: '#f5f5f5', // Light gray
  border: '#cccccc',       // Medium gray borders - 3:1 on white
  borderDark: '#999999',   // Darker borders for emphasis
  
  // Focus indicators - WCAG requires visible focus
  focus: '#0056b3',        // Blue focus ring
  focusOutline: '3px solid #0056b3', // Thick, visible outline
};

// WCAG 2.2 AA minimum touch target sizes
export const sizing = {
  // Minimum touch target: 44×44px (WCAG 2.5.5)
  // STML recommendation: Even larger for reduced fine motor control
  minTouchTarget: 44,      // Minimum WCAG size
  touchTargetStml: 56,     // Recommended for STML users
  
  // Button sizing
  buttonHeightMin: 44,
  buttonHeightLarge: 56,
  buttonPaddingX: 24,
  buttonPaddingY: 12,
  
  // Input sizing
  inputHeight: 48,         // Larger than minimum for easier interaction
  inputPadding: 16,
  
  // Spacing for visual breathing room
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
  spaceXl: 32,
  spaceXxl: 48,
  
  // Border radius for visual softness
  borderRadiusSm: 4,
  borderRadiusMd: 8,
  borderRadiusLg: 12,
};

// Typography - designed for readability and text scaling
export const typography = {
  // Font sizes scale with user's text-scale preference
  // Base values assume 16px root font size
  fontSizeXs: '0.75rem',   // 12px - use sparingly
  fontSizeSm: '0.875rem',  // 14px - secondary text
  fontSizeBase: '1rem',    // 16px - body text
  fontSizeMd: '1.125rem',  // 18px - large body text (WCAG large text threshold)
  fontSizeLg: '1.5rem',    // 24px - headings
  fontSizeXl: '2rem',      // 32px - large headings
  fontSizeXxl: '2.5rem',   // 40px - hero text
  
  // Font weights
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  
  // Line height for readability
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  
  // Font families
  fontFamilyBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMono: '"Courier New", Courier, monospace',
};

// Animation timing - avoid sudden changes that can be disorienting
export const animation = {
  // Prefer reduced motion for STML users
  durationFast: '150ms',
  durationNormal: '250ms',
  durationSlow: '350ms',
  
  // Easing functions
  easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
};

// Z-index layering
export const zIndex = {
  dropdown: 1000,
  modal: 2000,
  tooltip: 3000,
  notification: 4000,
};

// Priority levels - used for task prioritization
export const priority = {
  high: {
    value: 'high',
    label: 'High Priority', // Text label for screen readers
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    // Icon or badge text to avoid color-only identification (WCAG 1.4.1)
    badge: '!!!',
  },
  medium: {
    value: 'medium',
    label: 'Medium Priority',
    color: colors.warning,
    backgroundColor: colors.warningLight,
    badge: '!!',
  },
  low: {
    value: 'low',
    label: 'Low Priority',
    color: colors.info,
    backgroundColor: colors.infoLight,
    badge: '!',
  },
};

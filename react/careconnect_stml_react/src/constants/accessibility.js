/**
 * Accessibility Constants for CareConnect STML
 */

export const colors = {
  primary: '#0056b3',
  primaryHover: '#003d82',
  primaryLight: '#e6f0ff',
  success: '#0a6e0a',
  successLight: '#d4f4d4',
  warning: '#8b6914',
  warningLight: '#fff4cc',
  danger: '#c41e3a',
  dangerLight: '#ffe6ea',
  info: '#0056b3',
  infoLight: '#e6f0ff',
  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textLight: '#6a6a6a',
  background: '#ffffff',
  backgroundAlt: '#f5f5f5',
  border: '#cccccc',
  borderDark: '#999999',
  focus: '#111827',
  focusOutline: '3px solid #111827',
};

export const sizing = {
  minTouchTarget: 44,
  touchTargetStml: 56,
  buttonHeightMin: 44,
  buttonHeightLarge: 56,
  buttonPaddingX: 24,
  buttonPaddingY: 12,
  inputHeight: 48,
  inputPadding: 16,
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
  spaceXl: 32,
  spaceXxl: 48,
  borderRadiusSm: 4,
  borderRadiusMd: 8,
  borderRadiusLg: 12,
};

export const typography = {
  fontSizeXs: '0.75rem',
  fontSizeSm: '0.875rem',
  fontSizeBase: '1rem',
  fontSizeMd: '1.125rem',
  fontSizeLg: '1.5rem',
  fontSizeXl: '2rem',
  fontSizeXxl: '2.5rem',
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  fontFamilyBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMono: '"Courier New", Courier, monospace',
};

export const animation = {
  durationFast: '150ms',
  durationNormal: '250ms',
  durationSlow: '350ms',
  easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
};

export const zIndex = {
  dropdown: 1000,
  modal: 2000,
  tooltip: 3000,
  notification: 4000,
};

export const priority = {
  high: {
    value: 'high',
    label: 'High Priority',
    color: colors.danger,
    backgroundColor: colors.dangerLight,
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

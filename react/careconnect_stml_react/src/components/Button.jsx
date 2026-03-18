import { colors, sizing, typography } from '../constants/accessibility';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  disabled = false,
  type = 'button',
  ariaLabel,
  fullWidth = false,
}) {
  const styles = {
    minHeight: size === 'large' ? sizing.touchTargetStml : sizing.buttonHeightMin,
    minWidth: sizing.minTouchTarget,
    padding: `${sizing.buttonPaddingY}px ${sizing.buttonPaddingX}px`,
    fontSize: size === 'large' ? typography.fontSizeMd : typography.fontSizeBase,
    fontWeight: typography.fontWeightMedium,
    fontFamily: typography.fontFamilyBase,
    lineHeight: typography.lineHeightNormal,
    border: 'none',
    borderRadius: sizing.borderRadiusMd,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 150ms, transform 100ms',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    ...(variant === 'primary' && {
      backgroundColor: disabled ? '#cccccc' : colors.primary,
      color: '#ffffff',
    }),
    ...(variant === 'secondary' && {
      backgroundColor: disabled ? '#cccccc' : colors.backgroundAlt,
      color: disabled ? '#999999' : colors.text,
      border: `2px solid ${colors.border}`,
    }),
    ...(variant === 'danger' && {
      backgroundColor: disabled ? '#cccccc' : colors.danger,
      color: '#ffffff',
    }),
    ...(variant === 'success' && {
      backgroundColor: disabled ? '#cccccc' : colors.success,
      color: '#ffffff',
    }),
  };

  const handleKeyDown = (e) => {
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
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      style={styles}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px #ffffff, 0 0 0 5px ${colors.focus}`;
        e.currentTarget.style.outline = 'none';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
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

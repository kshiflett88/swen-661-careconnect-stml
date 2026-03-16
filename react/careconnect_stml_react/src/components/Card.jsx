import { colors, sizing } from '../constants/accessibility';

export function Card({
  children,
  variant = 'default',
  padding = 'default',
  onClick,
  ariaLabel,
}) {
  const isInteractive = !!onClick;

  const baseStyles = {
    backgroundColor: colors.background,
    borderRadius: sizing.borderRadiusMd,
    padding: padding === 'large' ? sizing.spaceXl : sizing.spaceLg,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: variant === 'highlighted'
      ? `3px solid ${colors.warning}`
      : `1px solid ${colors.border}`,
    cursor: isInteractive ? 'pointer' : 'default',
    transition: 'box-shadow 150ms, transform 100ms',
  };

  const handleKeyDown = (e) => {
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
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={ariaLabel}
      onFocus={(e) => {
        if (isInteractive) {
          e.currentTarget.style.boxShadow = `0 0 0 2px #ffffff, 0 0 0 5px ${colors.focus}, 0 2px 8px rgba(0, 0, 0, 0.1)`;
        }
      }}
      onBlur={(e) => {
        if (isInteractive) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
      }}
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

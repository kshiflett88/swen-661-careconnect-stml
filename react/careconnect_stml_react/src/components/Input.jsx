import { colors, sizing, typography } from '../constants/accessibility';

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
}) {
  const inputStyles = {
    height: sizing.inputHeight,
    width: '100%',
    padding: `0 ${sizing.inputPadding}px`,
    fontSize: typography.fontSizeBase,
    fontFamily: typography.fontFamilyBase,
    lineHeight: typography.lineHeightNormal,
    color: colors.text,
    backgroundColor: disabled ? colors.backgroundAlt : colors.background,
    border: `2px solid ${error ? colors.danger : colors.border}`,
    borderRadius: sizing.borderRadiusMd,
    outline: 'none',
    transition: 'border-color 150ms',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: sizing.spaceSm,
    fontSize: typography.fontSizeBase,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  };

  const errorStyles = {
    marginTop: sizing.spaceSm,
    fontSize: typography.fontSizeSm,
    color: colors.danger,
  };

  const helpTextStyles = {
    marginTop: sizing.spaceSm,
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  };

  return (
    <div style={{ marginBottom: sizing.spaceMd }}>
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
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.focus;
          e.currentTarget.style.boxShadow = `0 0 0 2px #ffffff, 0 0 0 5px ${colors.focus}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.danger : colors.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      {error && (
        <div id={`${id}-error`} role="alert" style={errorStyles}>
          ⚠️ {error}
        </div>
      )}

      {helpText && !error && (
        <div id={`${id}-help`} style={helpTextStyles}>
          {helpText}
        </div>
      )}
    </div>
  );
}

import { colors, sizing, typography, zIndex } from "../constants/accessibility";
import { Button } from "./Button";

interface SignInHelpViewProps {
  onResetAccess: () => void;
  onContactCaregiver: () => void;
  onClose: () => void;
  caregiverRequestSent?: boolean;
}

export function SignInHelpView({
  onResetAccess,
  onContactCaregiver,
  onClose,
  caregiverRequestSent = false,
}: SignInHelpViewProps) {
  const overlayStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: zIndex.modal,
    padding: sizing.spaceLg,
  };

  const modalStyles: React.CSSProperties = {
    width: "100%",
    maxWidth: "560px",
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: sizing.borderRadiusLg,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
    padding: sizing.spaceXl,
  };

  const contentStyles: React.CSSProperties = {
    textAlign: "left",
    fontFamily: typography.fontFamilyBase,
  };

  const headerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: sizing.spaceMd,
    gap: sizing.spaceMd,
  };

  const titleWrapStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: sizing.spaceMd,
  };

  const iconStyles: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: colors.primary,
    color: colors.background,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: typography.fontWeightBold,
  };

  const headingStyles: React.CSSProperties = {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.text,
    margin: 0,
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: typography.fontSizeBase,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightRelaxed,
    marginBottom: sizing.spaceMd,
  };

  const listStyles: React.CSSProperties = {
    marginTop: 0,
    marginBottom: sizing.spaceLg,
    paddingLeft: sizing.spaceLg,
    color: colors.text,
    lineHeight: typography.lineHeightRelaxed,
    fontSize: typography.fontSizeBase,
  };

  const actionsStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: sizing.spaceSm,
    marginBottom: sizing.spaceSm,
  };

  const closeIconStyles: React.CSSProperties = {
    border: "none",
    background: "transparent",
    color: colors.textSecondary,
    fontSize: "28px",
    lineHeight: 1,
    cursor: "pointer",
    padding: 0,
    minWidth: sizing.minTouchTarget,
    minHeight: sizing.minTouchTarget,
  };

  const closeTextStyles: React.CSSProperties = {
    border: "none",
    background: "transparent",
    color: colors.textSecondary,
    cursor: "pointer",
    fontSize: typography.fontSizeBase,
    fontFamily: typography.fontFamilyBase,
    padding: `${sizing.spaceSm}px ${sizing.spaceMd}px`,
    alignSelf: "center",
  };

  const successMessageStyles: React.CSSProperties = {
    marginTop: sizing.spaceMd,
    marginBottom: 0,
    padding: `${sizing.spaceSm}px ${sizing.spaceMd}px`,
    border: `1px solid ${colors.success}`,
    borderRadius: sizing.borderRadiusSm,
    backgroundColor: colors.backgroundAlt,
    color: colors.success,
    fontSize: typography.fontSizeBase,
    fontWeight: typography.fontWeightMedium,
  };

  return (
    <div style={overlayStyles} role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="signin-help-title" style={modalStyles}>
        <div style={contentStyles}>
          <div style={headerStyles}>
            <div style={titleWrapStyles}>
              <span style={iconStyles} aria-hidden="true">
                ?
              </span>
              <h1 id="signin-help-title" style={headingStyles}>
                Having trouble signing in?
              </h1>
            </div>
            <button type="button" style={closeIconStyles} onClick={onClose} aria-label="Close sign in help">
              ×
            </button>
          </div>

          <p style={descriptionStyles}>Here are some things you can try:</p>
          <ul style={listStyles}>
            <li>Make sure your device camera or fingerprint reader is working.</li>
            <li>Ask your caregiver for assistance if needed.</li>
          </ul>

          <div style={actionsStyles}>
            <Button onClick={onResetAccess} variant="primary" size="large" fullWidth ariaLabel="Reset access and return to sign in">
              Reset Access
            </Button>
            <Button onClick={onContactCaregiver} variant="secondary" size="large" fullWidth ariaLabel="Contact caregiver">
              Contact Caregiver
            </Button>
          </div>

          {caregiverRequestSent && (
            <p role="status" aria-live="polite" style={successMessageStyles}>
              Caregiver request sent. You should hear back soon.
            </p>
          )}

          <button type="button" style={closeTextStyles} onClick={onClose} aria-label="Close sign in help modal">
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

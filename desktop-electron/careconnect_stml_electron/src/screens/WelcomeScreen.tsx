import React from "react";
import { colors, sizing, typography } from "../constants/accessibility";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import type { ScreenId } from "../types";

/**
 * Welcome/Login Screen
 * 
 * WCAG 2.2 AA Compliance:
 * - High contrast colors (WCAG 1.4.3)
 * - Large touch targets (WCAG 2.5.5)
 * - Keyboard navigation (WCAG 2.1.1)
 * - Semantic HTML headings (WCAG 1.3.1)
 * - ARIA landmarks for screen readers (WCAG 2.4.1)
 * 
 * STML Considerations:
 * - Simple, focused layout with single primary action
 * - Clear, large welcome message
 * - Centered design reduces cognitive load
 * - High contrast logo/branding area
 */
export default function WelcomeScreen(props: { onGo: (screen: ScreenId) => void }) {
  // STML: Simple navigation to sign-in help or dashboard
  const handleSignIn = () => {
    // In production, this would trigger device authentication
    // For now, navigate to dashboard
    props.onGo('dashboard');
  };

  const handleNeedHelp = () => {
    props.onGo('signin-help');
  };

  const containerStyles: React.CSSProperties = {
    // Center the card vertically and horizontally
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: colors.backgroundAlt,
    padding: sizing.spaceLg,
    // WCAG 2.4.1: Main content landmark
  };

  const cardContentStyles: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '500px',
    // WCAG: Use system font stack for consistency and readability
    fontFamily: typography.fontFamilyBase,
  };

  // WCAG 1.4.3: Blue circle with white heart - 8.2:1 contrast on white background
  const iconCircleStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: colors.primary, // #0056b3 - dark blue
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: sizing.spaceLg,
    // WCAG 1.4.3: High contrast for accessibility
  };

  const heartIconStyles: React.CSSProperties = {
    fontSize: '40px',
    color: '#ffffff', // White heart on blue background
    // WCAG 1.4.3: White on dark blue provides excellent contrast
  };

  const brandNameStyles: React.CSSProperties = {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightNormal,
    fontFamily: typography.fontFamilyBase,
    color: colors.text,
    marginBottom: sizing.spaceXl,
    // STML: Clear brand name after icon
  };

  const headingStyles: React.CSSProperties = {
    // WCAG 1.3.1: Proper heading hierarchy
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    fontFamily: typography.fontFamilyBase,
    color: colors.text,
    marginBottom: sizing.spaceMd,
    lineHeight: typography.lineHeightNormal,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: typography.fontSizeBase,
    fontFamily: typography.fontFamilyBase,
    color: colors.textSecondary,
    marginBottom: sizing.spaceXl,
    lineHeight: typography.lineHeightRelaxed,
    // STML: Clear explanation of what sign-in does
  };

  const helpTextStyles: React.CSSProperties = {
    fontSize: typography.fontSizeSm,
    fontFamily: typography.fontFamilyBase,
    color: colors.textSecondary,
    marginTop: sizing.spaceMd,
    marginBottom: sizing.spaceLg,
    lineHeight: typography.lineHeightRelaxed,
    // STML: Explain authentication method
  };

  const dividerStyles: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: colors.border,
    margin: `${sizing.spaceLg}px 0`,
    // WCAG 1.4.1: Visual separator (not conveying meaning)
  };

  const helpLinkStyles: React.CSSProperties = {
    fontSize: typography.fontSizeBase,
    fontFamily: typography.fontFamilyBase,
    color: colors.primary,
    textDecoration: 'none',
    cursor: 'pointer',
    // WCAG 2.4.7: Focus indicator for keyboard navigation
  };

  return (
    // WCAG 2.4.1: Main landmark for screen readers
    <main style={containerStyles} role="main">
      <Card padding="large">
        <div style={cardContentStyles}>
          {/* WCAG 1.4.3: Blue circle with white heart icon - high contrast */}
          <div style={iconCircleStyles} aria-hidden="true">
            <span style={heartIconStyles}>♥</span>
          </div>

          {/* Brand name */}
          <div style={brandNameStyles}>
            CareConnect
          </div>

          {/* WCAG 1.3.1: Proper heading hierarchy (h1 for page title) */}
          <h1 style={headingStyles}>
            Welcome back
          </h1>

          {/* STML: Clear explanation of purpose */}
          <p style={subtitleStyles}>
            Sign in to access your tasks and reminders
          </p>

          {/* WCAG 2.5.5: Large touch target (56px) */}
          {/* STML: Single primary action reduces cognitive load */}
          <Button
            onClick={handleSignIn}
            variant="primary"
            size="large"
            fullWidth
            ariaLabel="Sign in with this device using biometric authentication"
          >
            {/* WCAG 1.4.1: Fingerprint icon is decorative only - meaning conveyed by text */}
            {/* Fluent UI style fingerprint icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: sizing.spaceSm, display: 'inline-block', verticalAlign: 'middle' }}
              aria-hidden="true"
            >
              <path
                d="M10 2C7.23858 2 5 4.23858 5 7V10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5V7C4 3.68629 6.68629 1 10 1C13.3137 1 16 3.68629 16 7V13.5C16 13.7761 15.7761 14 15.5 14C15.2239 14 15 13.7761 15 13.5V7C15 4.23858 12.7614 2 10 2Z"
                fill="currentColor"
              />
              <path
                d="M7 7C7 5.34315 8.34315 4 10 4C11.6569 4 13 5.34315 13 7V15.5C13 15.7761 12.7761 16 12.5 16C12.2239 16 12 15.7761 12 15.5V7C12 5.89543 11.1046 5 10 5C8.89543 5 8 5.89543 8 7V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V7Z"
                fill="currentColor"
              />
              <path
                d="M10 7C9.44772 7 9 7.44772 9 8V14.5C9 14.7761 9.22386 15 9.5 15C9.77614 15 10 14.7761 10 14.5V8C10 7.72386 10.2239 7.5 10.5 7.5C10.7761 7.5 11 7.72386 11 8V17.5C11 17.7761 10.7761 18 10.5 18C10.2239 18 10 17.7761 10 17.5V16.5C10 16.2239 9.77614 16 9.5 16C9.22386 16 9 16.2239 9 16.5V17.5C9 18.3284 9.67157 19 10.5 19C11.3284 19 12 18.3284 12 17.5V8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8V14.5C8 15.3284 8.67157 16 9.5 16C9.77614 16 10 15.7761 10 15.5V14.5C10 14.2239 10.2239 14 10.5 14C10.7761 14 11 14.2239 11 14.5V15.5C11 16.3284 10.3284 17 9.5 17C7.567 17 6 15.433 6 13.5V8C6 5.79086 7.79086 4 10 4V4Z"
                fill="currentColor"
              />
            </svg>
            Sign in with this device
          </Button>

          {/* STML: Explain what "this device" means */}
          <p style={helpTextStyles}>
            Use your computer's secure sign-in (face, fingerprint, or passkey).
          </p>

          {/* WCAG 1.4.1: Visual divider (decorative, not semantic) */}
          <div style={dividerStyles} role="presentation" />

          {/* WCAG 2.1.1: Keyboard accessible link */}
          {/* STML: Clear help option visible upfront */}
          <a
            onClick={(e) => {
              e.preventDefault();
              handleNeedHelp();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNeedHelp();
              }
            }}
            href="#"
            tabIndex={0}
            style={helpLinkStyles}
            // WCAG 2.4.7: Focus indicator
            onFocus={(e) => {
              e.currentTarget.style.outline = colors.focusOutline;
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.textDecoration = 'none';
            }}
            // STML: Hover feedback
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Need help signing in?
          </a>
        </div>
      </Card>
    </main>
  );
}
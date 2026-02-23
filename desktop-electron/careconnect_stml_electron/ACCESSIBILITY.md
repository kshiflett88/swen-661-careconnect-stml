# Accessibility & STML Compliance

This document details the WCAG 2.2 Level AA and STML-specific accessibility features implemented in the CareConnect desktop application.

## Overview

All screens and components are designed with two primary goals:
1. **WCAG 2.2 Level AA compliance** - Meeting international accessibility standards
2. **STML user considerations** - Optimized for users with short-term memory loss

## WCAG 2.2 AA Compliance Features

### 1. Color Contrast (WCAG 1.4.3)
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+): Minimum 3:1 contrast ratio
- All colors tested and documented in `src/constants/accessibility.ts`
- Primary blue: 8.2:1 contrast on white
- Success green: 4.6:1 contrast on white
- Danger red: 4.5:1 contrast on white

**Code location**: `src/constants/accessibility.ts` - Color palette

### 2. Touch Target Sizes (WCAG 2.5.5)
- **Minimum size**: 44×44px (WCAG requirement)
- **STML recommended**: 56×56px for primary actions
- All buttons, inputs, and interactive elements meet or exceed minimum

**Code location**: `src/constants/accessibility.ts` - Sizing constants

### 3. Keyboard Navigation (WCAG 2.1.1)
- All interactive elements accessible via keyboard
- Tab navigation through focusable elements
- Enter/Space activation for buttons and links
- Escape key closes modal dialogs

**Example**: `src/components/Button.tsx` - handleKeyDown implementation

### 4. Focus Indicators (WCAG 2.4.7)
- 3px visible focus outline on all interactive elements
- High contrast focus color (#0056b3)
- Clear visual distinction when element has focus

**Example**: All components implement onFocus/onBlur handlers

### 5. Form Labels (WCAG 3.3.2)
- All inputs programmatically associated with labels via `htmlFor`/`id`
- Labels always visible (not relying on placeholders)
- Required fields clearly marked

**Code location**: `src/components/Input.tsx`

### 6. Error Identification (WCAG 3.3.1)
- Errors identified with icon + text (not color alone)
- Error messages associated with inputs via `aria-describedby`
- `aria-invalid` attribute for screen readers

**Code location**: `src/components/Input.tsx` - Error handling

### 7. Non-Color Information (WCAG 1.4.1)
- Priority badges use color + text labels + symbols
- High: Red + "!!!" + "High Priority" label
- Medium: Yellow + "!!" + "Medium Priority" label
- Low: Blue + "!" + "Low Priority" label

**Code location**: `src/components/PriorityBadge.tsx`

### 8. Semantic HTML (WCAG 1.3.1)
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark regions: `<main>`, `<nav>`, `<header>`
- Lists use `<ul>`/`<ol>` elements
- Buttons use `<button>` (not divs/spans)

**Example**: All screen components use semantic landmarks

### 9. ARIA Labels (WCAG 4.1.2)
- Descriptive `aria-label` for screen readers
- `role` attributes for custom components
- `aria-live` regions for dynamic content

**Example**: Dashboard date/time uses `aria-live="polite"`

### 10. Confirmation Dialogs (WCAG 3.3.4)
- Destructive actions require confirmation
- Mark complete: "Are you sure?" dialog
- Delete task: "Cannot be undone" warning
- Clear cancel option always available

**Code location**: `src/components/ConfirmDialog.tsx`

## STML-Specific Features

### 1. Persistent Orientation Cues
- **Date/time always visible** at top of dashboard
- Updates every minute
- Located in consistent position

**Code location**: `src/screens/DashboardScreen.tsx` - Header section

### 2. Clear Visual Hierarchy
- Next task prominently highlighted with yellow border
- Upcoming tasks in separate section
- Completed tasks visually de-emphasized

**Code location**: Dashboard uses `variant="highlighted"` for next task card

### 3. Simplified Navigation
- Sidebar navigation with large tap targets
- Current page clearly indicated
- Emergency SOS button always accessible

**Code location**: `src/screens/DashboardScreen.tsx` - Sidebar nav

### 4. Reduced Cognitive Load
- Single primary action per screen
- Minimal choices at each step
- Clear labels and help text
- No hidden menus or complex workflows

**Example**: Welcome screen has only 2 actions: Sign In or Create Account

### 5. Confirmation for All Actions
- Prevents accidental task completion
- Prevents accidental deletion
- Clear "Go back" option in all dialogs

**Code location**: All screens use ConfirmDialog for destructive actions

### 6. Large, Readable Text
- Base font size: 16px (1rem)
- Large text: 18px (1.125rem) - WCAG "large text" threshold
- Headings: 24px, 32px, 40px
- Scales with user's text-scale preference

**Code location**: `src/constants/accessibility.ts` - Typography

### 7. Clear Visual Feedback
- Hover states on interactive elements
- Press animation on buttons
- Loading states for async actions
- Success/error messages

**Example**: Button component hover/active states

### 8. Persistent Help Text
- Input fields show helper text below label
- Not relying on tooltips or hidden help
- Plain language instructions

**Example**: Quick Add Task form help text

## Component Documentation

### Button Component
**File**: `src/components/Button.tsx`

WCAG Features:
- ✓ Keyboard accessible (native button)
- ✓ 44px minimum height
- ✓ 3px focus indicator
- ✓ Disabled state announced to screen readers
- ✓ High contrast colors (3:1+)

STML Features:
- ✓ Large touch targets (56px option)
- ✓ Clear hover feedback
- ✓ Visual press animation
- ✓ Optional full-width layout

### Input Component
**File**: `src/components/Input.tsx`

WCAG Features:
- ✓ Label programmatically associated
- ✓ Error identification with icon + text
- ✓ 48px height touch target
- ✓ 3px focus indicator
- ✓ Required fields marked

STML Features:
- ✓ Label always visible (not placeholder-only)
- ✓ Persistent help text
- ✓ Large, easy-to-read text
- ✓ Clear error messages

### Card Component
**File**: `src/components/Card.tsx`

WCAG Features:
- ✓ Keyboard accessible if interactive
- ✓ Focus indicator for clickable cards
- ✓ Semantic HTML

STML Features:
- ✓ Clear visual boundaries
- ✓ Highlighted variant for emphasis
- ✓ Adequate padding for easy reading

### PriorityBadge Component
**File**: `src/components/PriorityBadge.tsx`

WCAG Features:
- ✓ Does not rely on color alone
- ✓ Uses symbols + text + color
- ✓ High contrast text
- ✓ Screen reader labels

STML Features:
- ✓ Clear visual hierarchy
- ✓ Multiple cues for priority
- ✓ Easy-to-understand symbols

### ConfirmDialog Component
**File**: `src/components/ConfirmDialog.tsx`

WCAG Features:
- ✓ Focus trap within modal
- ✓ Escape key to close
- ✓ ARIA role="alertdialog"
- ✓ Keyboard navigation

STML Features:
- ✓ Simple yes/no choice
- ✓ Clear explanation of action
- ✓ Cancel option prominent
- ✓ Large, easy-to-read text

## Screen Documentation

### WelcomeScreen
**File**: `src/screens/WelcomeScreen.tsx`

Key Features:
- Centered card layout reduces cognitive load
- Single primary action (Sign In)
- Clear help link for assistance
- High contrast logo and text
- Semantic heading hierarchy

### DashboardScreen
**File**: `src/screens/DashboardScreen.tsx`

Key Features:
- Persistent date/time orientation
- Next task prominently highlighted
- Sidebar navigation with large targets
- Quick-add form for common tasks
- Emergency SOS always accessible

### TaskListScreen
**File**: `src/screens/TaskListScreen.tsx`

Key Features:
- List + detail panel layout
- Keyboard navigation through tasks
- Priority badges (not color-only)
- Confirmation for complete/delete
- Back navigation always visible

## Testing Checklist

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus indicator clearly visible
- [ ] Can activate all buttons with Enter/Space
- [ ] Can close dialogs with Escape

### Screen Reader
- [ ] All buttons have descriptive labels
- [ ] Form inputs announced with labels
- [ ] Error messages announced
- [ ] Priority levels announced correctly

### Color Contrast
- [ ] Text meets 4.5:1 minimum
- [ ] Large text meets 3:1 minimum
- [ ] Focus indicators meet 3:1 minimum
- [ ] Error states clearly visible

### Touch Targets
- [ ] All buttons at least 44×44px
- [ ] Primary actions use 56px height
- [ ] Adequate spacing between targets
- [ ] No overlapping touch areas

### STML Usability
- [ ] Date/time always visible
- [ ] Back navigation always present
- [ ] Confirmation for all destructive actions
- [ ] Clear primary action on each screen
- [ ] Help text visible without interaction

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [React Accessibility Docs](https://react.dev/learn/accessibility)
- [Electron Accessibility](https://www.electronjs.org/docs/latest/tutorial/accessibility)

## Future Improvements

1. Add screen reader testing with NVDA/JAWS
2. Implement reduced motion preferences
3. Add high contrast mode option
4. Support voice control/dictation
5. Add more orientation cues (breadcrumbs, progress indicators)
6. Implement persistent task notifications
7. Add undo functionality for destructive actions

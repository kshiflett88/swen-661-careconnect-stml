# CareConnect React

CareConnect is a React frontend prototype for an accessible care-support application. It is designed around a simple, senior-friendly experience for managing tasks, reminders, caregiver support, emergency actions, and basic settings.

This project uses:

- `React 19` + `Vite 8` for the app
- `React Router` (HashRouter) for client-side routing
- `Tailwind CSS 4` for styling
- `Jest 30` + `React Testing Library` for unit and component tests
- `Playwright` for end-to-end tests across Chromium, Firefox, and Safari compatibility via WebKit

## Live Demo

The app is deployed to GitHub Pages at:

```text
https://kshiflett88.github.io/swen-661-careconnect-stml/
```

## What The App Does

The current prototype includes:

- A sign-in screen with a help path for caregiver assistance
- A dashboard with mood check-in, next tasks, upcoming tasks, and quick add
- A tasks area with search, filtering, completion, edit, and delete flows
- Success banner notifications on task add and delete
- A contacts area with caregiver, family, doctor, and emergency support actions
- A settings area for display, reminder, support, and sign-out options
- URL-based navigation between views (Dashboard, Tasks, Contacts, Settings)

The app is a Progressive Web App (PWA) with a manifest, service worker, and installable icons (192×192 and 512×512).

The app is currently frontend-only. It does not use a backend API or persistent database. Most application data is stored in React state for demonstration and testing purposes.

## Prerequisites

- **Node.js** >= 20 (tested with v20.19.6)
- **npm** >= 10

## Cloning and Setup

This React app lives inside a subfolder of a larger repository. To clone and get running:

```bash
git clone https://github.com/kshiflett88/swen-661-careconnect-stml.git
cd swen-661-careconnect-stml/react/careconnect_stml_react
npm install
```

If you plan to run Playwright end-to-end tests, also install browser binaries:

```bash
npx playwright install
```

## Running the App

Start the local development server:

```bash
npm run dev
```

Vite will serve the app locally, typically at:

```text
http://localhost:5173
```

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project Structure

Key folders and files:

- `src/App.jsx` — main application component with React Router routes and state management
- `src/main.jsx` — app entry point; wraps `<App />` in `HashRouter`
- `src/components/` — UI components, view-level components, and modals
- `src/components/__tests__/` — component tests for views, modals, and user interaction flows
- `src/unit/__tests__/` — unit tests for small isolated UI building blocks
- `src/utils/` — utility functions (`taskUtils.js`)
- `src/utils/__tests__/` — unit tests for utility functions
- `src/accessibility/__tests__/` — automated accessibility tests (axe, keyboard, focus)
- `src/test/` — Jest setup helpers
- `e2e/` — Playwright end-to-end tests
- `public/` — static assets: `manifest.json`, `sw.js`, icons, screenshots
- `playwright.config.js` — Playwright browser and web server configuration
- `jest.config.cjs` — Jest configuration
- `babel.config.cjs` — Babel configuration for Jest
- `vite.config.js` — Vite build configuration (includes `base` path for GitHub Pages)

## Available Scripts

Development and build:

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

Deployment:

- `npm run deploy` — build and deploy to the `gh-pages` branch (runs `predeploy` automatically)

Jest testing:

- `npm test` — run the full Jest suite
- `npm run test:watch` — run Jest in watch mode
- `npm run test:coverage` — generate coverage for the full Jest suite
- `npm run test:a11y` — run dedicated automated accessibility tests
- `npm run test:a11y:coverage` — generate coverage for only accessibility tests
- `npm run test:unit` — run only unit tests
- `npm run test:unit:coverage` — generate coverage for only unit tests
- `npm run test:component` — run only component tests
- `npm run test:component:coverage` — generate coverage for only component tests

Playwright end-to-end testing:

- `npm run test:e2e` — run all Playwright tests
- `npm run test:e2e:a11y` — run browser-based accessibility smoke tests
- `npm run test:e2e:headed` — run Playwright in headed mode
- `npm run test:e2e:ui` — open the Playwright UI runner

## Running Tests

To run all Jest tests (unit + component + accessibility):

```bash
npm test
```

To run only one test layer:

```bash
npm run test:unit        # unit tests only
npm run test:component   # component tests only
npm run test:a11y        # accessibility tests only
```

To run Playwright end-to-end tests (requires `npx playwright install` first):

```bash
npm run test:e2e
```

## Test Coverage

The project includes three testing layers:

- `Unit tests` with Jest
- `Component tests` with React Testing Library
- `End-to-end tests` with Playwright

It also includes a dedicated automated accessibility test layer built with:

- `Jest`
- `React Testing Library`
- `jest-axe`

Current Jest split:

- Unit tests are located in `src/unit/__tests__/` and `src/utils/__tests__/`
- Component tests are located in `src/components/__tests__/`
- Accessibility tests are located in `src/accessibility/__tests__/`

To generate the full Jest coverage report:

```bash
npm run test:coverage
```

Coverage output is written to:

```text
coverage/lcov-report/index.html
```

To review Playwright execution results:

```bash
npm run test:e2e
```

Playwright HTML results are written to:

```text
playwright-report/index.html
```

## Current Unit Test Scope

The dedicated unit layer currently covers:

- `Button`
- `Card`
- `Input`
- `PriorityBadge`
- `taskUtils`

These tests verify smaller isolated behaviors such as formatting, rendering, props, and callback handling.

## Current Component Test Scope

The component layer currently covers:

- `App`
- `DashboardView`
- `TasksView`
- `ContactsView`
- `SettingsView`
- sign-in and help flows
- dialogs, context menus, and task modals

These tests validate user-facing UI behavior and state transitions in a jsdom environment.

## Current Accessibility Test Scope

The dedicated accessibility layer covers:

- automated `axe` checks for sign-in, help, dialog, modal, menu, and settings flows
- keyboard-only navigation for sign-in and help flows
- focus trapping and `Escape` handling for task modals
- keyboard navigation for the task context menu
- WCAG 2.1 baseline checks for minimum target sizes and contrast ratios
- STML-oriented guardrails for larger touch targets on primary actions
- browser-based Playwright accessibility smoke checks across Chromium, Firefox, and Safari via WebKit
- responsive large-text and high-contrast checks on mobile-sized viewports
- real-browser ARIA state checks for navigation and search controls

Run this layer with:

```bash
npm run test:a11y
```

This accessibility suite is intended to catch obvious regressions early, especially around keyboard access, dialog behavior, and high-clarity interaction patterns that matter for patients with STML.

For browser-level accessibility smoke checks, run:

```bash
npm run test:e2e:a11y
```

## Current E2E Flows

The Playwright suite currently covers these critical flows:

- Help flow for contacting a caregiver from sign-in
- Adding a task and searching for it
- Completing a task and undoing completion
- Visiting contacts, using emergency confirmation, opening settings, and signing out

These run across:

- `Chromium`
- `Firefox`
- `Safari (via Playwright WebKit)`

Note:

- Playwright does not launch the native Safari application on this setup.
- Instead, Safari coverage is represented through Playwright's `WebKit` browser engine, which is the standard Playwright approach for Safari-compatible cross-browser testing.

## Notes

- The app is a PWA with a `manifest.json`, service worker (`sw.js`), and installable icons.
- Client-side routing uses `HashRouter` for GitHub Pages compatibility (no server-side routing required).
- The Vite `base` path is set to `/swen-661-careconnect-stml/` for the GitHub Pages deployment.
- The project still contains prototype data and placeholder interactions in a few areas.
- The UI is intentionally testable through accessible labels and roles where possible.

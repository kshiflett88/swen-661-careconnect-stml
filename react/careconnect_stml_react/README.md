# CareConnect React

CareConnect is a React frontend prototype for an accessible care-support application. It is designed around a simple, senior-friendly experience for managing tasks, reminders, caregiver support, emergency actions, and basic settings.

This project uses:

- `React` + `Vite` for the app
- `Jest` + `React Testing Library` for unit and component tests
- `Playwright` for end-to-end tests across Chromium, Firefox, and WebKit

## What The App Does

The current prototype includes:

- A sign-in screen with a help path for caregiver assistance
- A dashboard with mood check-in, next tasks, upcoming tasks, and quick add
- A tasks area with search, filtering, completion, edit, and delete flows
- A contacts area with caregiver, family, doctor, and emergency support actions
- A settings area for display, reminder, support, and sign-out options

The app is currently frontend-only. It does not use a backend API or persistent database. Most application data is stored in React state for demonstration and testing purposes.

## Project Structure

Key folders and files:

- `src/App.jsx` - main application flow and screen switching
- `src/components/` - UI components and view-level components
- `src/components/__tests__/` - Jest component and unit tests
- `src/test/` - Jest setup helpers
- `e2e/` - Playwright end-to-end tests
- `playwright.config.js` - Playwright browser and web server configuration
- `jest.config.cjs` - Jest configuration
- `babel.config.cjs` - Babel configuration for Jest

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

By default, Vite will serve the app locally, typically at:

```text
http://localhost:5173
```

## Available Scripts

Development and build:

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

Jest unit and component testing:

- `npm test` - run all Jest tests once
- `npm run test:watch` - run Jest in watch mode
- `npm run test:coverage` - generate a Jest coverage report

Playwright end-to-end testing:

- `npm run test:e2e` - run all Playwright tests
- `npm run test:e2e:headed` - run Playwright in headed mode
- `npm run test:e2e:ui` - open the Playwright UI runner

## Test Coverage

The project includes three testing layers:

- `Unit tests` with Jest
- `Component tests` with React Testing Library
- `End-to-end tests` with Playwright

To generate the Jest coverage report:

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

- The app registers a simple service worker for placeholder offline behavior.
- The project still contains prototype data and placeholder interactions in a few areas.
- The UI is intentionally testable through accessible labels and roles where possible.

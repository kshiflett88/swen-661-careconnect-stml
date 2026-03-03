# CareConnect STML Desktop (Electron)

Electron desktop shell for the CareConnect STML experience.

## Scripts

- `npm run dev` starts Vite, watches Electron TypeScript, and launches Electron.
- `npm run build` builds renderer + Electron main/preload output.
- `npm run build:electron` compiles `electron/main.ts` and `electron/preload.ts` into `dist-electron` and renames outputs to `.cjs`.
- `npm run build:renderer` builds the renderer into `dist`.
- `npm run dist` creates packaged app artifacts via Electron Builder.
- `npm run dist:win` creates a Windows NSIS installer build to `release/`.

## Packaging notes (Windows)

- Electron Builder is configured in `package.json` under the `build` field.
- Output directory is `release/`.
- If packaging fails with symlink privilege errors from `winCodeSign`, run terminal as Administrator or enable Windows Developer Mode, then rerun `npm run dist:win`.

## Build & Package (Submission)

Use this exact sequence for a clean, reproducible Windows package build:

1. Install dependencies:
	- `npm install`
2. (Optional) Run unit/integration tests:
	- `npm run test:unit`
3. Build renderer + Electron main/preload:
	- `npm run build`
4. Create Windows installer artifacts:
	- `npm run dist:win`

Expected output files/folders:
- `release/CareConnect STML Setup 0.0.0.exe` (Windows installer)
- `release/win-unpacked/` (unpacked app)
- `release/desktop-electron-0.0.0-x64.nsis.7z` (NSIS package artifact)

## Runtime behavior

- In development, Electron loads `VITE_DEV_SERVER_URL`.
- In production/package mode, Electron loads `dist/index.html`.
- Electron loads the preload from `dist-electron/preload.cjs`.

## Desktop menu + shortcuts

Top-level app menus are:
- File
- Edit
- View
- Help

Current shortcut mappings:
- `Ctrl+1` / `Cmd+1`: Dashboard (View → Navigate)
- `Ctrl+2` / `Cmd+2`: Tasks (View → Navigate)
- `Ctrl+3` / `Cmd+3`: Contacts (View → Navigate)
- `Ctrl+E` / `Cmd+E`: Emergency SOS (File, and View → Navigate)
- `Ctrl+Plus` / `Cmd+Plus`: Increase text size (View → Accessibility)
- `Ctrl+-` / `Cmd+-`: Decrease text size (View → Accessibility)
- `Ctrl+0` / `Cmd+0`: Reset text size (View → Accessibility)

Shortcuts are disabled on Welcome and Sign-In Help screens.

## Testing

- `npm test` runs unit tests followed by E2E tests.
- `npm run test:unit` runs Jest unit and integration tests.
- `npm run test:unit:watch` runs Jest in watch mode.
- `npm run test:a11y` runs automated accessibility checks (axe + keyboard navigation tests).
- `npm run test:coverage` runs Jest with HTML coverage output (`coverage-jest/lcov-report/index.html`).
- `npm run test:e2e` runs Playwright tests (placeholder setup).

### Current UI coverage

- Component and view tests live under `src/__tests__/` and cover rendering, interaction flows, and accessibility semantics.
- App-level and integration scenarios are also covered in `tests/jest/`.

## Accessibility

- Full accessibility requirements and validation checklist are in [ACCESSIBILITY.md](ACCESSIBILITY.md).
- Automated checks are covered by Jest tests (including `src/__tests__/Accessibility.automated.test.tsx`).
- Manual validation still required for:
	- Screen reader behavior (NVDA on Windows / VoiceOver on macOS)
	- OS-level contrast modes (Windows High Contrast / macOS Increase Contrast)

## Notes

- Generated output folders (`dist`, `dist-electron`, `coverage-jest`, `test-results`) should not be committed.
- Renderer app entry is `src/main.tsx` and `src/App.tsx`.

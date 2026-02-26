# CareConnect STML Desktop (Electron)

Electron desktop shell for the CareConnect STML experience.

## Scripts

- `npm run dev` starts Vite, watches Electron TypeScript, and launches Electron.
- `npm run build:electron` compiles `electron/main.ts` and `electron/preload.ts` into `dist-electron` and renames outputs to `.cjs`.
- `npm run vite -- build` builds the renderer into `dist`.

## Runtime behavior

- In development, Electron loads `VITE_DEV_SERVER_URL`.
- In production/package mode, Electron loads `dist/index.html`.
- Electron loads the preload from `dist-electron/preload.cjs`.

## Navigation shortcuts

- `Ctrl+1` / `Cmd+1`: Dashboard
- `Ctrl+2` / `Cmd+2`: Tasks
- `Ctrl+3` / `Cmd+3`: Health Log
- `Ctrl+4` / `Cmd+4`: Contacts
- `Ctrl+5` / `Cmd+5`: Profile
- `Ctrl+E` / `Cmd+E`: Emergency SOS
- Shortcuts are disabled on Welcome and Sign-In Help screens.

## Testing

- `npm test` runs unit tests followed by E2E tests.
- `npm run test:unit` runs Jest unit and integration tests.
- `npm run test:unit:watch` runs Jest in watch mode.
- `npm run test:coverage` runs Jest with HTML coverage output (`coverage-jest/lcov-report/index.html`).
- `npm run test:e2e` runs Playwright tests (placeholder setup).

## Notes

- Generated output folders (`dist`, `dist-electron`) should not be committed.
- Renderer app entry is `src/main.tsx` and `src/App.tsx`.

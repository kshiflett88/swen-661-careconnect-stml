<!-- Copilot / AI agent instructions for CareConnect STML Flutter app -->
# Copilot instructions — careconnect_stml_flutter

Purpose: provide concise, project-specific guidance so an AI coding agent can be productive immediately.

- **Big picture**: This is a Flutter app (Material) that uses `go_router` for navigation. The app entry points are [lib/main.dart](lib/main.dart) and [lib/app/app.dart](lib/app/app.dart) which configure a `MaterialApp.router` with `createRouter()` from [lib/app/router.dart](lib/app/router.dart).

- **Routing & navigation**: Routes and canonical paths live in `AppRoutes` in [lib/app/router.dart](lib/app/router.dart). Screens call `context.go(...)` / `context.goNamed(...)` (see many examples in `lib/screens/*`). Be careful to:
  - Prefer `go_router` APIs (named routes with pathParameters) when present.
  - Match any hard-coded route constants used in screens (e.g. `kHomeRouteName` / `kHomePath` in [lib/screens/tasks/task_list_screen.dart](lib/screens/tasks/task_list_screen.dart)).

- **Local storage pattern**: Lightweight persistence uses `shared_preferences` via small store classes under [lib/shared/storage/](lib/shared/storage/). Examples:
  - `TaskStatusStore` ([lib/shared/storage/task_status_store.dart](lib/shared/storage/task_status_store.dart)) stores a JSON map under a single key.
  - `HealthLogStore` ([lib/shared/storage/health_log_store.dart](lib/shared/storage/health_log_store.dart)) stores a JSON list of model entries.
  - Follow the readAll/writeAll pattern when modifying or adding stores.

- **Data & models**: Sample/mock data lives in [lib/data/] and [lib/shared/mocks/]. Models are under [lib/data/models/] and [lib/models/]. When adding fields, ensure JSON (de)serialization matches the existing `fromJson` / `toJson` helpers used by stores.

- **UI conventions**:
  - Accessibility-forward UI: large tap targets, high-contrast colors—see [lib/screens/tasks/task_list_screen.dart](lib/screens/tasks/task_list_screen.dart) for exemplar patterns.
  - The app uses a central theme in [lib/shared/theme/app_theme.dart] and color helpers in [lib/shared/theme/app_colors.dart]. Reuse these for visual consistency.

- **Dependencies & project set-up**:
  - Primary commands: `flutter pub get`, `flutter analyze`, `flutter run -d <device>`, `flutter build apk` (Android), `flutter build ios` (macOS required).
  - Confirm `shared_preferences` is available at runtime — note it is imported in storage files; verify `pubspec.yaml` ([pubspec.yaml](pubspec.yaml)) lists it in `dependencies` (if missing, use `flutter pub add shared_preferences`).
  - Lints are enabled via [analysis_options.yaml](analysis_options.yaml); follow those rules in code changes.

- **Platform / native integration**:
  - Android: native config in `android/` (gradle Kotlin DSL). iOS: Xcode project under `ios/Runner`.
  - Deep links or platform-specific build flags may be in `android/app` or `ios/Runner`; inspect those when changing navigation or app metadata.

- **Testing & debugging**:
  - No app tests are present by default — run `flutter test` to discover or add tests under `test/`.
  - Use `flutter run` with device emulators or VS Code/Android Studio for hot reload and DevTools. For platform builds use the Gradle wrapper in `android/`.

- **Common code patterns to follow**:
  - Small, focused store classes for persistence (use `SharedPreferences.getInstance()` inside methods like existing stores).
  - Single-responsibility screens; navigation is centralized in `AppRoutes`.
  - If adding a new screen, register its route in [lib/app/router.dart](lib/app/router.dart) and add any required route constants.

- **Files to inspect first when asked to modify behavior**:
  - App entry & router: [lib/main.dart](lib/main.dart), [lib/app/app.dart](lib/app/app.dart), [lib/app/router.dart](lib/app/router.dart)
  - Storage: [lib/shared/storage/*](lib/shared/storage/)
  - The Task example (complete flow): [lib/screens/tasks/task_list_screen.dart](lib/screens/tasks/task_list_screen.dart) and [lib/screens/tasks/task_detail_screen.dart](lib/screens/tasks/task_detail_screen.dart)

If anything here is unclear or you want more detail (examples of adding a route, writing a new store, or updating pubspec), tell me which area to expand.

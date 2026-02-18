# CareConnect – Guided STML Companion UI

## Course
SWEN 661 – User Interface Implementation

## Team 9
- Kodi Sarlett
- Mawuko Kpelevi
- Chastity Sapp

## Documentation
- Team Charter: [Charter Doc](https://docs.google.com/document/d/1QjEfwAfV8ls6wHnBH4sZOfA6LfdS70kC1miuLZYtGB8/edit?usp=sharing)
- Project Proposal: [Proposal Doc](https://docs.google.com/document/d/1YiSkQbBFmEWHPHrosQwcT2dPypBt9YZz5YzO3e6OdBc/edit?usp=sharing)

## Project Description
CareConnect is a Flutter-based mobile application redesigned to support care recipients with Short-Term Memory Loss (STML).
The application emphasizes:
- Guided, step-by-step workflows
- Persistent orientation cues (date, screen context, progress indicators)
- Reduced cognitive load through large tap targets and simplified layouts
- Accessibility-first design using Flutter Semantics
- Local persistence for task completion and health logging

The goal is to help users confidently complete daily tasks, log health information, and access emergency assistance with minimal confusion or memory reliance.

## Implemented Core Screens
- Welcome / Login
- Sign-In Help
- Patient Dashboard
- Task List
- Task Detail (Step-by-Step Tasks)
- Health Logging (Mood Tracking)
- Emergency (SOS)
- Profile Settings

## Architecture & Technologies
- **Flutter**
- **GoRouter** (Navigator 2.0 style routing)
- **SharedPreferences** for local data persistence
- **In-memory stores** for testability
- **Widget + Unit Testing**
- Accessibility via **Semantics widgets**

## Accessibility (WCAG 2.1 Level AA Compliance)

CareConnect includes both Flutter and React Native implementations. Accessibility compliance is documented separately for each platform.

### Flutter Implementation
The Flutter application was implemented to align with WCAG 2.1 Level AA standards. Accessibility considerations were integrated into semantic structure, keyboard navigation, layout responsiveness, and automated testing.

#### Accessibility guideline tests (Flutter)
```bash
flutter test test/screens/accessibility_guidelines_test.dart
```

#### Automated Integration tests (Flutter)
```bash
flutter test integration_test
```

#### Semantic Structure and Screen Reader Support
Flutter’s Semantics system is used to expose UI elements to assistive technologies.
- Interactive elements are explicitly identified as buttons or input fields.
- Meaningful labels and hints are provided for screen readers.
- Enabled and disabled states are exposed appropriately.
- Dialogs and confirmation flows are semantically structured.
- Orientation cues (screen title, context indicators) are accessible to assistive technologies.

#### Semantic behavior is validated using:
- Flutter semantics inspection tools
- Widget-level semantic tests
- Manual verification with screen reader tools

Automated tests are located in:
```bash
test/screens/accessibility/
```
#### Keyboard Accessibility
The Flutter implementation supports full keyboard interaction.
- Logical focus traversal is defined using FocusTraversalGroup.
- Explicit focus order is applied where necessary.
- Interactive elements respond to:
    - Tab / Shift + Tab
    - Enter
    - Space
- Dialog actions are keyboard accessible.
Keyboard validation tests are located in:
```bash
test/screens/keyboard/
```

#### Touch Target Compliance
All interactive controls meet WCAG touch target requirements.
- Minimum interactive size: 48 x 48 logical pixels
- Primary action buttons use a minimum height of 56 logical pixels.
- Emergency and task-related controls exceed minimum sizing requirements.
Touch target validation tests are located in:
```bash
test/screens/wcag/*touch_targets_test.dart
```

#### Text Scaling Support
The Flutter UI supports dynamic text scaling up to 200% without layout breakage.
- Flexible layout widgets prevent overflow.
- Text containers are not constrained by fixed heights.
- Controls remain visible and usable at maximum scaling.
Text scaling validation tests are located in:
```bash
test/screens/wcag/*text_scaling_test.dart
```

#### Color Contrast
Theme colors are selected to meet WCAG contrast minimum requirements:
- 4.5:1 ratio for normal text
- 3:1 ratio for large text

Contrast validation tests are located in:
```bash
test/screens/wcag/*contrast_test.dart
```

#### Automated Accessibility Validation and Coverage
Accessibility validation is integrated into the automated test suite.
- Semantic role verification
- Keyboard interaction validation
- Touch target dimension verification
- Text scaling validation
Contrast checks (where applicable)
Test coverage is generated using:
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

Coverage output will be generated in: coverage/html/index.html

Accessibility-related screens maintain high line coverage to ensure compliance behaviors are exercised during automated testing.

#### Automated  Integration Testing (Flutter Integration Test)
We validate multi-screen navigation and full flows using Flutter integration tests.
Example integration flow:
- Login → Dashboard
- Dashboard → Health Log → Save
- Dashboard → Schedule → Task Detail → Complete
- Dashboard → Profile → Accessibility (View Only)
- Dashboard → Emergency → SOS → Confirm

Run integration tests

```bash
flutter test integration_test
```

#### End-to-End (E2E) Testing with Maestro

We use Maestro for device-level UI automation testing.
Maestro validates:
- Real device/emulator interaction
- Accessibility label correctness
- Scroll behavior
- Multi-step task progression
- Emergency flow confirmation dialogs
- Profile and Accessibility navigation
Health Log submission

Run all Maestro flows
```bash
maestro test maestro/flows
```

Generate JUnit Report (for CI / proof)
```bash
maestro test maestro/flows --format junit --output maestro-report.xml
```

This produces:
maestro-report.xml

Recording E2E Test Execution 

To record the full Maestro run:

Step 1 — Start screen recording
```bash
adb shell screenrecord /sdcard/maestro_run.mp4
```
Step 2 — Run Maestro tests (in another terminal)
```bash
maestro test maestro/flows --format junit --output maestro-report.xml
```
Step 3 — Stop recording (Ctrl+C)
Step 4 — Pull the video to your machine
```bash
adb pull /sdcard/maestro_run.mp4 .
```
This generates:

🎥 maestro_run.mp4

📄 maestro-report.xml

These artifacts provide proof of E2E execution.

### React Native Implementation

[TO DO]


## Setup Instructions
Follow these steps to run the CareConnect Flutter application locally.

### Prerequisites
- git
- Flutter SDK installed
- Android Studio + Android SDK
- Android Emulator or physical device

### Install Dependencies
From the project root (where `pubspec.yaml` is located):

```bash
flutter pub get
```

### Step 1: Clone the Repository
Open a terminal (Command Prompt, PowerShell, or Terminal) and run:
```bash
git clone <REPO_URL>
```
Navigate into the project directory:
```bash
cd careconnect_stml_flutter
```
### Step 2: Install Dependencies
Fetch all required Flutter packages:
```bash
flutter pub get
```

### Step 3: Run the Application
**Option A: Run on Android Emulator**
1. Open Android Studio
2. Launch an Android Emulator from Device Manager
3. Run:
```bash
flutter run
```
**Option B: Run on Physical Android Device**
1. Enable Developer Mode and USB Debugging on the device
2. Connect the device via USB
3. Run:
```bash
flutter run
```

### Step 4: Build APK (Required for Submission)
Generate the Android build artifact:
```bash
flutter build apk
```
The APK will be generated at:
```bash
build/app/outputs/flutter-apk/app-release.apk
```

**Troubleshooting**
- If dependencies fail:
```bash
flutter clean
flutter pub get
```
- If no device is detected:
```bash
flutter devices
```
- Ensure Flutter is on the stable channel:
```bash
flutter channel stable
flutter upgrade
```

### How to Run the App
Have your Android emulator running then use the command:
```bash
flutter run
```

### How to test and test coverage
To run tests:
```bash
flutter test
```
To run test coverage:
```bash
flutter test --coverage
```
## Known Issues / Limitations
- Task data currently uses mock data for predictability and testing.
- Local persistence uses SharedPreferences and is not designed for multi-user or cloud sync scenarios.

## Team Contributions
**Kodi Sarlett**
- Implemented screens: Welcome/sign in, Help sign in, and Patient Dashboard
- Integrated application-wide navigation using GoRouter
- Implemented shared data storage patterns (SharedPreferences + in-memory stores)
- Assisted with debugging widget and unit tests across features
- Generated and verified test coverage (60%+ requirement)

**Kpelevi Mawuko**
- Implemented Health Logging screen with STML-focused UX design
- Developed Task List and Task Detail screens with step-by-step workflows
- Applied consistent styling and accessibility considerations
- Wrote widget and unit tests for task and health logging features
- Collaborated on UI refinements and test validation

**Chastity Sapp**
- Implemented Emergency (SOS) screen with confirmation flow
- Developed Profile Settings screen functionality
- Applied accessibility-aware styling and layout consistency
- Wrote widget tests for SOS and Profile Settings screens
- Assisted with UI validation and user flow testing

## AI Usage Summary
AI tools (ChatGPT) were used to assist with:
- Debugging Flutter widget and navigation tests
- Generating widget and unit test cases
- Refactoring code for improved testability
- Writing and refining documentation
- Coverage generation and Windows tooling troubleshooting

All AI-assisted code was reviewed, tested, and validated manually.

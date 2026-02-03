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

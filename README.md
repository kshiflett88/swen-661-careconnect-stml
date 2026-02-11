# CareConnect – Guided STML Companion UI (React Native)

## Course  
**SWEN 661 – User Interface Implementation**

## Team 9
- Kodi Sarlett  
- Mawuko Kpelevi  
- Chastity Sapp  

## Documentation
- Team Charter: [Charter Doc](https://docs.google.com/document/d/1QjEfwAfV8ls6wHnBH4sZOfA6LfdS70kC1miuLZYtGB8/edit?usp=sharing)  
- Project Proposal: [Proposal Doc](https://docs.google.com/document/d/1YiSkQbBFmEWHPHrosQwcT2dPypBt9YZz5YzO3e6OdBc/edit?usp=sharing)

---

# Project Description

CareConnect is a **React Native (Expo-based)** mobile application designed to support care recipients with Short-Term Memory Loss (STML).

The application emphasizes:

- Guided, step-by-step workflows  
- Persistent orientation cues (date, screen context, progress indicators)  
- Reduced cognitive load through large tap targets and simplified layouts  
- Accessibility-first design using React Native accessibility props  
- Local persistence for task completion and health logging  

The goal is to help users confidently complete daily tasks, log health information, and access emergency assistance with minimal confusion or memory reliance.

---

# Implemented Core Screens

- Welcome / Login  
- Sign-In Help  
- Patient Dashboard  
- Task List  
- Task Detail (Step-by-Step Tasks)  
- Health Logging (Mood Tracking)  
- Emergency (SOS)  
- Profile Settings  

---

# Architecture & Technologies

## Frontend

- **React Native (Expo SDK 54)**
- **React Navigation (Native Stack)**
- **AsyncStorage** for local persistence
- In-memory stores for testability
- **Jest** + **@testing-library/react-native**
- Accessibility via:
  - `accessibilityLabel`
  - `accessibilityRole`
  - `accessibilityHint`
  - Large tap targets and simplified layouts

## Mobile Tooling

- Android Studio  
- Android Emulator  
- Node.js (LTS recommended)  
- npm  

## Version Control

- Git  
- GitHub  

---

# Setup Instructions (React Native Version)

This folder contains the **React Native implementation** of CareConnect.

---

## Prerequisites

- Node.js (LTS recommended)
- npm
- Android Studio + Android SDK
- Android Emulator or physical Android device
- (Optional macOS only) Xcode for iOS
- Expo CLI (installed automatically via project scripts)

---

### Step 1: Clone the Repository
Open a terminal (Command Prompt, PowerShell, or Terminal) and run:
```bash
git clone <REPO_URL>
```
Navigate into the project directory:
```bash
cd careconnect_stml_rn
```
### Step 2: Install Dependencies
Fetch all required Flutter packages:
```bash
npm install
```

### Step 3: Run the Application
**Option A: Run on Android Emulator**
1. Open Android Studio
2. Launch an Android Emulator from Device Manager
3. Run:
```bash
npm start
```
4. Choose Android option, in terminal press:
```bash
a
```

**Option B: Run on Physical Android Device**
1. Enable Developer Mode and USB Debugging on the device
2. Connect the device via USB
3. Run:
```bash
npm run android
```

### How to test and test coverage
To run tests:
```bash
npm test
```
To run test coverage:
```bash
npm run test:coverage
```
This generates:
```bash
coverage/
├── lcov-report/
│   └── index.html   ← Open in browser
└── lcov.info        ← LCOV file for submission
```
---

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
- Assisted with UI validation and user flow testing

## AI Usage Summary
AI tools (ChatGPT) were used to assist with:
- Debugging Flutter widget and navigation tests
- Generating widget and unit test cases
- Refactoring code for improved testability
- Writing and refining documentation
- Coverage generation and Windows tooling troubleshooting

All AI-assisted code was reviewed, tested, and validated manually.

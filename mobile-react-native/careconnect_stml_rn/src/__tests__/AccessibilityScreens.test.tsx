import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { renderWithNav } from '../test-utils/renderWithNav';
import { Routes } from '../navigation/routes';

import WelcomeLoginScreen from '../screens/Welcome/WelcomeLoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import EmergencyScreen from '../screens/Emergency/EmergencyScreen';
import HowIFeelTodayScreen from '../screens/HealthLogging/HealthLoggingScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const StubScreen = () => <Text>Stub</Text>;

describe('React Native accessibility checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-16T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Welcome screen exposes accessible header and actions', () => {
    const { getByRole } = renderWithNav(Routes.WelcomeLogin, {
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
      [Routes.Dashboard]: StubScreen,
      [Routes.SignInHelp]: StubScreen,
    });

    expect(getByRole('header', { name: /Access CareConnect/i })).toBeTruthy();
    expect(getByRole('button', { name: /Sign in with Face ID/i })).toBeTruthy();
    expect(getByRole('button', { name: /I am a caregiver setup/i })).toBeTruthy();
    expect(getByRole('button', { name: /I need help signing in/i })).toBeTruthy();
  });

  it('Dashboard screen exposes date header and key action buttons', async () => {
    const { getByRole, getByLabelText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.Profile]: StubScreen,
      [Routes.HealthLogging]: StubScreen,
      [Routes.TaskDetail]: StubScreen,
      [Routes.TaskList]: StubScreen,
      [Routes.SignInHelp]: StubScreen,
      [Routes.Emergency]: StubScreen,
    });

    await waitFor(() => {
      expect(getByRole('header', { name: /Today:/i })).toBeTruthy();
    });

    expect(getByLabelText(/You are on Home/i)).toBeTruthy();
    expect(getByRole('button', { name: /Emergency help/i })).toBeTruthy();
    expect(getByRole('button', { name: /Messages/i })).toBeTruthy();
    expect(getByRole('button', { name: /Schedule/i })).toBeTruthy();
  });

  it('Emergency flow exposes accessible SOS and confirmation actions', () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByRole, getByTestId } = render(<EmergencyScreen navigation={navigation as any} />);

    expect(getByRole('header', { name: /Today:/i })).toBeTruthy();
    expect(getByRole('button', { name: /SOS emergency alert/i })).toBeTruthy();

    fireEvent.press(getByTestId('sos_button'));

    expect(getByRole('button', { name: /Yes, send emergency alert/i })).toBeTruthy();
    expect(getByRole('button', { name: /^Cancel$/i })).toBeTruthy();
  });

  it('Health logging exposes radio semantics and selected accessibility state', () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByRole, getByLabelText } = render(<HowIFeelTodayScreen navigation={navigation as any} />);

    const happyRadio = getByRole('radio', { name: /Happy/i });
    expect(happyRadio).toHaveAccessibilityState({ selected: false });

    fireEvent.press(happyRadio);
    expect(happyRadio).toHaveAccessibilityState({ selected: true });

    expect(getByLabelText('Optional note')).toBeTruthy();
    expect(getByRole('button', { name: /^Save$/i })).toBeTruthy();
  });

  it('Task detail exposes progressbar and accessible return action', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };

    const { getByRole } = render(
      <TaskDetailScreen navigation={navigation as any} route={{ params: { id: '1' } }} />
    );

    await waitFor(() => {
      expect(getByRole('header', { name: /Today:/i })).toBeTruthy();
    });

    expect(getByRole('progressbar', { name: /Progress: step 1 of/i })).toBeTruthy();
    expect(getByRole('button', { name: /Return to tasks/i })).toBeTruthy();
  });

  it('Profile screen exposes caregiver and contact info with readable labels', () => {
    const { getByLabelText } = renderWithNav(Routes.Profile, {
      [Routes.Profile]: ProfileScreen,
      [Routes.Dashboard]: StubScreen,
      [Routes.AccessibilitySettings]: StubScreen,
      [Routes.WelcomeLogin]: StubScreen,
    });

    expect(getByLabelText(/You are on: My Profile/i)).toBeTruthy();
    expect(getByLabelText(/^Primary Caregiver:/i)).toBeTruthy();
    expect(getByLabelText(/^Phone number:/i)).toBeTruthy();
    expect(getByLabelText(/^Email:/i)).toBeTruthy();
  });
});

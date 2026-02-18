import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import ProfileScreen from '../screens/Profile/ProfileScreen';
import { renderWithNav } from '../test-utils/renderWithNav';
import { Routes } from '../navigation/routes';

describe('ProfileScreen', () => {
  it('renders profile and can navigate to accessibility setup', async () => {
    const Accessibility = () => null;

    const { findByTestId, findByText } = renderWithNav(Routes.Profile, {
      [Routes.Profile]: ProfileScreen,
      [Routes.AccessibilitySettings]: Accessibility,
    });

    expect(await findByText(/Your Information/i)).toBeTruthy();
    fireEvent.press(await findByTestId('accessibility_setup_button'));
  });

  it('back to home navigates to dashboard', async () => {
    const Dashboard = () => null;

    const { findByTestId } = renderWithNav(Routes.Profile, {
      [Routes.Profile]: ProfileScreen,
      [Routes.Dashboard]: Dashboard,
    });

    fireEvent.press(await findByTestId('back_to_home_button'));
  });

  it('sign out navigates to welcome screen', async () => {
    const Welcome = () => null;

    const { findByTestId } = renderWithNav(Routes.Profile, {
        [Routes.Profile]: ProfileScreen,
        [Routes.WelcomeLogin]: Welcome,
    });

    fireEvent.press(await findByTestId('sign_out_button'));
   });
});

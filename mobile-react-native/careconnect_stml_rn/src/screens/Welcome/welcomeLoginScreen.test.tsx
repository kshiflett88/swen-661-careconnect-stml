import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import WelcomeLoginScreen from './WelcomeLoginScreen';
import DashboardScreen from '../Dashboard/DashboardScreen';
import SignInHelpScreen from '../SignInHelp/SignInHelpScreen';
import { renderWithNav } from '../../test-utils/renderWithNav';
import { Routes } from '../../navigation/routes';

describe('WelcomeLoginScreen', () => {
  it('renders and navigates to Dashboard when Face ID button is pressed', () => {
    const { getByTestId, getByText } = renderWithNav(Routes.WelcomeLogin, {
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
      [Routes.Dashboard]: DashboardScreen,
    });

    expect(getByText('Access CareConnect')).toBeTruthy();

    fireEvent.press(getByTestId('face_id_button'));

    // Dashboard should render
    // If your Dashboard has different text, change this assertion to match.
    expect(getByText(/Today:/)).toBeTruthy();
  });

  it('navigates to Sign In Help when help button is pressed', async () => {
    const { findByTestId, findByText } = renderWithNav(Routes.WelcomeLogin, {
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
      [Routes.SignInHelp]: SignInHelpScreen,
    });

    // ✅ Wait for the button to exist (handles async mount/render)
    const helpBtn = await findByTestId('help_signing_in_button');
    fireEvent.press(helpBtn);

    // ✅ Assert we navigated by checking SignInHelp content
    expect(await findByText(/Need help/i)).toBeTruthy();
  });
});

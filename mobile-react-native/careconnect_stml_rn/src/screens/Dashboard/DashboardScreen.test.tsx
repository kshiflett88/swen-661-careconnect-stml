import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import DashboardScreen from './DashboardScreen';
import SignInHelpScreen from '../SignInHelp/SignInHelpScreen';
import { renderWithNav } from '../../test-utils/renderWithNav';
import { Routes } from '../../navigation/routes';

// Mock AsyncStorage used by TaskStatusStore
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => null),
}));

describe('DashboardScreen', () => {
  it('renders the date header and location card', () => {
    const { getByTestId, getByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
    });

    expect(getByText(/Today:/)).toBeTruthy();
    expect(getByTestId('location_card')).toBeTruthy();
  });

  it('navigates to SignInHelp when Messages button is pressed', async () => {
    const { getByTestId, getByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.SignInHelp]: SignInHelpScreen,
    });

    fireEvent.press(getByTestId('messages_button'));

    await waitFor(() => {
      expect(getByText(/Need help/)).toBeTruthy();
    });
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import DashboardScreen from './DashboardScreen';
import SignInHelpScreen from '../SignInHelp/SignInHelpScreen';
import { renderWithNav } from '../../test-utils/renderWithNav';
import { Routes } from '../../navigation/routes';

jest.mock('../../storage/taskStatusStore', () => ({
  TaskStatusStore: jest.fn().mockImplementation(() => ({
    getCompletedAt: jest.fn(async () => null),
    setCompletedAt: jest.fn(async () => null),
    clearCompletedAt: jest.fn(async () => null),
  })),
}));

describe('DashboardScreen', () => {
  it('renders date header and location card (waits for async effects)', async () => {
    const { findByText, getByTestId } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
    });

    // ✅ waits for initial render + any queued updates
    expect(await findByText(/Today:/)).toBeTruthy();
    expect(getByTestId('location_card')).toBeTruthy();

    // ✅ also wait for Next Task to settle (either a task title or "No tasks scheduled")
    await findByText(/Next Task|No tasks scheduled|Error loading tasks/);
  });

  it('navigates to SignInHelp when Messages pressed', async () => {
    const { getByTestId, findByText } = renderWithNav(Routes.Dashboard, {
      [Routes.Dashboard]: DashboardScreen,
      [Routes.SignInHelp]: SignInHelpScreen,
    });

    fireEvent.press(getByTestId('messages_button'));

    expect(await findByText(/Need help/)).toBeTruthy();
  });
});

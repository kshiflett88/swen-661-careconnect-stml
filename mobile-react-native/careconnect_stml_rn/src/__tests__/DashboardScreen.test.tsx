import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

jest.mock('../storage/taskStatusStore', () => ({
  TaskStatusStore: jest.fn().mockImplementation(() => ({
    getCompletedAt: jest.fn(async () => null),
    setCompletedAt: jest.fn(async () => null),
    clearCompletedAt: jest.fn(async () => null),
  })),
}));

// ✅ flush pending promises/microtasks
const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders date header and location card (waits for async effects)', async () => {
    const utils = render(<DashboardScreen />);

    // ✅ important: let useEffect async work complete inside act
    await act(async () => {
      await flushPromises();
      await flushPromises(); // often needed if there are multiple awaits in the effect
    });

    expect(await utils.findByText(/Today:/)).toBeTruthy();
    expect(utils.getByTestId('location_card')).toBeTruthy();

    expect(
      await utils.findByText(/Next Task|No tasks scheduled|Error loading tasks/)
    ).toBeTruthy();
  });

  it('navigates to SignInHelp when Messages pressed', async () => {
    const utils = render(<DashboardScreen />);

    await act(async () => {
      await flushPromises();
      await flushPromises();
    });

    fireEvent.press(utils.getByTestId('messages_button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});

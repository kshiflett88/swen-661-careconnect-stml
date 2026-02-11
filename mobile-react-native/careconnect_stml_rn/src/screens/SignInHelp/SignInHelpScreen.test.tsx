import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Alert, Platform, ToastAndroid } from 'react-native';

import SignInHelpScreen from './SignInHelpScreen';
import WelcomeLoginScreen from '../Welcome/WelcomeLoginScreen';
import { renderWithNav } from '../../test-utils/renderWithNav';
import { Routes } from '../../navigation/routes';

describe('SignInHelpScreen', () => {
  it('renders title', () => {
    const { getByText } = renderWithNav(Routes.SignInHelp, {
      [Routes.SignInHelp]: SignInHelpScreen,
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
    });

    expect(getByText(/Need help/)).toBeTruthy();
  });

  it('Try Face ID again navigates to WelcomeLogin', () => {
    const { getByTestId, getByText } = renderWithNav(Routes.SignInHelp, {
      [Routes.SignInHelp]: SignInHelpScreen,
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
    });

    fireEvent.press(getByTestId('face_id_button'));
    expect(getByText('Access CareConnect')).toBeTruthy();
  });

  it('Call caregiver triggers mock message', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(ToastAndroid, 'show').mockImplementation(() => 0 as any);

    const { getByTestId } = renderWithNav(Routes.SignInHelp, {
      [Routes.SignInHelp]: SignInHelpScreen,
      [Routes.WelcomeLogin]: WelcomeLoginScreen,
    });

    fireEvent.press(getByTestId('call_caregiver_button'));

    // We don't know platform during tests; assert at least one mock was called.
    if (Platform.OS === 'android') {
      expect(ToastAndroid.show).toHaveBeenCalled();
    } else {
      expect(Alert.alert).toHaveBeenCalled();
    }
  });
});

import '@testing-library/jest-native/extend-expect';

// ✅ Silence RN Animated warning / missing native module
jest.mock(
  'react-native/Libraries/Animated/NativeAnimatedHelper',
  () => ({}),
  { virtual: true }
);

// ✅ Safe area context (prevents SafeAreaProviderCompat crashes)
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const actual = jest.requireActual('react-native-safe-area-context');

  const mock = require('react-native-safe-area-context/jest/mock');

  return {
    ...actual,
    ...mock,
    SafeAreaProvider: ({ children }: any) => React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// ✅ Mock AsyncStorage for all tests
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ✅ Mock Expo vector icons to prevent font loading + act warnings
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = (props: any) => React.createElement(Text, props, 'Icon');

  return new Proxy(
    {},
    {
      get: () => MockIcon,
    }
  );
});

// ---- Silence React act() async warning ----
const originalError = console.error;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return; // ignore act() warning
    }

    originalError.call(console, ...args);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});


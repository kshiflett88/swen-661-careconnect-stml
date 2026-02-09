import '@testing-library/jest-native/extend-expect';


// ✅ Mock AsyncStorage for *all* tests
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ✅ Mock Expo vector icons to prevent font loading + act warnings
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = (props: any) => <Text {...props}>Icon</Text>;

  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
  };
});

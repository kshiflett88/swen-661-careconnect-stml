import "@testing-library/jest-native/extend-expect";

jest.mock(
  "react-native/Libraries/Animated/NativeAnimatedHelper",
  () => ({}),
  { virtual: true }
);

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Wrapper = ({ children }: any) => React.createElement(View, null, children);

  return {
    SafeAreaView: Wrapper,
    SafeAreaProvider: Wrapper,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }: any) => React.createElement(Text, null, `icon:${name}`),
  };
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

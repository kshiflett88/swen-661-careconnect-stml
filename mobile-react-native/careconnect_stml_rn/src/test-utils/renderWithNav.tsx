import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';

type ScreenMap = {
  [K in keyof RootStackParamList]?: React.ComponentType<any>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function renderWithNav(
  initialRouteName: keyof RootStackParamList,
  screens: ScreenMap
) {
  return render(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
        {Object.entries(screens).map(([name, Component]) => (
          <Stack.Screen key={name} name={name as any} component={Component as any} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

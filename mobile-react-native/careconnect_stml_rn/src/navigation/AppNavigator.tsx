import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './routes';
import { RootStackParamList } from './types';

import WelcomeLoginScreen from '../screens/Welcome/WelcomeLoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import SignInHelpScreen from '../screens/SignInHelp/SignInHelpScreen';
import EmergencyScreen from '../screens/Emergency/EmergencyScreen';
import HealthLoggingScreen from '../screens/HealthLogging/HealthLoggingScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import TaskListScreen from '../screens/Tasks/TaskListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Routes.Dashboard}>
        <Stack.Screen name={Routes.WelcomeLogin} component={WelcomeLoginScreen} />
        <Stack.Screen name={Routes.Dashboard} component={DashboardScreen} />
        <Stack.Screen name={Routes.SignInHelp} component={SignInHelpScreen} />
        <Stack.Screen name={Routes.Emergency} component={EmergencyScreen} />
        <Stack.Screen name={Routes.HealthLogging} component={HealthLoggingScreen} />
        <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
        <Stack.Screen name={Routes.TaskDetail} component={TaskDetailScreen} />
        <Stack.Screen name={Routes.TaskList} component={TaskListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


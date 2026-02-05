import { View, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Button title="Emergency" onPress={() => navigation.navigate(Routes.Emergency)} />
      <Button title="Tasks List" onPress={() => navigation.navigate(Routes.TaskList)} />
        <Button title="Tasks Detail" onPress={() => navigation.navigate(Routes.TaskDetail)} />
      <Button title="Health Logging" onPress={() => navigation.navigate(Routes.HealthLogging)} />
      <Button title="Profile" onPress={() => navigation.navigate(Routes.Profile)} />
      <Button title="Sign in help" onPress={() => navigation.navigate(Routes.SignInHelp)} />
      <Button title="Welcome Login" onPress={() => navigation.navigate(Routes.WelcomeLogin)} />
    </ScrollView>
  );
}


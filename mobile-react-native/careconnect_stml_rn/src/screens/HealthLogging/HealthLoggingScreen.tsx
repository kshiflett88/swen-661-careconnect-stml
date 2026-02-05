import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HealthLoggingScreen() {
    const navigation = useNavigation<Nav>();
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="header"
    >
      <Text>Health Logging Screen</Text>
      <Button title="Back to Dashboard" onPress={() => navigation.navigate(Routes.Dashboard)} />
    </View>
  );
}

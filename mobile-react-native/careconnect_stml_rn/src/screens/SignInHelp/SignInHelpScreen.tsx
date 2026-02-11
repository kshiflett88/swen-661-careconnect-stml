import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './styles';
import { Colors } from '../../theme/colors';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function showMockMessage(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert('CareConnect', message);
}

export default function SignInHelpScreen() {
  const navigation = useNavigation<Nav>();

  const handleBack = () => {
    // Mimic Flutter: pop if possible, else go to welcome
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(Routes.WelcomeLogin);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.spacer20} />

        {/* Icon circle */}
        <View style={styles.iconWrap}>
          <View
            style={styles.iconCircle}
            accessibilityRole="image"
            accessibilityLabel="Support icon"
          >
            <MaterialIcons name="favorite" size={44} color="#155DFC" />
          </View>
        </View>

        <View style={styles.spacer20} />

        {/* Title */}
        <Text style={styles.title} accessibilityRole="header">
          Need help{'\n'}signing in?
        </Text>

        <View style={styles.spacer10} />

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your caregiver can{'\n'}help you access the{'\n'}app.
        </Text>

        <View style={styles.spacer24} />

        {/* Buttons */}
        <LargeActionButton
          testID="call_caregiver_button"
          variant="success"
          icon={<MaterialIcons name="call" size={44} color={Colors.surface} />}
          label={'Call my\ncaregiver'}
          onPress={() => showMockMessage('Calling caregiver (mock)...')}
          accessibilityLabel="Call my caregiver"
          accessibilityHint="Starts a call to your caregiver"
        />

        <View style={styles.spacer16} />

        <LargeActionButton
          testID="send_message_button"
          variant="primary"
          icon={<MaterialIcons name="chat-bubble-outline" size={44} color={Colors.surface} />}
          label={'Send a\nmessage to\nmy caregiver'}
          onPress={() => showMockMessage('Messaging caregiver (mock)...')}
          accessibilityLabel="Send a message to my caregiver"
          accessibilityHint="Opens messaging to your caregiver"
        />

        <View style={styles.spacer16} />

        <LargeActionButton
          testID="face_id_button"
          variant="outlined"
          icon={<Ionicons name="scan-outline" size={44} color={Colors.text} />}
          label={'Try Face\nID again'}
          onPress={() => navigation.navigate(Routes.WelcomeLogin)}
          accessibilityLabel="Try Face ID again"
          accessibilityHint="Returns to Face ID sign in"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type Variant = 'success' | 'primary' | 'outlined';

type LargeActionButtonProps = {
  variant: Variant;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  testID?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

function LargeActionButton({
  variant,
  icon,
  label,
  onPress,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: LargeActionButtonProps) {
  const isOutlined = variant === 'outlined';

  const containerStyle =
    variant === 'success'
      ? styles.actionSuccess
      : variant === 'primary'
      ? styles.actionPrimary
      : styles.actionOutlined;

  const labelStyle = isOutlined ? styles.actionLabelOutlined : styles.actionLabelFilled;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.actionBase, containerStyle, pressed && styles.pressed]}
      hitSlop={8}
    >
      <View style={styles.actionRow}>
        <View style={styles.actionIcon}>{icon}</View>
        <View style={styles.actionTextWrap}>
          <Text style={labelStyle}>{label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './styles';
import { Colors } from '../../theme/colors';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeLoginScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.spacer16} />

        {/* Logo placeholder circle + icon */}
        <View style={styles.logoWrap}>
          <View
            style={styles.logoCircle}
            accessibilityRole="image"
            accessibilityLabel="CareConnect logo"
          >
            <MaterialIcons name="local-hospital" size={40} color={Colors.text} />
          </View>
        </View>

        <View style={styles.spacer16} />

        <Text style={styles.title} accessibilityRole="header">
          Access CareConnect
        </Text>

        <View style={styles.spacer20} />

        {/* Info card */}
        <View style={styles.infoCard} accessibilityLabel="Secure access information">
          <Text style={styles.infoText}>
            Your caregiver has set up{'\n'}secure access up for you.
          </Text>
        </View>

        <View style={styles.spacer20} />

        {/* Primary Face ID button */}
        <PrimaryBigButton
          testID="face_id_button"
          label={'Sign in\nwith Face ID'}
          icon={<Ionicons name="scan-outline" size={56} color={Colors.surface} />}
          onPress={() => navigation.navigate(Routes.Dashboard)}
          accessibilityLabel="Sign in with Face ID"
          accessibilityHint="Opens your dashboard"
        />

        <View style={styles.spacer12} />

        <Text style={styles.subtitle}>Look at the camera to sign in</Text>

        <View style={styles.spacer20} />

        {/* Secondary buttons */}
        <SecondaryCardButton
          testID="caregiver_button"
          label={'I am a\nCaregiver (Setup)'}
          icon={<MaterialIcons name="person-add-alt-1" size={36} color={Colors.text} />}
          onPress={() => navigation.navigate(Routes.Dashboard)}
          accessibilityLabel="I am a caregiver setup"
          accessibilityHint="Opens caregiver setup"
        />

        <View style={styles.spacer12} />

        <SecondaryCardButton
          testID="help_signing_in_button"
          label={'I need help\nsigning in'}
          icon={<MaterialIcons name="help-outline" size={36} color={Colors.text} />}
          onPress={() => navigation.navigate(Routes.SignInHelp)}
          accessibilityLabel="I need help signing in"
          accessibilityHint="Opens sign in help"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type PrimaryBigButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  testID?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

function PrimaryBigButton({
  label,
  onPress,
  icon,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: PrimaryBigButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      hitSlop={8}
    >
      <View style={styles.primaryInner}>
        {icon ? <View style={styles.primaryIcon}>{icon}</View> : null}
        <Text style={styles.primaryLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

type SecondaryCardButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  testID?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

function SecondaryCardButton({
  label,
  icon,
  onPress,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: SecondaryCardButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      hitSlop={8}
    >
      <View style={styles.secondaryRow}>
        <View style={styles.secondaryIcon}>{icon}</View>
        <View style={styles.secondaryTextWrap}>
          <Text style={styles.secondaryLabel}>{label}</Text>
        </View>
      </View>
    </Pressable>
  );
}


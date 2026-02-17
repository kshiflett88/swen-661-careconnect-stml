import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';

import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';
import { mockUserProfile } from '../../models/userProfile';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function todayLabel(dt: Date) {
  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `Today: ${weekdays[dt.getDay()]}, \n${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

function tryDobLabel(profile: { dateOfBirth?: string | Date | null }) {
  const dob = profile.dateOfBirth;
  if (!dob) return null;

  if (dob instanceof Date) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[dob.getMonth()]} ${dob.getDate()}, ${dob.getFullYear()}`;
  }

  if (typeof dob === 'string' && dob.trim().length > 0) return dob.trim();
  return null;
}

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useMemo(() => mockUserProfile(), []);
  const dobLabel = useMemo(() => tryDobLabel(profile), [profile]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Today header */}
        <Text style={styles.todayText} accessibilityRole="header">
          {todayLabel(new Date()).replace('\n', '')}
        </Text>

        <View style={styles.spacer12} />

        {/* You are on card */}
        <View
          testID="location_card_profile"
          style={styles.locationCard}
          accessible
          accessibilityRole="text"
          accessibilityLabel="You are on: My Profile"
        >
          <Text style={styles.locationText}>
            You are on: <Text style={styles.locationTextBold}>My Profile</Text>
          </Text>
        </View>

        <View style={styles.spacer14} />

        {/* Divider */}
        <View style={styles.divider} />

        <View style={styles.spacer18} />

        {/* ===== Card: Your Information ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle} accessibilityRole="header">
            Your Information
          </Text>

          <View style={styles.spacer18} />

          {/* Profile image placeholder */}
          <View style={styles.avatarWrap} accessible accessibilityRole="image" accessibilityLabel="Profile picture">
            <View style={styles.avatarCircle}>
              <MaterialIcons name="person" size={52} color={Colors.primary} />
            </View>
          </View>

          <View style={styles.spacer14} />

          <Text style={styles.labelCenter}>Your Name</Text>
          <View style={styles.spacer6} />
          <Text style={styles.userName}>{profile.userName}</Text>

          {dobLabel ? (
            <>
              <View style={styles.spacer18} />
              <View
                style={styles.infoBlock}
                accessible
                accessibilityRole="text"
                accessibilityLabel={`Date of Birth: ${dobLabel}`}
              >
                <Text style={styles.blockLabel}>Date of Birth</Text>
                <View style={styles.spacer6} />
                <Text style={styles.blockValue} accessible={false}>
                  {dobLabel}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.spacer16} />

        {/* ===== Card: Caregiver Contact ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle} accessibilityRole="header">
            Caregiver Contact
          </Text>

          <View style={styles.spacer16} />

          <View
            style={styles.infoBlock}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Primary Caregiver: ${profile.caregiverName}`}
          >
            <Text style={styles.blockLabel}>Primary Caregiver</Text>
            <View style={styles.spacer6} />
            <Text style={styles.blockValueBold} accessible={false}>
              {profile.caregiverName}
            </Text>
          </View>

          <View style={styles.spacer12} />

          <View
            style={styles.whiteBlock}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Phone number: ${profile.caregiverPhone}`}
          >
            <Text style={styles.blockLabel}>Phone Number</Text>
            <View style={styles.spacer6} />
            <Text style={styles.blockValue} accessible={false}>
              {profile.caregiverPhone}
            </Text>
          </View>

          <View style={styles.spacer12} />

          <View
            style={styles.whiteBlock}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Email: ${profile.caregiverEmail}`}
          >
            <Text style={styles.blockLabel}>Email</Text>
            <View style={styles.spacer6} />
            <Text style={styles.emailValue} accessible={false}>
              {profile.caregiverEmail}
            </Text>
          </View>
        </View>

        <View style={styles.spacer16} />

        {/* Accessibility Setup button (blue + white text) */}
        <Pressable
          testID="accessibility_setup_button"
          accessibilityRole="button"
          accessibilityLabel="View Accessibility Setup"
          accessibilityHint="Opens accessibility setup screen"
          onPress={() => navigation.navigate(Routes.AccessibilitySettings)}
          style={({ pressed }) => [styles.accessibilityButton, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Text style={styles.accessibilityButtonText}>View Accessibility Setup</Text>
        </Pressable>

        <View style={styles.spacer14} />

        {/* Back to Home */}
        <Pressable
          testID="back_to_home_button"
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          accessibilityHint="Returns to dashboard"
          onPress={() => navigation.navigate(Routes.Dashboard)}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </Pressable>

        <View style={styles.spacer14} />

        <Pressable
          testID="sign_out_button"
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          accessibilityHint="Signs you out and returns to the welcome screen"
          onPress={() => navigation.navigate(Routes.WelcomeLogin)}
          style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

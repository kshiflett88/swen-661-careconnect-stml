import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './styles';
import { Colors } from '../../theme/colors';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/types';

import { mockTasks } from '../../mocks/mockTasks';
import type { Task } from '../../models/task';
import { TaskStatusStore } from '../../storage/taskStatusStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function todayLabel(dt: Date) {
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // JS: Sunday=0, Flutter: Monday=1. We’ll map to your Flutter output style.
  const weekdayIndex = (dt.getDay() + 6) % 7; // Monday=0 ... Sunday=6
  return `Today: ${weekdays[weekdayIndex]}, \n${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

function formatTime(dt?: Date | null) {
  if (!dt) return '';
  let hour = dt.getHours();
  const minute = dt.getMinutes();
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const mm = String(minute).padStart(2, '0');
  return `${hour}:${mm} ${suffix}`;
}

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();

  // UI-only mock
  const locationLabel = 'Home';

  // persistence store (AsyncStorage-backed)
  const taskStore = useMemo(() => new TaskStatusStore(), []);

  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [loadingNextTask, setLoadingNextTask] = useState(true);
  const [taskError, setTaskError] = useState<string | null>(null);

  const tasks = useMemo(() => mockTasks, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNextTask() {
      try {
        setLoadingNextTask(true);
        setTaskError(null);

        // sort like Flutter: scheduledAt null last
        const sorted = [...tasks].sort((a, b) => {
          const at = a.scheduledAt ? new Date(a.scheduledAt).getTime() : null;
          const bt = b.scheduledAt ? new Date(b.scheduledAt).getTime() : null;
          if (at === null && bt === null) return 0;
          if (at === null) return 1;
          if (bt === null) return -1;
          return at - bt;
        });

        for (const task of sorted) {
          const completedAt = await taskStore.getCompletedAt(task.id);
          if (!completedAt) {
            if (isMounted) setNextTask(task);
            return;
          }
        }

        if (isMounted) setNextTask(null);
      } catch (e: any) {
        if (isMounted) setTaskError(e?.message ?? String(e));
      } finally {
        if (isMounted) setLoadingNextTask(false);
      }
    }

    loadNextTask();
    return () => {
      isMounted = false;
    };
  }, [taskStore, tasks]);

  return (
    <SafeAreaView testID="dashboard_screen" style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top row: date + profile icon */}
        <View style={styles.topRow}>
          <View style={styles.topRowLeft}>
            <Text style={styles.dateText} accessibilityRole="header">
              {todayLabel(new Date()).replace('\n', '')}
            </Text>
          </View>

          <CircleIconButton
            testID="profile_settings_button"
            iconName="person-outline"
            accessibilityLabel="Profile and settings"
            accessibilityHint="Opens profile and settings"
            onPress={() => navigation.navigate(Routes.Profile)}
          />
        </View>

        <View style={styles.spacer12} />

        {/* Location card */}
        <View
          style={styles.locationCard}
          testID="location_card"
          accessible
          accessibilityRole="text"
          accessibilityLabel={`You are on ${locationLabel}`}
        >
          <Text style={styles.locationText}>
            <Text style={styles.locationText}>You are on: </Text>
            <Text style={styles.locationTextBold}>{locationLabel}</Text>
          </Text>
        </View>

        <View style={styles.spacer14} />

        {/* Divider line */}
        <View style={styles.divider} />

        <View style={styles.spacer18} />

        {/* Feeling card */}
        <CardButton
          testID="feeling_button"
          height={140}
          accessibilityLabel="How am I feeling today"
          accessibilityHint="Opens mood tracking"
          onPress={() => navigation.navigate(Routes.HealthLogging)}
        >
          <View style={styles.feelingInner}>
            <Text style={styles.feelingTitle}>How Am I{'\n'}Feeling Today?</Text>
            <View style={styles.spacer10} />
            <Text 
              style={styles.emojiRow}
              accessibilityRole="text"
              accessibilityLabel="Mood options: happy, okay, sad"
            >
              😊 😐 😔
            </Text>
          </View>
        </CardButton>

        <View style={styles.spacer14} />

        {/* Next Task card */}
        <View style={styles.nextTaskWrap}>
          {loadingNextTask ? (
            <View 
              style={styles.nextTaskLoading}
              accessible
              accessibilityRole="text"
              accessibilityLabel="Loading next task"
            >
              <ActivityIndicator accessibilityLabel="Loading"/>
            </View>
          ) : taskError ? (
            <View 
              style={styles.nextTaskError}
              accessible
              accessibilityRole="alert"
              accessibilityLabel={`Error loading tasks. ${taskError}`}
            >
              <Text style={styles.errorText} accessible={false}>
                Error loading tasks:{'\n'}{taskError}
              </Text>
            </View>
          ) : !nextTask ? (
            <View 
              style={styles.nextTaskCard}
              accessible
              accessibilityRole="text"
              accessibilityLabel="No tasks scheduled"
            >
              <Text style={styles.noTasksText} accessible={false}>No tasks scheduled</Text>
            </View>
          ) : (
            <View 
              style={styles.nextTaskCard}
              accessible
              accessibilityRole="summary"
              accessibilityLabel={
                `Next task: ${nextTask.title}. Scheduled at ${formatTime(nextTask.scheduledAt
                  ? new Date(nextTask.scheduledAt)
                  : null) || 'unscheduled'}.`
              }
            >
              <Text style={styles.nextTaskLabel} accessible={false}>Next Task</Text>
              <View style={styles.spacer6} />
              <Text style={styles.nextTaskTitle} accessible={false}>{nextTask.title}</Text>
              <View style={styles.spacer8} />

              <Text style={styles.nextTaskTime} accessible={false}>
                {formatTime(nextTask.scheduledAt ? new Date(nextTask.scheduledAt) : null)}
              </Text>

              <View style={styles.spacer16} />

              <Pressable
                testID="start_task_button"
                accessibilityRole="button"
                accessibilityLabel="Start task"
                accessibilityHint="Opens the task details screen"
                style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
                onPress={() =>
                  navigation.navigate(Routes.TaskDetail, { id: nextTask.id })
                }
              >
                <Text style={styles.startButtonText}>Start</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.spacer16} />

        {/* Schedule */}
        <CardButton
          testID="schedule_button"
          height={92}
          accessibilityLabel="Schedule"
          accessibilityHint="Opens your task list"
          onPress={() => navigation.navigate(Routes.TaskList)}
        >
          <Text style={styles.cardButtonText}>Schedule</Text>
        </CardButton>

        <View style={styles.spacer14} />

        {/* Messages */}
        <CardButton
          testID="messages_button"
          height={92}
          accessibilityLabel="Messages"
          accessibilityHint="Opens sign-in help and caregiver messages"
          onPress={() => navigation.navigate(Routes.SignInHelp)}
        >
          <Text style={styles.cardButtonText}>Messages</Text>
        </CardButton>

        <View style={styles.spacer16} />

        {/* Emergency */}
        <Pressable
          testID="emergency_help_button"
          accessibilityRole="button"
          accessibilityLabel="Emergency help"
          accessibilityHint="Opens the emergency screen"
          style={({ pressed }) => [styles.emergencyButton, pressed && styles.pressed]}
          onPress={() => navigation.navigate(Routes.Emergency)}
        >
          <Text style={styles.emergencyButtonText}>Emergency Help</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function CircleIconButton({
  iconName,
  onPress,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: {
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress: () => void;
  testID?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.circleIconButton, pressed && styles.pressed]}
      hitSlop={8}
    >
      <MaterialIcons 
        name={iconName}
        size={30}
        color={Colors.text}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </Pressable>
  );
}

function CardButton({
  height,
  children,
  onPress,
  testID,
  accessibilityLabel,
  accessibilityHint,
}: {
  height: number;
  children: React.ReactNode;
  onPress: () => void;
  testID?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardButton,
        { height },
        pressed && styles.pressed,
      ]}
      hitSlop={8}
    >
      <View style={styles.cardButtonInner}>{children}</View>
    </Pressable>
  );
}

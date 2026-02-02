import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/dashboard/patient_dashboard_screen.dart';

import 'package:careconnect_stml_flutter/screens/settings/profile_settings_screen.dart';
import 'package:careconnect_stml_flutter/screens/health_logging/health_logging_screen.dart';
import 'package:careconnect_stml_flutter/screens/tasks/task_list_screen.dart';
import 'package:careconnect_stml_flutter/screens/tasks/task_detail_screen.dart';
import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart';
import 'package:careconnect_stml_flutter/screens/emergency/sos_screen.dart';

import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';
import 'package:careconnect_stml_flutter/data/models/task.dart';

List<Task> _testTasks() {
  return [
    Task(
      id: '1',
      title: 'Take Morning\nMedication',
      description: 'Blue pill after breakfast',
      scheduledAt: DateTime(2026, 1, 26, 9, 0),
    ),
    Task(
      id: '2',
      title: 'Drink Water',
      description: 'One full glass',
      scheduledAt: DateTime(2026, 1, 26, 10, 0),
    ),
  ];
}

GoRouter _buildTestRouter({
  String initialLocation = AppRoutes.dashboard,
  TaskStatusStore? store,
  List<Task>? tasks,
}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => PatientDashboardScreen(
          taskStore: store,
          tasks: tasks,
        ),
      ),
      GoRoute(
        path: AppRoutes.settings,
        builder: (context, state) => const ProfileSettingsScreen(),
      ),
      GoRoute(
        path: AppRoutes.healthLogging,
        builder: (context, state) => const HealthLoggingScreen(),
      ),
      GoRoute(
        path: AppRoutes.taskList,
        builder: (context, state) => const TaskListScreen(),
      ),
      GoRoute(
        path: AppRoutes.taskDetail,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '0';
          return TaskDetailScreen(taskId: id);
        },
      ),
      GoRoute(
        path: AppRoutes.signInHelp,
        builder: (context, state) => const SignInHelpScreen(),
      ),
      GoRoute(
        path: AppRoutes.sos,
        builder: (context, state) => const SosScreen(),
      ),
    ],
  );
}

class _TestApp extends StatelessWidget {
  final GoRouter router;
  const _TestApp({required this.router});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(routerConfig: router);
  }
}

Future<void> _scrollTo(WidgetTester tester, Finder finder) async {
  await tester.scrollUntilVisible(
    finder,
    200,
    scrollable: find.byType(Scrollable),
  );
  await tester.pumpAndSettle();
}

void main() {
  group('PatientDashboardScreen', () {
    testWidgets('renders key content', (tester) async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final tasks = _testTasks();
      final router = _buildTestRouter(store: store, tasks: tasks);

      // Act
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Assert
      expect(find.textContaining('Today:'), findsOneWidget);

      final card = find.byKey(const Key('location_card'));
      expect(card, findsOneWidget);

      final rt = find.descendant(of: card, matching: find.byType(RichText));
      expect(rt, findsOneWidget);
      final plain = ((tester.widget<RichText>(rt).text) as TextSpan).toPlainText();
      expect(plain, contains('You are on: Home'));

      expect(find.text('Next Task'), findsOneWidget);
      expect(find.text('Take Morning\nMedication'), findsOneWidget);
      expect(find.text('9:00 AM'), findsOneWidget);

      expect(find.byKey(const Key('profile_settings_button')), findsOneWidget);
      expect(find.byKey(const Key('feeling_button')), findsOneWidget);
      expect(find.byKey(const Key('start_task_button')), findsOneWidget);
      expect(find.byKey(const Key('schedule_button')), findsOneWidget);
      expect(find.byKey(const Key('messages_button')), findsOneWidget);
      expect(find.byKey(const Key('emergency_help_button')), findsOneWidget);
    });

    testWidgets('Profile icon navigates to Settings', (tester) async {
      // Arrange
      final router = _buildTestRouter(
        store: InMemoryTaskStatusStore(),
        tasks: _testTasks(),
      );
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      await tester.tap(find.byKey(const Key('profile_settings_button')));
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(ProfileSettingsScreen), findsOneWidget);
    });

    testWidgets('Feeling card navigates to Health Logging', (tester) async {
      // Arrange
      final router = _buildTestRouter(
        store: InMemoryTaskStatusStore(),
        tasks: _testTasks(),
      );
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      await tester.tap(find.byKey(const Key('feeling_button')));
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(HealthLoggingScreen), findsOneWidget);
    });

    testWidgets('Start button navigates to Task Detail with id=1', (tester) async {
      // Arrange
      final router = _buildTestRouter(
        store: InMemoryTaskStatusStore(),
        tasks: _testTasks(),
      );
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      final startBtn = find.byKey(const Key('start_task_button'));
      await tester.ensureVisible(startBtn);
      await tester.tap(startBtn);
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(TaskDetailScreen), findsOneWidget);
    });

    testWidgets('Schedule button navigates to Task List', (tester) async {
      // Arrange
      final router = _buildTestRouter(
        store: InMemoryTaskStatusStore(),
        tasks: _testTasks(),
      );
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      final scheduleBtn = find.byKey(const Key('schedule_button'));
      await tester.ensureVisible(scheduleBtn);
      await tester.tap(scheduleBtn);
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(TaskListScreen), findsOneWidget);
    });

    testWidgets('Messages button navigates to Sign-In Help', (tester) async {
      // Arrange
      final router = _buildTestRouter(
        store: InMemoryTaskStatusStore(),
        tasks: _testTasks(),
      );
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      final messagesBtn = find.byKey(const Key('messages_button'));
      await tester.ensureVisible(messagesBtn);
      await tester.tap(messagesBtn);
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(SignInHelpScreen), findsOneWidget);
    });

    testWidgets('Emergency Help button navigates to SOS screen', (tester) async {
      // Arrange
      final router = _buildTestRouter(
        store: InMemoryTaskStatusStore(),
        tasks: _testTasks(),
      );
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      final emergencyBtn = find.byKey(const Key('emergency_help_button'));
      await _scrollTo(tester, emergencyBtn);
      await tester.tap(emergencyBtn);
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(SosScreen), findsOneWidget);
    });
  });
}


import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/dashboard/patient_dashboard_screen.dart';
import 'package:careconnect_stml_flutter/data/models/task.dart';
import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';

import '../../helpers/test_app.dart';

class FakeTaskStatusStore implements TaskStatusStore {
  final Map<String, DateTime> _completed = {};

  @override
  Future<DateTime?> getCompletedAt(String taskId) async => _completed[taskId];

  @override
  Future<void> setCompleted(String taskId, DateTime when) async {
    _completed[taskId] = when;
  }

  @override
  Future<void> clearCompleted(String taskId) async {
    _completed.remove(taskId);
  }

  @override
  Future<void> clearAll() async {
    _completed.clear();
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('WCAG: Patient Dashboard touch targets are at least 48x48', (tester) async {
    final store = FakeTaskStatusStore();

    final tasks = <Task>[
      Task(
        id: 't1',
        title: 'Take Medication',
        description: 'Take 1 pill with water',
        scheduledAt: DateTime.now().add(const Duration(minutes: 10)),
        steps: const ['Step 1: Get water', 'Step 2: Take pill'],
      ),
    ];

    final router = GoRouter(
      initialLocation: AppRoutes.dashboard,
      routes: [
        GoRoute(
          path: AppRoutes.dashboard,
          builder: (_, __) =>
              PatientDashboardScreen(taskStore: store, tasks: tasks),
        ),
      ],
    );

    await tester.pumpWidget(TestApp(router: router));
    await tester.pump();

    Future<void> expectMin48(Finder f) async {
      expect(f, findsOneWidget);
      final size = tester.getSize(f);
      expect(size.width, greaterThanOrEqualTo(48));
      expect(size.height, greaterThanOrEqualTo(48));
    }

    await expectMin48(find.byKey(const Key('profile_settings_button')));
    await expectMin48(find.byKey(const Key('feeling_button')));
    await expectMin48(find.byKey(const Key('schedule_button')));
    await expectMin48(find.byKey(const Key('messages_button')));
    await expectMin48(find.byKey(const Key('emergency_help_button')));
    await expectMin48(find.byKey(const Key('start_task_button')));
  });
}

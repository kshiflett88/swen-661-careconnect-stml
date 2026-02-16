import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/dashboard/patient_dashboard_screen.dart';
import 'package:careconnect_stml_flutter/data/models/task.dart';
import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';

import '../../helpers/semantics_audit.dart';
import '../../helpers/test_app.dart';

class FakeTaskStatusStore implements TaskStatusStore {
  final Map<String, DateTime> _completed = {};

  @override
  Future<void> setCompleted(String taskId, DateTime when) async {
    _completed[taskId] = when;
  }

  @override
  Future<DateTime?> getCompletedAt(String taskId) async {
    return _completed[taskId];
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
  testWidgets('interactive controls have non-empty semantics labels', (tester) async {
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
          builder: (_, __) => PatientDashboardScreen(taskStore: store, tasks: tasks),
        ),
      ],
    );
    await tester.pumpWidget(TestApp(router: router));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      audit.expectButton(find.byKey(const Key('profile_settings_button')), labelContains: 'Profile');
      audit.expectButton(find.byKey(const Key('feeling_button')), labelContains: 'Feeling');
      audit.expectButton(find.byKey(const Key('schedule_button')), labelContains: 'Schedule');
      audit.expectButton(find.byKey(const Key('messages_button')), labelContains: 'Messages');
      audit.expectButton(find.byKey(const Key('emergency_help_button')), labelContains: 'Emergency');

      final startFinder = find.byKey(const Key('start_task_button'));
      if (startFinder.evaluate().isNotEmpty) {
        audit.expectButton(startFinder, labelContains: 'Start');
      }
    } finally {
      audit.dispose();
    }
  });
}

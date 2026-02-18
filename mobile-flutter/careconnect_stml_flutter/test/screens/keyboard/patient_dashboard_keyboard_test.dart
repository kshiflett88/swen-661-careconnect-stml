import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

  testWidgets('Keyboard: Tab moves focus through Patient Dashboard controls', (tester) async {
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

    // Move focus forward a few times
    for (int i = 0; i < 6; i++) {
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      expect(FocusManager.instance.primaryFocus, isNotNull);
    }

    // Move focus backwards (Shift+Tab)
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pump();

    expect(FocusManager.instance.primaryFocus, isNotNull);
  });
}

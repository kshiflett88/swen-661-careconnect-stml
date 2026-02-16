import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/health_logging/health_logging_screen.dart';
import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';

import 'package:careconnect_stml_flutter/screens/dashboard/patient_dashboard_screen.dart';
import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';
import 'package:careconnect_stml_flutter/data/models/task.dart';

GoRouter buildHealthLoggingTestRouter({
  String initialLocation = AppRoutes.healthLogging,
  required HealthLogStore store,
}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => const DashboardPlaceholder(),
      ),
      GoRoute(
        path: AppRoutes.healthLogging,
        builder: (context, state) => HealthLoggingScreen(store: store),
      ),
    ],
  );
}



GoRouter buildPatientDashboardTestRouter({
  String initialLocation = AppRoutes.dashboard,
  required TaskStatusStore taskStore,
  required List<Task> tasks,
}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => PatientDashboardScreen(
          taskStore: taskStore,
          tasks: tasks,
        ),
      ),
    ],
  );
}

/// Avoid pulling in real dashboard dependencies (tasks, stores, etc.)
class DashboardPlaceholder extends StatelessWidget {
  const DashboardPlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('DASHBOARD')));
  }
}

class TestApp extends StatelessWidget {
  final GoRouter router;
  const TestApp({super.key, required this.router});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(routerConfig: router);
  }
}

Future<void> scrollTo(WidgetTester tester, Finder finder) async {
  await tester.scrollUntilVisible(
    finder,
    250,
    scrollable: find.byType(Scrollable).first,
  );
  await tester.pumpAndSettle();
}

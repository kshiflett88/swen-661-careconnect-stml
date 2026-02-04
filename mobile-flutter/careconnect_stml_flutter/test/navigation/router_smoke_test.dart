import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:careconnect_stml_flutter/app/router.dart';

// Screens (so we can assert on types)
import 'package:careconnect_stml_flutter/screens/welcome_login/welcome_login_screen.dart';
import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart';
import 'package:careconnect_stml_flutter/screens/tasks/task_list_screen.dart';
import 'package:careconnect_stml_flutter/screens/health_logging/health_logging_screen.dart';
import 'package:careconnect_stml_flutter/screens/emergency/emergency_screen.dart';
import 'package:careconnect_stml_flutter/screens/profile/profile_screen.dart';

void main() {
  group('App router smoke', () {
    setUp(() async {
      // Router hits screens that may use SharedPreferences (task list / health logging),
      // so mock prefs to keep tests stable.
      SharedPreferences.setMockInitialValues({});
    });

    testWidgets('createRouter shows WelcomeLoginScreen at initialLocation', (tester) async {
      final router = createRouter();

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      expect(find.byType(WelcomeLoginScreen), findsOneWidget);
    });

    testWidgets('router navigates to key routes', (tester) async {
      final router = createRouter();

      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();

      // /sign-in-help
      router.go(AppRoutes.signInHelp);
      await tester.pumpAndSettle();
      expect(find.byType(SignInHelpScreen), findsOneWidget);

      // /tasks
      router.go(AppRoutes.taskList);
      await tester.pumpAndSettle();
      expect(find.byType(TaskListScreen), findsOneWidget);

      // /health-logging
      router.go(AppRoutes.healthLogging);
      await tester.pumpAndSettle();
      expect(find.byType(HealthLoggingScreen), findsOneWidget);

      // /sos
      router.go(AppRoutes.sos);
      await tester.pumpAndSettle();
      expect(find.byType(EmergencyScreen), findsOneWidget);

      // /settings
      router.go(AppRoutes.settings);
      await tester.pumpAndSettle();
      expect(find.byType(ProfileScreen), findsOneWidget);
    });
  });
}

import 'package:go_router/go_router.dart';

import '../screens/welcome_login/welcome_login_screen.dart';
import '../screens/sign_in_help/sign_in_help_screen.dart';
import '../screens/dashboard/patient_dashboard_screen.dart';
import '../screens/tasks/task_list_screen.dart';
import '../screens/tasks/task_detail_screen.dart';
import '../screens/health_logging/health_logging_screen.dart';
import '../screens/emergency/emergency_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/accessibility_settings_screen.dart';

class AppRoutes {
  static const welcomeLogin = '/';
  static const signInHelp = '/sign-in-help';
  static const dashboard = '/dashboard';
  static const taskList = '/tasks';
  static const taskDetail = '/tasks/:id';
  static const healthLogging = '/health-logging';
  static const sos = '/sos';
  static const settings = '/settings';
  static const accessibility = '/accessibility';
}

GoRouter createRouter() {
  return GoRouter(
    initialLocation: AppRoutes.welcomeLogin,
    routes: [
      GoRoute(
        path: AppRoutes.welcomeLogin,
        builder: (context, state) => const WelcomeLoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.signInHelp,
        builder: (context, state) => const SignInHelpScreen(),
      ),
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => PatientDashboardScreen(),
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
        path: AppRoutes.healthLogging,
        builder: (context, state) => const HealthLoggingScreen(),
      ),
      GoRoute(
        path: AppRoutes.sos,
        builder: (context, state) => const EmergencyScreen(),
      ),
      GoRoute(
        path: AppRoutes.settings,
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: AppRoutes.accessibility,
        builder: (context, state) => const AccessibilitySettingsScreen(),
      ),
    ],
  );
}

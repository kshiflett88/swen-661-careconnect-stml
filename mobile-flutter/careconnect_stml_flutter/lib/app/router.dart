import 'package:go_router/go_router.dart';

import '../screens/welcome_login/welcome_login_screen.dart';
import '../screens/sign_in_help/sign_in_help_screen.dart';
import '../screens/dashboard/patient_dashboard_screen.dart';
import '../screens/tasks/task_list_screen.dart';
import '../screens/tasks/task_detail_screen.dart';
import '../screens/health_logging/health_logging_screen.dart';
import '../screens/emergency/sos_screen.dart';
import '../screens/settings/profile_settings_screen.dart';

class AppRoutes {
  static const welcomeLogin = '/';
  static const signInHelp = '/sign-in-help';
  static const dashboard = '/dashboard';
  static const taskList = '/tasks';
  static const taskDetail = '/tasks/:id';
  static const healthLogging = '/health-logging';
  static const sos = '/sos';
  static const settings = '/settings';
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
        builder: (context, state) => const SosScreen(),
      ),
      GoRoute(
        path: AppRoutes.settings,
        builder: (context, state) => const ProfileSettingsScreen(),
      ),
    ],
  );
}

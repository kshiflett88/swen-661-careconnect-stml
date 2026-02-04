import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/screens/welcome_login/welcome_login_screen.dart';

// If you want to reuse your real route constants, import them.
// Otherwise you can inline strings like '/dashboard' etc.
import 'package:careconnect_stml_flutter/app/router.dart';

void main() {
  group('WelcomeLoginScreen', () {
    testWidgets('renders core UI elements', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.welcomeLogin);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Title + helper text
      expect(find.text('Access CareConnect'), findsOneWidget);
      expect(find.text('Look at the camera to sign in'), findsOneWidget);

      // Info card text
      expect(find.text('Your caregiver has set up\nsecure access up for you.'), findsOneWidget);

      // Buttons by key
      expect(find.byKey(const Key('face_id_button')), findsOneWidget);
      expect(find.byKey(const Key('caregiver_button')), findsOneWidget);
      expect(find.byKey(const Key('help_signing_in_button')), findsOneWidget);

      // Sanity: the placeholder top icon exists
      expect(find.byIcon(Icons.local_hospital), findsOneWidget);
    });

    testWidgets('tapping Face ID navigates to Dashboard', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.welcomeLogin);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('face_id_button')));
      await tester.pumpAndSettle();

      expect(find.text('Dashboard Screen'), findsOneWidget);
    });

    testWidgets('tapping Caregiver navigates to Dashboard', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.welcomeLogin);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final caregiverBtn = find.byKey(const Key('caregiver_button'));

      // Scroll within the SingleChildScrollView until the button is visible
      await tester.scrollUntilVisible(
        caregiverBtn,
        200, // scroll delta per attempt
        scrollable: find.byType(Scrollable),
      );
      await tester.pumpAndSettle();

      await tester.tap(caregiverBtn);
      await tester.pumpAndSettle();

      expect(find.text('Dashboard Screen'), findsOneWidget);
    });

    testWidgets('tapping Help signing in navigates to Sign-In Help', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.welcomeLogin);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final helpBtn = find.byKey(const Key('help_signing_in_button'));

      await tester.scrollUntilVisible(
        helpBtn,
        200,
        scrollable: find.byType(Scrollable),
      );
      await tester.pumpAndSettle();

      await tester.tap(helpBtn);
      await tester.pumpAndSettle();

      expect(find.text('Sign-In Help Screen'), findsOneWidget);
    });
  });
}

/// Minimal app wrapper so routing works in tests
class _TestApp extends StatelessWidget {
  final GoRouter router;

  const _TestApp({required this.router});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}

/// Test-only router.
/// We use tiny placeholder pages for destinations to verify navigation.
GoRouter _buildTestRouter({required String initialLocation}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.welcomeLogin,
        builder: (context, state) => const WelcomeLoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => const _PlaceholderScreen('Dashboard Screen'),
      ),
      GoRoute(
        path: AppRoutes.signInHelp,
        builder: (context, state) => const _PlaceholderScreen('Sign-In Help Screen'),
      ),
    ],
  );
}

class _PlaceholderScreen extends StatelessWidget {
  final String label;
  const _PlaceholderScreen(this.label);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text(label)),
    );
  }
}

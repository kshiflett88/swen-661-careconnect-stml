import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart';
import 'package:careconnect_stml_flutter/screens/welcome_login/welcome_login_screen.dart';

GoRouter _buildTestRouter({String initialLocation = AppRoutes.signInHelp}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.welcomeLogin,
        builder: (context, state) => const WelcomeLoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.signInHelp,
        builder: (context, state) => const SignInHelpScreen(),
      ),
    ],
  );
}

class _TestApp extends StatelessWidget {
  final GoRouter router;
  const _TestApp({required this.router});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
    );
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
  group('SignInHelpScreen', () {
    testWidgets('renders core content', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.signInHelp);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      expect(find.text('Need help\nsigning in?'), findsOneWidget);
      expect(find.byKey(const Key('call_caregiver_button')), findsOneWidget);
      expect(find.byKey(const Key('send_message_button')), findsOneWidget);
      expect(find.byKey(const Key('face_id_button')), findsOneWidget);
      expect(find.text('Back'), findsOneWidget);
    });

    testWidgets('tapping Call my caregiver shows SnackBar', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.signInHelp);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final callBtn = find.byKey(const Key('call_caregiver_button'));
      // Likely visible, but safe to ensure:
      await tester.ensureVisible(callBtn);
      await tester.pumpAndSettle();

      await tester.tap(callBtn);
      await tester.pump(); // pump once to show SnackBar

      expect(find.text('Calling caregiver (mock)...'), findsOneWidget);
    });

    testWidgets('tapping Send message shows SnackBar', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.signInHelp);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final msgBtn = find.byKey(const Key('send_message_button'));
      await tester.ensureVisible(msgBtn);
      await tester.pumpAndSettle();

      await tester.tap(msgBtn);
      await tester.pump();

      expect(find.text('Messaging caregiver (mock)...'), findsOneWidget);
    });

    testWidgets('tapping Try Face ID again navigates to Welcome/Login', (tester) async {
      final router = _buildTestRouter(initialLocation: AppRoutes.signInHelp);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final faceIdBtn = find.byKey(const Key('face_id_button'));

      // This is the one you called out: likely off-screen in the test viewport
      await _scrollTo(tester, faceIdBtn);

      await tester.tap(faceIdBtn);
      await tester.pumpAndSettle();

      // Assert we are on Welcome/Login screen
      expect(find.text('Access CareConnect'), findsOneWidget);
      expect(find.byType(WelcomeLoginScreen), findsOneWidget);
    });

    testWidgets('Back returns to Welcome/Login when reachable in stack', (tester) async {
      // Start at welcome, then go to help, so pop() works
      final router = _buildTestRouter(initialLocation: AppRoutes.welcomeLogin);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Navigate forward to help
      router.go(AppRoutes.signInHelp);
      await tester.pumpAndSettle();

      expect(find.byType(SignInHelpScreen), findsOneWidget);

      // Tap Back (InkWell with "Back" text)
      await tester.tap(find.text('Back'));
      await tester.pumpAndSettle();

      expect(find.byType(WelcomeLoginScreen), findsOneWidget);
      expect(find.text('Access CareConnect'), findsOneWidget);
    });
  });
}

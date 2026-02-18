import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import '../helpers/test_app.dart';

void main() {
  group('Flutter Accessibility Guideline Validation (All Screens)', () {
    Future<void> validateGuidelines(WidgetTester tester) async {
      await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
      await expectLater(tester, meetsGuideline(iOSTapTargetGuideline));
      await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
    }

    String _currentLocation(dynamic router) {
      // GoRouter has had slightly different APIs across versions.
      // Prefer `router.location`, otherwise fall back to routeInformationProvider.
      try {
        final loc = router.location;
        if (loc is String) return loc;
      } catch (_) {
        // ignore
      }

      try {
        final loc = router.routeInformationProvider.value.location;
        if (loc is String) return loc;
      } catch (_) {
        // ignore
      }

      return '';
    }

    bool _locationsMatch(String current, String target) {
      if (current == target) return true;
      // Handle cases where location may include query params or trailing slashes.
      if (current.startsWith(target)) return true;
      if (current.replaceAll(RegExp(r'/*$'), '') ==
          target.replaceAll(RegExp(r'/*$'), '')) {
        return true;
      }
      return false;
    }

    Future<void> pumpAtRoute(WidgetTester tester, String route) async {
      final router = createRouter();

      await tester.pumpWidget(TestApp(router: router));
      await tester.pump(const Duration(milliseconds: 100));

      // Navigate after initial build (avoids needing initialLocation param)
      router.go(route);

      // Wait (bounded) for the router location to update AND the UI to render.
      // No pumpAndSettle() to avoid timeouts from animations/timers.
      for (int i = 0; i < 30; i++) {
        await tester.pump(const Duration(milliseconds: 100));
        final loc = _currentLocation(router);
        if (_locationsMatch(loc, route)) {
          // Give a tiny bit of extra time for widgets to paint/layout.
          await tester.pump(const Duration(milliseconds: 200));
          return;
        }
      }

      // If location never matched, still proceed with guideline checks on current tree,
      // but fail loudly so you know navigation isn't working as expected.
      fail('Timed out navigating to route: $route (current: ${_currentLocation(router)})');
    }

    testWidgets('Welcome / Login meets guidelines', (tester) async {
      await pumpAtRoute(tester, AppRoutes.welcomeLogin);
      await validateGuidelines(tester);
    });

    testWidgets('Dashboard meets guidelines', (tester) async {
      await pumpAtRoute(tester, AppRoutes.dashboard);
      await validateGuidelines(tester);
    });

    testWidgets('Task List meets guidelines', (tester) async {
      await pumpAtRoute(tester, AppRoutes.taskList);
      await validateGuidelines(tester);
    });

    testWidgets('Health Logging meets guidelines', (tester) async {
      await pumpAtRoute(tester, AppRoutes.healthLogging);
      await validateGuidelines(tester);
    });

    testWidgets('Emergency meets guidelines', (tester) async {
      await pumpAtRoute(tester, AppRoutes.sos);
      await validateGuidelines(tester);
    });

    testWidgets('Profile meets guidelines', (tester) async {
      await pumpAtRoute(tester, AppRoutes.settings);
      await validateGuidelines(tester);
    });
  });
}

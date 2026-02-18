import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_alert_sent_screen.dart';

void main() {
  testWidgets('Keyboard: Alert Sent focuses Return to Home and Enter activates navigation', (tester) async {
    final router = GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(
          path: '/',
          builder: (_, __) => const EmergencyAlertSentScreen(caregiverName: 'Caregiver'),
        ),
        GoRoute(
          path: '/dashboard',
          builder: (_, __) => const Scaffold(body: Text('Dashboard')),
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    final home = find.byKey(const Key('focus_return_home_emergency'));
    expect(home, findsOneWidget);
    expect(Focus.of(tester.element(home)).hasFocus, isTrue);

    // Press Enter to activate. Expect navigation to dashboard route.
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(find.textContaining('You are on:'), findsOneWidget);

  });
}

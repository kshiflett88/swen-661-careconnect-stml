import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_alert_sent_screen.dart';
import '../../helpers/wcag_text_scaling.dart';

void main() {
  testWidgets('WCAG: Alert Sent supports 200% text scaling without overflow', (tester) async {
    final router = GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(
          path: '/',
          builder: (_, __) =>
              const EmergencyAlertSentScreen(caregiverName: 'Caregiver'),
        ),
        GoRoute(
          path: '/dashboard',
          builder: (_, __) => const Scaffold(body: Text('Dashboard')),
        ),
      ],
    );

    await pumpNoOverflow(
      tester,
      withTextScale(MaterialApp.router(routerConfig: router), 2.0),
    );
  });
}

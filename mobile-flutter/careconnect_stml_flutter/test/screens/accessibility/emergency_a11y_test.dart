import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_screen.dart';
import '../../helpers/semantics_audit.dart';

void main() {
  testWidgets('A11y: Emergency screen has labeled SOS + Cancel', (tester) async {
    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      await tester.pumpWidget(const MaterialApp(home: EmergencyScreen()));
      await tester.pumpAndSettle();

      // SOS focus node exists (added earlier)
      final sos = find.byKey(const Key('sem_sos'));
      expect(sos, findsOneWidget);
      audit.expectButton(
        sos,
        labelContains: 'SOS',
        reason: 'SOS must expose a button role + tap action + meaningful label.',
      );

      // Cancel button exists
      final cancel = find.byKey(const Key('sem_emergency_cancel'));
      expect(cancel, findsOneWidget);
      audit.expectButton(
        cancel,
        labelContains: 'Cancel',
        reason: 'Cancel must expose a button role + tap action + label.',
      );
    } finally {
      audit.dispose();
    }
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_confirmation_screen.dart';
import '../../helpers/semantics_audit.dart';

void main() {
  testWidgets('A11y: Confirmation has labeled Send Alert + Cancel', (tester) async {
    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      await tester.pumpWidget(const MaterialApp(home: EmergencyConfirmationScreen()));
      await tester.pumpAndSettle();

      final send = find.byKey(const Key('focus_send_alert'));
      final cancel = find.byKey(const Key('sem_confirm_cancel'));

      expect(send, findsOneWidget);
      expect(cancel, findsOneWidget);

      audit.expectButton(
        send,
        labelContains: 'Send',
        reason: 'Send Alert must expose a button role + tap action + label.',
      );
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

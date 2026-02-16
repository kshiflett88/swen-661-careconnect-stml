import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;
import '../../helpers/semantics_audit.dart';

void main() {
  testWidgets('A11y: Welcome screen controls are accessible', (tester) async {
    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      app.main();
      await tester.pumpAndSettle();

      // ✅ 1) Confirm WelcomeLoginScreen rendered
      expect(find.text('Access CareConnect'), findsOneWidget);

      // ✅ 2) Face ID primary button (ElevatedButton)
      final faceIdBtn = find.descendant(
        of: find.byKey(const Key('face_id_button')),
        matching: find.byType(ElevatedButton),
      );
      expect(faceIdBtn, findsOneWidget);
      audit.expectButton(
        faceIdBtn,
        labelContains: 'Face',
        reason: 'Face ID button must expose button role + tap action + meaningful label.',
      );

      // ✅ 3) Caregiver setup button (OutlinedButton)
      final caregiverBtn = find.byKey(const Key('caregiver_button'));
      expect(caregiverBtn, findsOneWidget);

      audit.expectButton(
        caregiverBtn,
        labelContains: 'Caregiver',
        reason: 'Caregiver button must expose button role + tap action + label.',
      );


      // ✅ 4) Help signing in button (OutlinedButton)
      final helpBtn = find.byKey(const Key('help_signing_in_button'));
      expect(helpBtn, findsOneWidget);

      audit.expectButton(
        helpBtn,
        labelContains: 'help',
        reason: 'Help signing-in button must expose button role + tap action + label.',
      );
    } finally {
      audit.dispose();
    }
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_confirmation_screen.dart';
import '../../helpers/wcag_touch_targets.dart';

void main() {
  testWidgets('WCAG: Confirmation touch targets are >= 48x48', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: EmergencyConfirmationScreen()));
    await tester.pumpAndSettle();

    expectMinTouchTarget(
      tester,
      find.byKey(const Key('focus_send_alert')),
      reason: 'Send Alert must be >= 48x48.',
    );

    expectMinTouchTarget(
      tester,
      find.byKey(const Key('focus_confirm_cancel')),
      reason: 'Cancel must be >= 48x48.',
    );
  });
}

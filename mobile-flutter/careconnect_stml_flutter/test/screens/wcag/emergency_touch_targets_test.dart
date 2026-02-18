import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_screen.dart';
import '../../helpers/wcag_touch_targets.dart';

void main() {
  testWidgets('WCAG: Emergency touch targets are >= 48x48', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: EmergencyScreen()));
    await tester.pumpAndSettle();

    // SOS is a tappable area (focus wrapper); validate its render box size
    final sos = find.byKey(const Key('focus_sos'));
    expect(sos, findsOneWidget);
    expectMinTouchTarget(tester, sos, reason: 'SOS touch target must be >= 48x48.');

    // Cancel button
    final cancel = find.byKey(const Key('cancel_button'));
    expect(cancel, findsOneWidget);
    expectMinTouchTarget(tester, cancel, reason: 'Cancel touch target must be >= 48x48.');
  });
}

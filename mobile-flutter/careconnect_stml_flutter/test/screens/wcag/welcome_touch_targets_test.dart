import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;
import '../../helpers/wcag_touch_targets.dart';

void main() {
  testWidgets('WCAG: Welcome touch targets are >= 48x48', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Buttons are wrapped, so measure the actual tappable buttons inside
    final faceIdBtn = find.descendant(
      of: find.byKey(const Key('face_id_button')),
      matching: find.byType(ElevatedButton),
    );
    final caregiverBtn = find.byKey(const Key('caregiver_button'));
    expect(caregiverBtn, findsOneWidget);

    final helpBtn = find.byKey(const Key('help_signing_in_button'));
    expect(helpBtn, findsOneWidget);

    expectMinTouchTarget(tester, faceIdBtn, reason: 'Face ID button must be >= 48x48.');
    expectMinTouchTarget(tester, caregiverBtn, reason: 'Caregiver button must be >= 48x48.');
    expectMinTouchTarget(tester, helpBtn, reason: 'Help button must be >= 48x48.');
  });
}

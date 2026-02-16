import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_calling_screen.dart';

void main() {
  testWidgets('Keyboard: Calling screen focuses Cancel Call', (tester) async {
    await tester.pumpWidget(const MaterialApp(
      home: EmergencyCallingScreen(
        caregiverName: 'Caregiver',
        caregiverPhone: '555-555-5555',
      ),
    ));
    await tester.pumpAndSettle();

    final cancelCall = find.byKey(const Key('focus_cancel_call'));
    expect(cancelCall, findsOneWidget);
    expect(Focus.of(tester.element(cancelCall)).hasFocus, isTrue);
  });
}


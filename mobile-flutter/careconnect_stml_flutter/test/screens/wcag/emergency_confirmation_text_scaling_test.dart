import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_confirmation_screen.dart';
import '../../helpers/wcag_text_scaling.dart';

void main() {
  testWidgets('WCAG: Confirmation supports 200% text scaling without overflow', (tester) async {
    await pumpNoOverflow(
      tester,
      withTextScale(const MaterialApp(home: EmergencyConfirmationScreen()), 2.0),
    );

    expect(find.byType(EmergencyConfirmationScreen), findsOneWidget);
  });
}

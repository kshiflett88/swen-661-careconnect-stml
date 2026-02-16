import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_calling_screen.dart';
import '../../helpers/wcag_text_scaling.dart';

void main() {
  testWidgets('WCAG: Calling supports 200% text scaling without overflow', (tester) async {
    await pumpNoOverflow(
      tester,
      withTextScale(
        const MaterialApp(
          home: EmergencyCallingScreen(
            caregiverName: 'Caregiver',
            caregiverPhone: '555-555-5555',
          ),
        ),
        2.0,
      ),
    );
  });
}

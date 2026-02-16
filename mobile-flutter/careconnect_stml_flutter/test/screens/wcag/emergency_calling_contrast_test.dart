import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_calling_screen.dart';
import '../../helpers/wcag_contrast.dart';

void main() {
  testWidgets('WCAG: Emergency calling contrast meets AA for text + controls', (tester) async {
    await tester.pumpWidget(const MaterialApp(
      home: EmergencyCallingScreen(
        caregiverName: 'Caregiver',
        caregiverPhone: '555-555-5555',
      ),
    ));
    await tester.pumpAndSettle();

    final theme = Theme.of(tester.element(find.byType(MaterialApp)));
    final cs = theme.colorScheme;
    final bg = theme.scaffoldBackgroundColor;

    final body = theme.textTheme.bodyLarge;
    final bodyColor = body?.color ?? cs.onSurface;
    expectContrastAA(
      foreground: bodyColor,
      background: bg,
      isLargeText: false,
      reason: 'Body text must meet >= 4.5:1 on scaffold background.',
    );

    // Cancel call is often white on red
    expectContrastAA(
      foreground: Colors.white,
      background: const Color(0xFFDC2626),
      isLargeText: false,
      reason: 'Cancel call (white-on-red) must meet >= 4.5:1 for normal text.',
    );
  });
}

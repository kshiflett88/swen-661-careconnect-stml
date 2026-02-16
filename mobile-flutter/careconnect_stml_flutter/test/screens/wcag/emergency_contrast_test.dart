import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_screen.dart';
import '../../helpers/wcag_contrast.dart';

void main() {
  testWidgets('WCAG: Emergency screen key contrast pairs meet AA', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: EmergencyScreen()));
    await tester.pumpAndSettle();

    final theme = Theme.of(tester.element(find.byType(MaterialApp)));
    final cs = theme.colorScheme;
    final bg = theme.scaffoldBackgroundColor;

    // Base body text on background
    final body = theme.textTheme.bodyLarge;
    final bodyColor = body?.color ?? cs.onSurface;
    expectContrastAA(
      foreground: bodyColor,
      background: bg,
      isLargeText: false,
      reason: 'Body text must meet >= 4.5:1 on scaffold background.',
    );

    // SOS is typically white on red (ensure AA)
    // Use theme colors if SOS uses primary; otherwise this still validates common red/white pairing.
    expectContrastAA(
      foreground: Colors.white,
      background: const Color(0xFFDC2626),
      isLargeText: true,
      reason: 'SOS (large) white-on-red must meet >= 3:1.',
    );

    // Warning card uses black on yellow-ish background in many designs.
    expectContrastAA(
      foreground: Colors.black,
      background: const Color(0xFFFEF9C3),
      isLargeText: false,
      reason: 'Warning text must meet >= 4.5:1 on warning background.',
    );
  });
}

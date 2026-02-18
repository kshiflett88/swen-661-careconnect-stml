import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_confirmation_screen.dart';
import '../../helpers/wcag_contrast.dart';

void main() {
  testWidgets('WCAG: Emergency confirmation contrast meets AA for text + buttons', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: EmergencyConfirmationScreen()));
    await tester.pumpAndSettle();

    final theme = Theme.of(tester.element(find.byType(MaterialApp)));
    final cs = theme.colorScheme;
    final bg = theme.scaffoldBackgroundColor;

    final headline = theme.textTheme.headlineLarge;
    final headlineColor = headline?.color ?? cs.onSurface;
    expectContrastAA(
      foreground: headlineColor,
      background: bg,
      isLargeText: true,
      reason: 'Large text must meet >= 3:1.',
    );

    final body = theme.textTheme.bodyLarge;
    final bodyColor = body?.color ?? cs.onSurface;
    expectContrastAA(
      foreground: bodyColor,
      background: bg,
      isLargeText: false,
      reason: 'Body text must meet >= 4.5:1.',
    );

    // Primary action contrast
    expectContrastAA(
      foreground: cs.onPrimary,
      background: cs.primary,
      isLargeText: false,
      reason: 'Primary button text must meet >= 4.5:1.',
    );
  });
}

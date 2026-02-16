import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;

import '../../helpers/wcag_contrast.dart';

void main() {
  testWidgets('WCAG: Focus indicator / component non-text contrast meets AA (>= 3:1)', (tester) async {
    // Pump the actual app root so we get the real theme.
    await tester.pumpWidget(const app.CareConnectApp());
    await tester.pumpAndSettle();

    final theme = Theme.of(tester.element(find.byType(MaterialApp)));
    final cs = theme.colorScheme;
    final bg = theme.scaffoldBackgroundColor;

    // Primary (often used for focus ring / highlights)
    expectNonTextContrastAA(
      foreground: cs.primary,
      background: bg,
      reason: 'Primary color used for focus/highlight must meet >= 3:1 on scaffold background.',
    );

    // Outline/border color (common for focus + component boundaries)
    final outline = cs.outline;
    expectNonTextContrastAA(
      foreground: outline,
      background: bg,
      reason: 'Outline/border color should meet >= 3:1 for non-text UI components.',
    );
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/profile_screen.dart';
import '../../helpers/wcag_contrast.dart';

void main() {
  testWidgets('WCAG: Profile screen key contrast pairs meet AA', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
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

    // Primary action text on primary background.
    expectContrastAA(
      foreground: cs.onPrimary,
      background: cs.primary,
      isLargeText: false,
      reason: 'Primary button text must meet >= 4.5:1.',
    );

    // Destructive action (often error color on bg)
    expectContrastAA(
      foreground: cs.error,
      background: bg,
      isLargeText: false,
      reason: 'Error/destructive text must meet >= 4.5:1 on background.',
    );
  });
}

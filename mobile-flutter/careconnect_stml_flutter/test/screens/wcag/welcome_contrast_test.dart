import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;

import '../../helpers/wcag_contrast.dart';

void main() {
  testWidgets('WCAG: Welcome color contrast meets AA', (tester) async {
    // Pump the actual app root so we get the real theme.
    await tester.pumpWidget(const app.CareConnectApp());
    await tester.pumpAndSettle();

    // Read ThemeData from the widget tree instead of trying to access MaterialApp.theme directly.
    final theme = Theme.of(tester.element(find.byType(MaterialApp)));
    final cs = theme.colorScheme;

    final bg = theme.scaffoldBackgroundColor;

    // Headline is large text -> 3:1
    final headlineStyle = theme.textTheme.headlineLarge;
    final headlineColor = headlineStyle?.color ?? cs.onSurface;
    expectContrastAA(
      foreground: headlineColor,
      background: bg,
      isLargeText: true,
      reason: 'Headline must meet >= 3:1 on scaffold background.',
    );

    // Body is normal text -> 4.5:1
    final bodyStyle = theme.textTheme.bodyLarge;
    final bodyColor = bodyStyle?.color ?? cs.onSurface;
    expectContrastAA(
      foreground: bodyColor,
      background: bg,
      isLargeText: false,
      reason: 'Body text must meet >= 4.5:1 on scaffold background.',
    );

    // Info card bg from your custom palette
    final infoContainer = find.byWidgetPredicate(
      (widget) =>
          widget is Container &&
          widget.decoration is BoxDecoration &&
          (widget.decoration as BoxDecoration).color != null,
    );

    final containerWidget = tester.widget<Container>(infoContainer.first);
    final infoBg =
    (containerWidget.decoration as BoxDecoration).color!;
    expectContrastAA(
      foreground: bodyColor,
      background: infoBg,
      isLargeText: false,
      reason: 'Info card text must meet >= 4.5:1 on info card background.',
    );

    // Primary button text contrast
    expectContrastAA(
      foreground: cs.onPrimary,
      background: cs.primary,
      isLargeText: false,
      reason: 'Primary button text must meet >= 4.5:1 on primary color.',
    );
  });
}
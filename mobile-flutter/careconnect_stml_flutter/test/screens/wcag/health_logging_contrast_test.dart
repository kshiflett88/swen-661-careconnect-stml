import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/test_app.dart';
import '../../helpers/wcag_contrast.dart';

import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';

void main() {
  testWidgets('WCAG: Health Logging contrast meets AA for text + buttons', (tester) async {
    final router = buildHealthLoggingTestRouter(store: InMemoryHealthLogStore());
    await tester.pumpWidget(TestApp(router: router));
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

    expectContrastAA(
      foreground: cs.onPrimary,
      background: cs.primary,
      isLargeText: false,
      reason: 'Primary button text must meet >= 4.5:1.',
    );
  });
}

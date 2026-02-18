import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/accessibility_settings_screen.dart'; 

void main() {
  testWidgets('AccessibilitySettings - supports 200% text scaling without overflow', (tester) async {
    FlutterErrorDetails? overflow;

    final prev = FlutterError.onError;
    FlutterError.onError = (details) {
      overflow ??= details;
      prev?.call(details);
    };
    addTearDown(() => FlutterError.onError = prev);

    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(2.0)),
        child: const MaterialApp(home: AccessibilitySettingsScreen()),
      ),
    );
    await tester.pumpAndSettle();

    expect(overflow, isNull);
  });
}

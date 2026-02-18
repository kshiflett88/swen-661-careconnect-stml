import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';

import 'package:careconnect_stml_flutter/screens/profile/profile_screen.dart'; // update path

void main() {
  testWidgets('ProfileScreen - supports 200% text scaling without overflow', (tester) async {
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
        child: const MaterialApp(home: ProfileScreen()),
      ),
    );
    await tester.pumpAndSettle();

    expect(overflow, isNull);
  });
}

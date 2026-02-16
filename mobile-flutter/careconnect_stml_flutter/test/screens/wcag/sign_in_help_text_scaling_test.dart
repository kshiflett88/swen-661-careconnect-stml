import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart';

void main() {
  testWidgets('SignInHelpScreen - supports 200% text scaling without overflow', (tester) async {
    FlutterErrorDetails? overflowError;

    final prevOnError = FlutterError.onError;
    FlutterError.onError = (details) {
      // capture overflow/render errors
      overflowError ??= details;
      prevOnError?.call(details);
    };
    addTearDown(() => FlutterError.onError = prevOnError);

    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(2.0)),
        child: const MaterialApp(home: SignInHelpScreen()),
      ),
    );
    await tester.pumpAndSettle();

    // If there are layout overflows, you'll typically see FlutterError here.
    expect(overflowError, isNull);
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget withTextScale(Widget child, double scale) {
  return MediaQuery(
    data: MediaQueryData(textScaler: TextScaler.linear(scale)),
    child: child,
  );
}

Future<void> pumpNoOverflow(WidgetTester tester, Widget widget) async {
  FlutterErrorDetails? overflow;
  final oldOnError = FlutterError.onError;

  FlutterError.onError = (details) {
    final msg = details.exceptionAsString();
    if (msg.contains('A RenderFlex overflowed') ||
        msg.contains('Overflow') ||
        msg.contains('render overflow')) {
      overflow = details;
    }
    // still forward so test output isn't swallowed
    oldOnError?.call(details);
  };

  await tester.pumpWidget(widget);
  await tester.pumpAndSettle();

  FlutterError.onError = oldOnError;

  expect(
    overflow,
    isNull,
    reason: 'Layout overflow detected under text scaling.',
  );
}

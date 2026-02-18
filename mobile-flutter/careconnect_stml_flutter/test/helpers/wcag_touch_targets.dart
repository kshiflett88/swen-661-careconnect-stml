import 'package:flutter_test/flutter_test.dart';

void expectMinTouchTarget(
  WidgetTester tester,
  Finder finder, {
  double minSize = 48.0,
  String? reason,
}) {
  expect(finder, findsOneWidget);
  final size = tester.getSize(finder);
  expect(
    size.width >= minSize && size.height >= minSize,
    isTrue,
    reason: reason ??
        'Touch target too small: ${size.width.toStringAsFixed(1)}x${size.height.toStringAsFixed(1)} '
        '(min ${minSize.toStringAsFixed(0)}x${minSize.toStringAsFixed(0)}).',
  );
}

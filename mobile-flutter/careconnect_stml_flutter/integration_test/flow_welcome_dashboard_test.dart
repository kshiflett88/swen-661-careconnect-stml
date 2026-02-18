import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_stml_flutter/main.dart' as app;

Future<void> pumpUntilAnyFound(
  WidgetTester tester,
  List<Finder> candidates, {
  Duration timeout = const Duration(seconds: 25),
  Duration step = const Duration(milliseconds: 200),
}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await tester.pump(step);
    for (final f in candidates) {
      if (f.evaluate().isNotEmpty) return;
    }
  }
  throw TestFailure('Timed out waiting for any of: $candidates');
}

Future<void> tapWhenReady(
  WidgetTester tester,
  Finder finder, {
  Duration timeout = const Duration(seconds: 25),
}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await tester.pump(const Duration(milliseconds: 200));
    if (finder.evaluate().isNotEmpty) {
      await tester.ensureVisible(finder);
      await tester.pump(const Duration(milliseconds: 150));
      await tester.tap(finder, warnIfMissed: false);
      await tester.pump(const Duration(milliseconds: 500));
      return;
    }
  }
  throw TestFailure('Timed out waiting to tap: $finder');
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Welcome → Dashboard', (tester) async {
    app.main();

    await tapWhenReady(tester, find.byKey(const Key('face_id_button')));

    await pumpUntilAnyFound(tester, [
      find.text('Schedule'),
      find.textContaining('Schedule'),
      find.text('Emergency'),
      find.textContaining('Emergency'),
      find.text('SOS'),
      find.textContaining('SOS'),
    ]);

    // Hard fail if still on Welcome
    expect(find.byKey(const Key('face_id_button')), findsNothing);
  });
}

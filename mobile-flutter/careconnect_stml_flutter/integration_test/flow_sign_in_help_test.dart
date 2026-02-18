import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_stml_flutter/main.dart' as app;

Future<void> pumpUntilAnyFound(WidgetTester t, List<Finder> c,
    {Duration timeout = const Duration(seconds: 25), Duration step = const Duration(milliseconds: 200)}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await t.pump(step);
    if (c.any((f) => f.evaluate().isNotEmpty)) return;
  }
  throw TestFailure('Timed out waiting for any of: $c');
}

Future<void> tapFirst(WidgetTester t, List<Finder> c) async {
  await pumpUntilAnyFound(t, c);
  final target = c.firstWhere((f) => f.evaluate().isNotEmpty);
  await t.ensureVisible(target);
  await t.pump(const Duration(milliseconds: 150));
  await t.tap(target, warnIfMissed: false);
  await t.pump(const Duration(milliseconds: 650));
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Welcome → Sign-in Help → actions → back to login → dashboard', (tester) async {
    app.main();

    // Open Sign-in Help from Welcome 
    await tapFirst(tester, [
      find.byKey(const Key('help_signing_in_button')),
      find.bySemanticsLabel('I need help signing in'),
      find.textContaining('I need help'),
      find.textContaining('signing in'),
    ]);

    // Your sign_in_help_screen.dart includes these semantics labels (per your grep)
    await tapFirst(tester, [
      find.bySemanticsLabel('Send a message to my caregiver'),
      find.textContaining('Send a'),
      find.textContaining('message'),
    ]);

    await tapFirst(tester, [
      find.bySemanticsLabel('Try Face ID again'),
      find.textContaining('Try Face ID'),
    ]);

    // Back on Welcome → login
    await tapFirst(tester, [find.byKey(const Key('face_id_button'))]);

    // Basic dashboard anchor
    await pumpUntilAnyFound(tester, [find.textContaining('Schedule'), find.textContaining('Emergency'), find.textContaining('SOS')]);
  });
}

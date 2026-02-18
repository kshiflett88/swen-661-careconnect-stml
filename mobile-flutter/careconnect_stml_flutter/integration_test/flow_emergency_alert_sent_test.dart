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

Future<void> tapFirstAvailable(WidgetTester tester, List<Finder> candidates) async {
  await pumpUntilAnyFound(tester, candidates);
  Finder target = candidates.first;
  for (final f in candidates) {
    if (f.evaluate().isNotEmpty) {
      target = f;
      break;
    }
  }
  await tester.ensureVisible(target);
  await tester.pump(const Duration(milliseconds: 150));
  await tester.tap(target, warnIfMissed: false);
  await tester.pump(const Duration(milliseconds: 700));
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Dashboard → Emergency → Confirm → Alert Sent', (tester) async {
    app.main();

    await tapFirstAvailable(tester, [
      find.byKey(const Key('face_id_button')),
    ]);

    await tapFirstAvailable(tester, [
      find.text('Emergency'),
      find.textContaining('Emergency'),
      find.text('SOS'),
      find.textContaining('SOS'),
    ]);

    // EmergencyScreen requires tapping the big SOS button to get to confirmation.
    await tapFirstAvailable(tester, [
      find.text('SOS'),
      find.textContaining('Press to Call for Help'),
      // If you later add a key to the SOS InkWell, include it here.
    ]);

    //Now we should be on EmergencyConfirmationScreen.
    await tapFirstAvailable(tester, [
      find.text('Yes, Send Alert'),
      find.textContaining('Yes, Send Alert'),
      find.textContaining('Send Alert'),
      find.textContaining('Send'),
      find.text('Yes'),
      find.textContaining('Yes'),
      find.byIcon(Icons.check),
    ]);
    // Alert Sent screen: you already have this key in your project
    await pumpUntilAnyFound(tester, [
      find.text('Alert Sent Successfully'),
      find.textContaining('Alert Sent Successfully'),
      find.textContaining('Alert Sent'),
      find.byKey(const Key('focus_return_home_emergency')),
      find.textContaining('Return to Home'),
    ]);

    expect(
      find.textContaining('Alert Sent Successfully').evaluate().isNotEmpty ||
          find.byKey(const Key('focus_return_home_emergency')).evaluate().isNotEmpty,
      true,
    );
  });
}

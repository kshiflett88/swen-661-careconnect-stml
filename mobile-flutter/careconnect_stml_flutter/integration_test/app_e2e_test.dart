import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_stml_flutter/main.dart' as app;

Future<void> pumpUntilFound(
  WidgetTester tester,
  Finder finder, {
  Duration timeout = const Duration(seconds: 20),
  Duration step = const Duration(milliseconds: 200),
}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await tester.pump(step);
    if (finder.evaluate().isNotEmpty) return;
  }
  throw TestFailure('Timed out waiting for: $finder');
}

Future<void> pumpUntilAnyFound(
  WidgetTester tester,
  List<Finder> candidates, {
  Duration timeout = const Duration(seconds: 20),
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
  Duration timeout = const Duration(seconds: 20),
}) async {
  await pumpUntilFound(tester, finder, timeout: timeout);
  await tester.ensureVisible(finder);
  await tester.pump(const Duration(milliseconds: 100));
  await tester.tap(finder);
  await tester.pump(const Duration(milliseconds: 300));
}

Future<void> scrollUntilFound(
  WidgetTester tester,
  Finder target, {
  Finder? scrollable,
  double dy = -300, // negative = scroll down (content moves up)
  int maxScrolls = 20,
}) async {
  // Default to the first scrollable on screen.
  final scroller = scrollable ?? find.byType(Scrollable).first;

  for (var i = 0; i < maxScrolls; i++) {
    if (target.evaluate().isNotEmpty) return;
    await tester.drag(scroller, Offset(0, dy));
    await tester.pump(const Duration(milliseconds: 250));
  }

  throw TestFailure('Could not find $target after scrolling.');
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('CareConnect E2E', () {
    testWidgets('Login -> Tasks -> Return Home', (tester) async {
      app.main();

      // 1) Login (WelcomeLoginScreen)
      final faceId = find.byKey(const Key('face_id_button'));
      await tapWhenReady(tester, faceId);

      // 2) Land on "home" (dashboard or equivalent). We don't assume a "Dashboard" title.
      // Instead, look for any primary navigation entry point.
      // 2) Land on home and navigate via "Schedule"
      final scheduleEntryCandidates = <Finder>[
        find.text('Schedule'),
        find.textContaining('Schedule'),
        find.byIcon(Icons.schedule),
        find.byIcon(Icons.calendar_month),
        find.byIcon(Icons.event),
      ];

      await pumpUntilAnyFound(tester, scheduleEntryCandidates);

      Finder scheduleEntry = scheduleEntryCandidates.first;
      for (final f in scheduleEntryCandidates) {
        if (f.evaluate().isNotEmpty) {
          scheduleEntry = f;
          break;
        }
      }

      await tester.ensureVisible(scheduleEntry);
      await tester.tap(scheduleEntry);
      await tester.pump(const Duration(milliseconds: 400));


      // 3) Task List screen should appear. Use Return Home key as an anchor since it's in your codebase.
      final returnHomeButton = find.byKey(const Key('return_home_button'));
      final returnHomeText = find.text('Return to Home');

      // Scroll until either is built
      await scrollUntilFound(tester, returnHomeText); // or make scrollUntilFound accept "any-of"

      // Prefer tapping the keyed button if present
      final target = returnHomeButton.evaluate().isNotEmpty ? returnHomeButton : returnHomeText;

      // Ensure it’s actually on-screen before tapping
      await tester.ensureVisible(target);
      await tester.pump(const Duration(milliseconds: 200));
      await tester.tap(target);
      await tester.pump(const Duration(milliseconds: 400));
      
    });
  });
}

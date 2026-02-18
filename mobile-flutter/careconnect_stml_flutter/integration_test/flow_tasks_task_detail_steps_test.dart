import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

// Update this import if your entrypoint differs
import 'package:careconnect_stml_flutter/main.dart' as app;

/// Wait until ANY candidate exists.
Future<Finder> waitAny(
  WidgetTester tester,
  List<Finder> candidates, {
  Duration timeout = const Duration(seconds: 25),
  Duration step = const Duration(milliseconds: 200),
}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await tester.pump(step);
    for (final f in candidates) {
      if (f.evaluate().isNotEmpty) return f;
    }
  }
  throw TestFailure('Timed out waiting for any of: $candidates');
}

/// Scroll until target becomes visible (or fail).
Future<void> scrollUntilVisible(
  WidgetTester tester,
  Finder target, {
  double dy = -450,
  int maxScrolls = 35,
}) async {
  Finder scroller = find.byType(Scrollable);
  if (scroller.evaluate().isEmpty) scroller = find.byType(ListView);

  // If we can't scroll, just ensure it exists.
  if (scroller.evaluate().isEmpty) {
    await waitAny(tester, [target]);
    await tester.ensureVisible(target.first);
    await tester.pump(const Duration(milliseconds: 200));
    return;
  }

  for (int i = 0; i < maxScrolls; i++) {
    if (target.evaluate().isNotEmpty) {
      await tester.ensureVisible(target.first);
      await tester.pump(const Duration(milliseconds: 200));
      return;
    }
    await tester.drag(scroller.first, Offset(0, dy));
    await tester.pump(const Duration(milliseconds: 250));
  }

  throw TestFailure('Could not reveal $target after scrolling.');
}

/// Detect if we successfully entered the task detail / step execution screen.
bool isOnTaskDetailOrSteps() {
  return find.textContaining('Step').evaluate().isNotEmpty ||
      find.textContaining('Steps').evaluate().isNotEmpty ||
      find.text('Next').evaluate().isNotEmpty ||
      find.textContaining('Next').evaluate().isNotEmpty ||
      find.byIcon(Icons.navigate_next).evaluate().isNotEmpty;
}

/// Debug helper: prints visible text to help you confirm what screen you're on.
void dumpVisibleText() {
  final texts = <String>{};
  for (final e in find.byType(Text).evaluate()) {
    final w = e.widget as Text;
    final s = w.data;
    if (s != null && s.trim().isNotEmpty) texts.add(s.trim());
  }
  // ignore: avoid_print
  print('VISIBLE TEXTS (first 80):\n${texts.take(80).join('\n')}');
}

/// Tap a finder safely.
Future<void> safeTap(WidgetTester tester, Finder f) async {
  final h = f.first.hitTestable();
  await tester.ensureVisible(h);
  await tester.pump(const Duration(milliseconds: 150));
  await tester.tap(h, warnIfMissed: false);
  await tester.pump(const Duration(milliseconds: 900));
}

/// Robustly tap the FIRST "Start" button by tapping the *button widget*, not the Text.
/// This avoids the common issue where tapping Text doesn't trigger the button.
Future<void> tapFirstStartButton(WidgetTester tester) async {
  // Look for real button widgets with Start label
  Finder startButton = find.widgetWithText(ElevatedButton, 'Start');
  if (startButton.evaluate().isEmpty) {
    startButton = find.widgetWithText(OutlinedButton, 'Start');
  }
  if (startButton.evaluate().isEmpty) {
    startButton = find.widgetWithText(TextButton, 'Start');
  }

  // If exact match isn't used, try textContaining inside buttons
  if (startButton.evaluate().isEmpty) {
    final startText = find.textContaining('Start');
    if (startText.evaluate().isNotEmpty) {
      final elevatedAncestor = find.ancestor(of: startText.first, matching: find.byType(ElevatedButton));
      final outlinedAncestor = find.ancestor(of: startText.first, matching: find.byType(OutlinedButton));
      final textAncestor = find.ancestor(of: startText.first, matching: find.byType(TextButton));

      if (elevatedAncestor.evaluate().isNotEmpty) {
        startButton = elevatedAncestor;
      } else if (outlinedAncestor.evaluate().isNotEmpty) {
        startButton = outlinedAncestor;
      } else if (textAncestor.evaluate().isNotEmpty) {
        startButton = textAncestor;
      }
    }
  }

  // If still empty, fail with context
  if (startButton.evaluate().isEmpty) {
    dumpVisibleText();
    throw TestFailure(
      'Could not find a tappable Start button widget (Elevated/Outlined/TextButton).\n'
      'If your button label is not exactly "Start", update the finder in tapFirstStartButton().',
    );
  }

  // Ensure it is visible (scroll if needed) then tap
  await scrollUntilVisible(tester, startButton);
  await safeTap(tester, startButton);
}

/// Tap Next repeatedly until Next disappears or a completion dialog appears.
Future<void> executeStepsToEnd(WidgetTester tester, {int maxNextTaps = 30}) async {
  await waitAny(tester, [
    find.text('Next'),
    find.textContaining('Next'),
    find.byIcon(Icons.navigate_next),
    find.textContaining('Step'),
  ], timeout: const Duration(seconds: 15));

  for (int i = 0; i < maxNextTaps; i++) {
    // Stop if a dialog appears
    if (find.byType(AlertDialog).evaluate().isNotEmpty || find.byType(Dialog).evaluate().isNotEmpty) {
      return;
    }

    Finder next = find.text('Next');
    if (next.evaluate().isEmpty) next = find.textContaining('Next');
    if (next.evaluate().isEmpty) next = find.byIcon(Icons.navigate_next);

    if (next.evaluate().isEmpty) {
      // No Next: probably end state
      return;
    }

    await safeTap(tester, next);
  }

  throw TestFailure('Still seeing Next after $maxNextTaps taps — step flow may be stuck.');
}

/// Acknowledge completion popup.
Future<void> acknowledgeCompletionPopup(WidgetTester tester) async {
  await waitAny(tester, [
    find.byType(AlertDialog),
    find.byType(Dialog),
    find.textContaining('Completed'),
    find.textContaining('Great'),
    find.textContaining('Done'),
  ], timeout: const Duration(seconds: 15));

  final okCandidates = <Finder>[
    find.text('OK'),
    find.text('Ok'),
    find.text('Done'),
    find.text('Close'),
    find.textContaining('Return'),
    find.textContaining('Home'),
    find.byIcon(Icons.check),
    find.byIcon(Icons.check_circle),
  ];

  for (final c in okCandidates) {
    if (c.evaluate().isNotEmpty) {
      await safeTap(tester, c);
      return;
    }
  }

  dumpVisibleText();
  throw TestFailure('Completion dialog appeared but no OK/Done/Close/Return control was tappable.');
}

Future<void> loginAndGoToSchedule(WidgetTester tester) async {
  // Tap Face ID / Continue / Sign In
  await waitAny(tester, [
    find.byKey(const Key('face_id_button')),
    find.textContaining('Face ID'),
    find.textContaining('Continue'),
    find.textContaining('Sign In'),
  ]);

  final loginCandidates = <Finder>[
    find.byKey(const Key('face_id_button')),
    find.textContaining('Face ID'),
    find.textContaining('Continue'),
    find.textContaining('Sign In'),
  ];
  for (final c in loginCandidates) {
    if (c.evaluate().isNotEmpty) {
      await safeTap(tester, c);
      break;
    }
  }

  // Navigate to Schedule/Tasks screen
  await waitAny(tester, [
    find.text('Schedule'),
    find.textContaining('Schedule'),
    find.text('Tasks'),
    find.textContaining('Tasks'),
    find.byIcon(Icons.calendar_today),
  ]);

  final navCandidates = <Finder>[
    find.text('Schedule'),
    find.textContaining('Schedule'),
    find.text('Tasks'),
    find.textContaining('Tasks'),
    find.byIcon(Icons.calendar_today),
  ];
  for (final c in navCandidates) {
    if (c.evaluate().isNotEmpty) {
      await safeTap(tester, c);
      return;
    }
  }
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets(
    'Tasks flow: tap Start → enter Task Detail → execute steps → completion popup',
    (tester) async {
      app.main();
      await tester.pump(const Duration(milliseconds: 500));

      await loginAndGoToSchedule(tester);

      // Wait for list screen to stabilize
      await waitAny(tester, [
        find.byType(ListView),
        find.byType(Scrollable),
        find.textContaining('Start'),
        find.widgetWithText(ElevatedButton, 'Start'),
        find.widgetWithText(OutlinedButton, 'Start'),
        find.widgetWithText(TextButton, 'Start'),
      ], timeout: const Duration(seconds: 25));

      // ✅ This is the “no guess” opener
      await tapFirstStartButton(tester);

      // ✅ HARD ASSERT: must be in task detail/steps now
      if (!isOnTaskDetailOrSteps()) {
        dumpVisibleText();
        throw TestFailure('Tapped Start but did not enter Task Detail / Steps screen.');
      }

      await executeStepsToEnd(tester, maxNextTaps: 30);
      await acknowledgeCompletionPopup(tester);

      // Optional: confirm we returned somewhere sensible
      await waitAny(tester, [
        find.textContaining('Schedule'),
        find.textContaining('Dashboard'),
        find.textContaining('Tasks'),
        find.textContaining('Start'),
      ], timeout: const Duration(seconds: 20));
    },
  );
}

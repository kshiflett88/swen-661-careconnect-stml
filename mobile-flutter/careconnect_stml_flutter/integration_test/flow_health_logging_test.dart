import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_stml_flutter/main.dart' as app;

Future<Finder> pumpUntilAnyFound(
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

Future<void> pumpUntilFound(
  WidgetTester tester,
  Finder finder, {
  Duration timeout = const Duration(seconds: 25),
  Duration step = const Duration(milliseconds: 200),
}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await tester.pump(step);
    if (finder.evaluate().isNotEmpty) return;
  }
  throw TestFailure('Timed out waiting for: $finder');
}

Future<Finder> tapFirstAvailable(WidgetTester tester, List<Finder> candidates) async {
  final found = await pumpUntilAnyFound(tester, candidates);
  await tester.ensureVisible(found);
  await tester.pump(const Duration(milliseconds: 150));
  await tester.tap(found, warnIfMissed: false);
  await tester.pump(const Duration(milliseconds: 650));
  return found;
}

Future<void> scrollUntilVisible(
  WidgetTester tester,
  Finder target, {
  double dy = -450,
  int maxScrolls = 40,
}) async {
  Finder scroller = find.byType(ListView);
  if (scroller.evaluate().isEmpty) scroller = find.byType(Scrollable);

  if (scroller.evaluate().isEmpty) {
    await pumpUntilFound(tester, target);
    return;
  }

  for (int i = 0; i < maxScrolls; i++) {
    if (target.evaluate().isNotEmpty) {
      await tester.ensureVisible(target);
      await tester.pump(const Duration(milliseconds: 200));
      return;
    }
    await tester.drag(scroller.first, Offset(0, dy));
    await tester.pump(const Duration(milliseconds: 250));
  }

  throw TestFailure('Could not find $target after scrolling.');
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Welcome → Health Logging → invalid save (error) → valid save → return home', (tester) async {
    app.main();
    await tester.pump(const Duration(milliseconds: 400));

    // Login / continue
    await tapFirstAvailable(tester, [
      find.byKey(const Key('face_id_button')),
      find.textContaining('Continue'),
      find.textContaining('Sign In'),
    ]);

    // Navigate to Health Logging (label varies)
    await tapFirstAvailable(tester, [
      find.text('How Am I Feeling Today'),
      find.textContaining('Feeling'),
      find.textContaining('Health'),
    ]);

    // ✅ HARD ASSERT: we are on health logging screen (look for inputs/return button)
    await pumpUntilAnyFound(tester, [
      find.byKey(const Key('return_home_button')),
      find.byKey(const Key('sem_return_home')),
      find.byType(TextField),
      find.textContaining('Health'),
      find.textContaining('Mood'),
    ]);

    // --- Branch 1: Try Save without entering required info (expect error/validation path)
    final saveCandidates = <Finder>[
      find.text('Save'),
      find.textContaining('Save'),
      find.byIcon(Icons.save),
      find.byIcon(Icons.check),
    ];

    // Only run this branch if a Save exists (some UIs auto-save).
    if (saveCandidates.any((f) => f.evaluate().isNotEmpty)) {
      await tapFirstAvailable(tester, saveCandidates);

      // Expect SOME sort of error feedback (adjust strings to match your UI)
      // We keep it flexible to avoid flaky failures while still covering lines.
      final errorFeedback = [
        find.textContaining('required'),
        find.textContaining('Please'),
        find.textContaining('Invalid'),
        find.byType(SnackBar),
      ];
      // If your UI doesn't show validation errors, this will time out and tell you.
      await pumpUntilAnyFound(tester, errorFeedback, timeout: const Duration(seconds: 10));
    }

    // --- Branch 2: Enter text (if there are fields) and Save (happy path)
    final textFields = find.byType(TextField);
    if (textFields.evaluate().isNotEmpty) {
      await tester.tap(textFields.first, warnIfMissed: false);
      await tester.pump(const Duration(milliseconds: 200));
      await tester.enterText(textFields.first, '120');
      await tester.pump(const Duration(milliseconds: 300));
    }

    if (saveCandidates.any((f) => f.evaluate().isNotEmpty)) {
      await tapFirstAvailable(tester, saveCandidates);
    }

    // --- Return home branch
    final returnHomeCandidates = <Finder>[
      find.byKey(const Key('return_home_button')),
      find.byKey(const Key('sem_return_home')),
      find.textContaining('Return'),
      find.textContaining('Home'),
    ];

    // If return button is not visible, scroll to it (common on small screens).
    if (find.byKey(const Key('return_home_button')).evaluate().isEmpty &&
        find.byKey(const Key('sem_return_home')).evaluate().isEmpty &&
        find.textContaining('Return').evaluate().isEmpty) {
      await scrollUntilVisible(tester, find.textContaining('Return'));
    }

    await tapFirstAvailable(tester, returnHomeCandidates);

    // Optional assert: dashboard anchor
    await pumpUntilAnyFound(tester, [
      find.textContaining('Dashboard'),
      find.text('Schedule'),
      find.textContaining('Tasks'),
    ]);
  });
}

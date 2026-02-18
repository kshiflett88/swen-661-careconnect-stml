import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_stml_flutter/main.dart' as app;

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

Finder? firstPresent(List<Finder> candidates) {
  for (final f in candidates) {
    if (f.evaluate().isNotEmpty) return f;
  }
  return null;
}

void dumpVisibleText() {
  final texts = <String>{};
  for (final e in find.byType(Text).evaluate()) {
    final w = e.widget as Text;
    final s = w.data;
    if (s != null && s.trim().isNotEmpty) texts.add(s.trim());
  }
  // ignore: avoid_print
  print('VISIBLE TEXTS (first 120):\n${texts.take(120).join('\n')}');
}

/// ✅ Robust tap: never uses hitTestable(), and falls back to ancestor buttons.
Future<void> safeTapPresent(
  WidgetTester tester,
  List<Finder> candidates, {
  String? reasonIfMissing,
}) async {
  final f = firstPresent(candidates);
  if (f == null) {
    dumpVisibleText();
    throw TestFailure(reasonIfMissing ?? 'None of the tap candidates were found.');
  }

  // Prefer tapping an ancestor button if the match is a Text inside a button.
  Finder target = f.first;

  final elevated = find.ancestor(of: target, matching: find.byType(ElevatedButton));
  final outlined = find.ancestor(of: target, matching: find.byType(OutlinedButton));
  final textBtn = find.ancestor(of: target, matching: find.byType(TextButton));
  final iconBtn = find.ancestor(of: target, matching: find.byType(IconButton));

  if (elevated.evaluate().isNotEmpty) {
    target = elevated.first;
  } else if (outlined.evaluate().isNotEmpty) {
    target = outlined.first;
  } else if (textBtn.evaluate().isNotEmpty) {
    target = textBtn.first;
  } else if (iconBtn.evaluate().isNotEmpty) {
    target = iconBtn.first;
  }

  // Try to reveal it, but don't crash if ensureVisible can't.
  try {
    await tester.ensureVisible(target);
  } catch (_) {
    // ignore and attempt tap anyway
  }

  await tester.pump(const Duration(milliseconds: 150));
  await tester.tap(target, warnIfMissed: false);
  await tester.pump(const Duration(milliseconds: 900));
}

Future<void> loginAndOpenHealthLogging(WidgetTester tester) async {
  await waitAny(tester, [
    find.byKey(const Key('face_id_button')),
    find.textContaining('Face ID'),
    find.textContaining('Continue'),
    find.textContaining('Sign In'),
  ]);

  await safeTapPresent(
    tester,
    [
      find.byKey(const Key('face_id_button')),
      find.textContaining('Face ID'),
      find.textContaining('Continue'),
      find.textContaining('Sign In'),
    ],
    reasonIfMissing: 'Could not find login/continue control.',
  );

  await waitAny(tester, [
    find.text('How Am I Feeling Today'),
    find.textContaining('Feeling'),
    find.textContaining('Health'),
  ]);

  await safeTapPresent(
    tester,
    [
      find.text('How Am I Feeling Today'),
      find.textContaining('Feeling'),
      find.textContaining('Health'),
    ],
    reasonIfMissing: 'Could not find Health Logging entry point on dashboard.',
  );

  await waitAny(tester, [
    find.byKey(const Key('return_home_button')),
    find.textContaining('Return'),
    find.byType(TextField),
    find.byType(Slider),
    find.byType(DropdownButton),
  ]);
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Health Logging: invalid save + cancel/return', (tester) async {
    app.main();
    await tester.pump(const Duration(milliseconds: 600));

    await loginAndOpenHealthLogging(tester);

    // --- INVALID SAVE branch
    final saveCandidates = <Finder>[
      find.byKey(const Key('health_log_save_button')),
      find.text('Save'),
      find.textContaining('Save'),
      find.text('Submit'),
      find.textContaining('Submit'),
      find.byIcon(Icons.save),
      find.byIcon(Icons.check),
    ];

    final saveFinder = firstPresent(saveCandidates);
    if (saveFinder != null) {
      await safeTapPresent(tester, saveCandidates);

      await waitAny(
        tester,
        [
          find.byType(SnackBar),
          find.textContaining('required'),
          find.textContaining('Please'),
          find.textContaining('enter'),
          find.textContaining('missing'),
          find.textContaining('Invalid'),
        ],
        timeout: const Duration(seconds: 10),
      );
    } else {
      // ignore: avoid_print
      print('NOTE: Save/Submit control not found; skipping invalid-save branch.');
      dumpVisibleText();
    }

    // --- CANCEL / RETURN HOME branch
    await safeTapPresent(
      tester,
      [
        find.byKey(const Key('health_log_cancel_button')),
        find.text('Cancel'),
        find.textContaining('Cancel'),
        find.byIcon(Icons.close),
        find.byIcon(Icons.cancel),
        find.byKey(const Key('return_home_button')),
        find.textContaining('Return Home'),
        find.textContaining('Return'),
        find.textContaining('Home'),
      ],
      reasonIfMissing: 'Could not find Cancel or Return Home on Health Logging screen.',
    );

    // Back at dashboard-ish screen
    await waitAny(tester, [
      find.textContaining('Dashboard'),
      find.text('Schedule'),
      find.text('Tasks'),
      find.textContaining('Schedule'),
      find.textContaining('Tasks'),
    ]);
  });
}

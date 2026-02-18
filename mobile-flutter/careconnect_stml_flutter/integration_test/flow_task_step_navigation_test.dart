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

Future<void> tapTextOrAncestor(WidgetTester tester, Finder textFinder) async {
  await pumpUntilAnyFound(tester, [textFinder]);

  // Try tapping the text first
  try {
    await tester.ensureVisible(textFinder);
    await tester.pump(const Duration(milliseconds: 100));
    await tester.tap(textFinder, warnIfMissed: false);
    await tester.pump(const Duration(milliseconds: 600));
    return;
  } catch (_) {
    // fall through to ancestor
  }

  final ancestorCandidates = <Finder>[
    find.ancestor(of: textFinder, matching: find.byType(InkWell)).hitTestable(),
    find.ancestor(of: textFinder, matching: find.byType(GestureDetector)).hitTestable(),
    find.ancestor(of: textFinder, matching: find.byType(ListTile)).hitTestable(),
    find.ancestor(of: textFinder, matching: find.byType(Card)).hitTestable(),
    find.ancestor(of: textFinder, matching: find.byType(OutlinedButton)).hitTestable(),
    find.ancestor(of: textFinder, matching: find.byType(ElevatedButton)).hitTestable(),
    find.ancestor(of: textFinder, matching: find.byType(TextButton)).hitTestable(),
  ];

  for (final a in ancestorCandidates) {
    if (a.evaluate().isNotEmpty) {
      await tester.ensureVisible(a.first);
      await tester.pump(const Duration(milliseconds: 100));
      await tester.tap(a.first, warnIfMissed: false);
      await tester.pump(const Duration(milliseconds: 600));
      return;
    }
  }

  throw TestFailure('Could not find tappable ancestor for $textFinder');
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Dashboard → Tasks → open first task → step navigation', (tester) async {
    app.main();

    await tapFirstAvailable(tester, [find.byKey(const Key('face_id_button'))]);

    await tapFirstAvailable(tester, [
      find.text('Schedule'),
      find.textContaining('Schedule'),
    ]);

    final knownTitle = <Finder>[
      find.textContaining('Drink Water'),
      find.textContaining('Go for a Walk'),
      find.textContaining('Walk'),
      find.textContaining('Water'),
    ];

    final startText = find.text('Start');

    if (knownTitle.any((f) => f.evaluate().isNotEmpty)) {
      final first = knownTitle.firstWhere((f) => f.evaluate().isNotEmpty);
      await tapTextOrAncestor(tester, first);
    } else {
      // Fallback: tap the first Start, or a card around it
      await pumpUntilAnyFound(tester, [startText]);
      final firstStart = startText.first;

      final card = find.ancestor(of: firstStart, matching: find.byType(Card)).hitTestable();
      final tile = find.ancestor(of: firstStart, matching: find.byType(ListTile)).hitTestable();
      final ink = find.ancestor(of: firstStart, matching: find.byType(InkWell)).hitTestable();

      Finder openTarget = firstStart;
      if (card.evaluate().isNotEmpty) openTarget = card.first;
      else if (tile.evaluate().isNotEmpty) openTarget = tile.first;
      else if (ink.evaluate().isNotEmpty) openTarget = ink.first;

      await tapFirstAvailable(tester, [openTarget]);
    }

    // Try a couple of "Next" presses, then a "Back".
    final nextCandidates = <Finder>[
      find.text('Next'),
      find.textContaining('Next'),
      find.byIcon(Icons.navigate_next),
      find.byIcon(Icons.arrow_forward),
    ];

    final backCandidates = <Finder>[
      find.text('Back'),
      find.textContaining('Back'),
      find.byIcon(Icons.navigate_before),
      find.byIcon(Icons.arrow_back),
      find.byTooltip('Back'),
    ];

    // If your task detail uses "Step 1/2/3" buttons, these help too:
    final stepCandidates = <Finder>[
      find.textContaining('Step'),
    ];

    // Do a "Next" if it exists
    if (nextCandidates.any((f) => f.evaluate().isNotEmpty)) {
      await tapFirstAvailable(tester, nextCandidates);
      if (nextCandidates.any((f) => f.evaluate().isNotEmpty)) {
        await tapFirstAvailable(tester, nextCandidates);
      }
    } else if (stepCandidates.any((f) => f.evaluate().isNotEmpty)) {
      // Tap something step-like to exercise navigation logic
      await tapFirstAvailable(tester, stepCandidates);
    } 

    // Do a "Back" if present (optional)
    if (backCandidates.any((f) => f.evaluate().isNotEmpty)) {
      await tapFirstAvailable(tester, backCandidates);
    }
  });
}

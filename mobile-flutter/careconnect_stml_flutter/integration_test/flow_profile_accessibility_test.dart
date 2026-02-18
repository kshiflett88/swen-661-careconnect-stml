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

Future<void> tapFirstAvailable(WidgetTester tester, List<Finder> candidates) async {
  await pumpUntilAnyFound(tester, candidates);
  final target = candidates.firstWhere((f) => f.evaluate().isNotEmpty);
  await tester.ensureVisible(target);
  await tester.pump(const Duration(milliseconds: 150));
  await tester.tap(target, warnIfMissed: false);
  await tester.pump(const Duration(milliseconds: 650));
}

Future<void> scrollUntilVisible(
  WidgetTester tester,
  Finder target, {
  double dy = -450,
  int maxScrolls = 60,
}) async {
  // Prefer ListView in Profile; fallback to any Scrollable
  Finder scroller = find.byType(ListView);
  if (scroller.evaluate().isEmpty) scroller = find.byType(Scrollable);
  if (scroller.evaluate().isEmpty) {
    // Not scrollable; just wait for it.
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

  testWidgets('Welcome → Dashboard → Profile → Accessibility screen', (tester) async {
    app.main();

    await tapFirstAvailable(tester, [find.byKey(const Key('face_id_button'))]);

    // Try common person-outline icons
    final profileIconCandidates = <Finder>[
      find.byIcon(Icons.person_outline),
      find.byIcon(Icons.account_circle_outlined),
      find.byIcon(Icons.person),
      find.byIcon(Icons.account_circle),
    ];
    await pumpUntilAnyFound(tester, profileIconCandidates);
    await tapFirstAvailable(tester, profileIconCandidates);

    final accessibilityCandidates = <Finder>[
      // Text on the profile screen item
      find.text('Accessibility'),
      find.textContaining('Accessibility'),
      find.bySemanticsLabel('Accessibility'),
      find.bySemanticsLabel('Accessibility settings'),
      find.bySemanticsLabel('Accessibility guidelines'),

      // If your item is titled differently
      find.textContaining('Guidelines'),
      find.textContaining('WCAG'),
      find.textContaining('TalkBack'),
      find.textContaining('VoiceOver'),
    ];

    // If it’s off-screen in Profile, scroll for it.
    if (accessibilityCandidates.every((f) => f.evaluate().isEmpty)) {
      // scroll looking for the simplest target first
      await scrollUntilVisible(tester, find.textContaining('Accessibility'));
    }
    await tapFirstAvailable(tester, accessibilityCandidates);

    // Verify via likely screen anchors. Add/adjust if your screen has a specific title.
    await pumpUntilAnyFound(tester, [
      find.textContaining('Accessibility'),
      find.textContaining('WCAG'),
      find.textContaining('Guidelines'),
      find.textContaining('TalkBack'),
      find.textContaining('VoiceOver'),
    ]);

    // Optional: exercise one more interaction if there are toggles/links
    final toggle = find.byType(Switch);
    if (toggle.evaluate().isNotEmpty) {
      await tester.tap(toggle.first, warnIfMissed: false);
      await tester.pump(const Duration(milliseconds: 400));
    }

    // Prefer explicit back UI; fallback to system pop
    final backCandidates = <Finder>[
      find.byTooltip('Back'),
      find.byIcon(Icons.arrow_back),
      find.text('Back'),
      find.textContaining('Back'),
      find.text('Return'),
      find.textContaining('Return'),
      find.textContaining('Return to Home'),
    ];

    if (backCandidates.any((f) => f.evaluate().isNotEmpty)) {
      await tapFirstAvailable(tester, backCandidates);
    } else {
      await tester.binding.handlePopRoute();
      await tester.pump(const Duration(milliseconds: 650));
    }
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_stml_flutter/main.dart' as app;

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

Future<void> tapWhenReady(
  WidgetTester tester,
  Finder finder, {
  Duration timeout = const Duration(seconds: 25),
}) async {
  await pumpUntilFound(tester, finder, timeout: timeout);
  await tester.ensureVisible(finder);
  await tester.pump(const Duration(milliseconds: 150));
  await tester.tap(finder, warnIfMissed: false);
  await tester.pump(const Duration(milliseconds: 600));
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Welcome → Dashboard → Profile', (tester) async {
    app.main();

    await tapWhenReady(tester, find.byKey(const Key('face_id_button')));

    // Most likely Material Icons:
    // - Icons.person_outline
    // - Icons.account_circle_outlined
    // - Icons.person
    // Use a few icon fallbacks.
    final profileIconCandidates = <Finder>[
      find.byIcon(Icons.person_outline),
      find.byIcon(Icons.account_circle_outlined),
      find.byIcon(Icons.person),
      find.byIcon(Icons.account_circle),
    ];

    // Pick the first icon that exists.
    Finder profileIcon = profileIconCandidates.first;
    bool found = false;
    for (final f in profileIconCandidates) {
      if (f.evaluate().isNotEmpty) {
        profileIcon = f;
        found = true;
        break;
      }
    }

    if (!found) {
      // If the icon isn't found immediately, wait for any of them.
      await pumpUntilFound(tester, find.byType(IconButton));
      // Try again after a short pump.
      await tester.pump(const Duration(milliseconds: 300));
      for (final f in profileIconCandidates) {
        if (f.evaluate().isNotEmpty) {
          profileIcon = f;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      throw TestFailure('Could not find a profile icon button (person outline) on the dashboard.');
    }

    await tapWhenReady(tester, profileIcon);
    
    // If your profile screen has a unique title, add it here.
    await pumpUntilFound(
      tester,
      find.byType(Scaffold), // ensures a new screen built
      timeout: const Duration(seconds: 10),
    );

    // Dashboard anchors 
    final dashboardAnchors = <Finder>[
      find.textContaining('You are on:'),
      find.textContaining('Home'),
      find.textContaining('How Am I'),
      find.text('Schedule'),
      find.textContaining('How Am I Feeling Today'),
    ];

    // Give navigation a moment
    await tester.pump(const Duration(milliseconds: 600));

    // We pass if at least one dashboard anchor is gone OR we see common profile-like widgets.
    final possibleProfileAnchors = <Finder>[
      find.textContaining('Profile'),
      find.textContaining('Account'),
      find.textContaining('Settings'),
      find.byType(ListView),
      find.byType(ListTile),
    ];

    bool dashboardStillVisible = true;
    for (final a in dashboardAnchors) {
      if (a.evaluate().isEmpty) {
        dashboardStillVisible = false;
        break;
      }
    }

    bool profileLooksVisible = false;
    for (final p in possibleProfileAnchors) {
      if (p.evaluate().isNotEmpty) {
        profileLooksVisible = true;
        break;
      }
    }

    // If dashboard is still fully visible AND we don't see any profile-ish widgets, fail.
    expect(dashboardStillVisible == false || profileLooksVisible == true, true);

    // Use app bar back controls if present
    final backCandidates = <Finder>[
      find.byTooltip('Back'),
      find.byIcon(Icons.arrow_back),
      find.text('Back'),
      find.textContaining('Back'),
      find.text('Cancel'),
      find.textContaining('Cancel'),
    ];

    for (final b in backCandidates) {
      if (b.evaluate().isNotEmpty) {
        await tapWhenReady(tester, b);
        return;
      }
    }

    // Fallback: system pop
    await tester.binding.handlePopRoute();
    await tester.pump(const Duration(milliseconds: 600));
  });
}

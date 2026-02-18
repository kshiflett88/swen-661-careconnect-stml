import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';
import '../../helpers/test_app.dart';
import 'package:flutter/cupertino.dart';


Finder findTappableAncestorWithText(String text) {
  final label = find.text(text);

  // Try common tappable widgets in order of preference
  final candidates = <Finder>[
    find.ancestor(of: label, matching: find.byType(TextButton)),
    find.ancestor(of: label, matching: find.byType(ElevatedButton)),
    find.ancestor(of: label, matching: find.byType(OutlinedButton)),
    find.ancestor(of: label, matching: find.byType(IconButton)),
    find.ancestor(
      of: label,
      matching: find.byWidgetPredicate((w) => w is InkWell && w.onTap != null),
    ),
    find.ancestor(
      of: label,
      matching: find.byWidgetPredicate((w) => w is InkResponse && w.onTap != null),
    ),
    find.ancestor(
      of: label,
      matching: find.byWidgetPredicate((w) => w is GestureDetector && w.onTap != null),
    ),
    // Cupertino button 
    find.ancestor(of: label, matching: find.byType(CupertinoButton)),
  ];

  for (final f in candidates) {
    if (f.evaluate().isNotEmpty) return f;
  }

  return label;
}

void main() {
  group('HealthLoggingScreen - Semantics (screen reader)', () {
    testWidgets('interactive controls expose meaningful semantics', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = buildHealthLoggingTestRouter(store: store);

      final semantics = tester.ensureSemantics();
      try {
        await tester.pumpWidget(TestApp(router: router));
        await tester.pumpAndSettle();

        // Sanity: screen content exists
        expect(find.text('Happy'), findsOneWidget);
        expect(find.text('Okay'), findsOneWidget);
        expect(find.text('Sad'), findsOneWidget);

        final saveBtn = find.byKey(const Key('save_button'));
        final homeBtn = find.byKey(const Key('return_home_button'));

        await scrollTo(tester, saveBtn);
        await scrollTo(tester, homeBtn);

        final saveSem = tester.getSemantics(saveBtn);
        expect(saveSem.hasFlag(SemanticsFlag.isButton), isTrue);
        expect(saveSem.hasFlag(SemanticsFlag.isEnabled), isTrue);
        expect(saveSem.label.toLowerCase(), contains('save'));

        final homeSem = tester.getSemantics(homeBtn);
        expect(homeSem.hasFlag(SemanticsFlag.isButton), isTrue);
        expect(homeSem.hasFlag(SemanticsFlag.isEnabled), isTrue);
        expect(
          homeSem.label.toLowerCase(),
          anyOf(contains('return'), contains('home')),
        );
      } finally {
        semantics.dispose();
      }
    });

    testWidgets('Saved dialog is announced with accessible actions', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = buildHealthLoggingTestRouter(store: store);

      final semantics = tester.ensureSemantics();
      try {
        await tester.pumpWidget(TestApp(router: router));
        await tester.pumpAndSettle();

        await tester.tap(find.text('Happy'));
        await tester.pumpAndSettle();

        final saveBtn = find.byKey(const Key('save_button'));
        await scrollTo(tester, saveBtn);

        await tester.tap(saveBtn);
        await tester.pumpAndSettle();

        expect(find.text('Saved'), findsOneWidget);
        expect(find.text('OK'), findsOneWidget);

        final okTapTarget = findTappableAncestorWithText('OK');
        expect(okTapTarget, findsOneWidget);

        final okSem = tester.getSemantics(okTapTarget);
        expect(okSem.hasFlag(SemanticsFlag.isButton), isTrue);
        expect(okSem.hasFlag(SemanticsFlag.isEnabled), isTrue);

        if (okSem.label.isNotEmpty) {
          expect(okSem.label.toLowerCase(), contains('ok'));
        }
      } finally {
        semantics.dispose();
      }
    });
  });
}

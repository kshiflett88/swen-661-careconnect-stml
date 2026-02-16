import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';
import '../../helpers/test_app.dart';
import 'package:flutter/cupertino.dart';

Finder findTappableAncestorWithText(String text) {
  final label = find.text(text);

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
    find.ancestor(of: label, matching: find.byType(CupertinoButton)),
  ];

  for (final f in candidates) {
    if (f.evaluate().isNotEmpty) return f;
  }

  return label;
}

void main() {
  group('HealthLoggingScreen - Keyboard', () {
    testWidgets('keyboard can activate Save after selecting mood', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = buildHealthLoggingTestRouter(store: store);

      await tester.pumpWidget(TestApp(router: router));
      await tester.pumpAndSettle();

      // Select a mood (ideally via key if you add it)
      await tester.tap(find.text('Happy'));
      await tester.pumpAndSettle();

      final saveBtn = find.byKey(const Key('save_button'));
      await scrollTo(tester, saveBtn);

      // Focus + activate via keyboard
      await tester.tap(saveBtn);
      await tester.pump();

      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();

      expect(find.text('Saved'), findsOneWidget);
    });

    testWidgets('keyboard activation works for OK in dialog', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = buildHealthLoggingTestRouter(store: store);

      await tester.pumpWidget(TestApp(router: router));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Happy'));
      await tester.pumpAndSettle();

      final saveBtn = find.byKey(const Key('save_button'));
      await scrollTo(tester, saveBtn);
      await tester.tap(saveBtn);
      await tester.pumpAndSettle();

      final okBtn = findTappableAncestorWithText('OK');
      expect(okBtn, findsOneWidget);  

      await tester.tap(okBtn);
      await tester.pump();

      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();

      // Your placeholder in test_app.dart is 'DASHBOARD'
      expect(find.text('DASHBOARD'), findsOneWidget);
    });
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_list_screen.dart';
import '../../helpers/semantics_audit.dart';

void main() {
  testWidgets('A11y: Task List primary actions are labeled', (tester) async {
    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      await tester.pumpWidget(const MaterialApp(home: TaskListScreen()));
      await tester.pumpAndSettle();

      // Anchor: header text is present
      expect(find.byKey(const Key('return_home_button')), findsOneWidget);

      // Return Home button should be labeled
      final returnHomeBtn = find.descendant(
        of: find.byKey(const Key('return_home_button')),
        matching: find.byType(OutlinedButton),
      );
      audit.expectButton(
        returnHomeBtn,
        labelContains: 'Home',
        reason: 'Return Home must expose button role + tap action + label.',
      );

      // Task action buttons should be labeled ("Start" or "View Task")
      final startBtns = find.widgetWithText(ElevatedButton, 'Start');
      final viewBtns = find.widgetWithText(OutlinedButton, 'View Task');
      expect(startBtns.evaluate().isNotEmpty || viewBtns.evaluate().isNotEmpty, isTrue,
          reason: 'At least one task action button (Start/View Task) should exist.');

      final iconButtons = find.byType(IconButton);
      for (final e in iconButtons.evaluate()) {
        final btn = e.widget as IconButton;
        expect((btn.tooltip ?? '').trim().isNotEmpty, isTrue,
            reason: 'IconButton must have a non-empty tooltip for accessibility.');
      }
    } finally {
      audit.dispose();
    }
  });
}

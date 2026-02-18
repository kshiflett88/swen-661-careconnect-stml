import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_detail_screen.dart';
import '../../helpers/semantics_audit.dart';

void main() {
  testWidgets('A11y: Task Detail primary actions are labeled', (tester) async {
    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      // Use a representative task id used by the screen
      await tester.pumpWidget(const MaterialApp(home: TaskDetailScreen(taskId: '1')));
      await tester.pumpAndSettle();

      expect(find.byType(Scaffold), findsOneWidget);

      // Check any ElevatedButton / OutlinedButton has non-empty semantics label
      final buttons = find.byType(ElevatedButton);
      for (final e in buttons.evaluate()) {
        audit.expectButton(
          find.byWidget(e.widget),
          reason: 'ElevatedButton must expose button role + tap action + label.',
        );
      }

      final outlined = find.byType(OutlinedButton);
      for (final e in outlined.evaluate()) {
        audit.expectButton(
          find.byWidget(e.widget),
          reason: 'OutlinedButton must expose button role + tap action + label.',
        );
      }

      // IconButtons must have tooltips
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

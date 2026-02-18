import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_list_screen.dart';
import '../../helpers/wcag_touch_targets.dart';

void main() {
  testWidgets('WCAG: Task List touch targets are >= 48x48', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: TaskListScreen()));
    await tester.pumpAndSettle();

    final returnHomeBtn = find.descendant(
      of: find.byKey(const Key('return_home_button')),
      matching: find.byType(OutlinedButton),
    );
    expectMinTouchTarget(tester, returnHomeBtn, reason: 'Return Home must be >= 48x48.');

    // One task action button must meet size
    final startBtns = find.widgetWithText(ElevatedButton, 'Start');
    final viewBtns = find.widgetWithText(OutlinedButton, 'View Task');

    if (tester.any(startBtns)) {
      expectMinTouchTarget(tester, startBtns.first, reason: 'Start must be >= 48x48.');
    } else if (tester.any(viewBtns)) {
      expectMinTouchTarget(tester, viewBtns.first, reason: 'View Task must be >= 48x48.');
    } else {
      fail('No task action button found to validate touch target size.');
    }
  });
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_list_screen.dart';

void main() {
  testWidgets('Keyboard: Task List Tab traversal reaches Return Home', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: TaskListScreen()));
    await tester.pumpAndSettle();

    // These keys will be added to the UI in the next step:
    final firstAction = find.byKey(const Key('focus_task_0_action'));
    final returnHome = find.byKey(const Key('focus_return_home'));

    expect(firstAction, findsOneWidget);
    expect(returnHome, findsOneWidget);

    bool hasFocus(Finder f) => Focus.of(tester.element(f)).hasFocus;

    // First task action should autofocus
    expect(hasFocus(firstAction), isTrue);

    // Tab until Return Home is focused
    for (int i = 0; i < 40; i++) {
      if (hasFocus(returnHome)) break;
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
    }

    expect(hasFocus(returnHome), isTrue);
  });
}

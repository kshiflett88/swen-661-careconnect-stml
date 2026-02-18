import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_detail_screen.dart';

void main() {
  testWidgets('Keyboard: Task Detail Tab order is logical', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: TaskDetailScreen(taskId: '1')));
    await tester.pumpAndSettle();

    final primary = find.byKey(const Key('focus_task_detail_primary'));
    final ret = find.byKey(const Key('focus_task_detail_return'));

    expect(primary, findsOneWidget);
    expect(ret, findsOneWidget);

    bool hasFocus(Finder f) => Focus.of(tester.element(f)).hasFocus;

    // Primary CTA should autofocus
    expect(hasFocus(primary), isTrue);

    // Tab -> Return to Tasks
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(hasFocus(ret), isTrue);

    // Shift+Tab -> back to Primary
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pump();
    expect(hasFocus(primary), isTrue);
  });
}

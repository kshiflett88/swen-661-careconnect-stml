import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_detail_screen.dart';
import '../../helpers/wcag_text_scaling.dart';

void main() {
  testWidgets('WCAG: Task Detail supports 200% text scaling without overflow', (tester) async {
    await pumpNoOverflow(
      tester,
      withTextScale(const MaterialApp(home: TaskDetailScreen(taskId: '1')), 2.0),
    );

    expect(find.byType(TaskDetailScreen), findsOneWidget);
  });
}

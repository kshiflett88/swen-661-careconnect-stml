import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/tasks/task_detail_screen.dart';
import '../../helpers/wcag_touch_targets.dart';

void main() {
  testWidgets('WCAG: Task Detail touch targets are >= 48x48', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: TaskDetailScreen(taskId: '1')));
    await tester.pumpAndSettle();

    // Check every IconButton meets min target (common a11y requirement)
    final iconButtons = find.byType(IconButton);
    for (final e in iconButtons.evaluate()) {
      expectMinTouchTarget(tester, find.byWidget(e.widget),
          reason: 'IconButton touch target must be >= 48x48.');
    }

    // Also check at least one primary action button is >= 48x48
    final elevated = find.byType(ElevatedButton);
    if (tester.any(elevated)) {
      expectMinTouchTarget(tester, elevated.first,
          reason: 'Primary action must be >= 48x48.');
    }
  });
}


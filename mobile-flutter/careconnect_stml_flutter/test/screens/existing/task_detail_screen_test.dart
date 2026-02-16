import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/tasks/task_detail_screen.dart';
import 'package:careconnect_stml_flutter/shared/mocks/mock_tasks.dart';
import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';

class _PlaceholderDashboard extends StatelessWidget {
  const _PlaceholderDashboard();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('DASHBOARD')));
  }
}

class _PlaceholderTaskList extends StatelessWidget {
  const _PlaceholderTaskList();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('TASK LIST')));
  }
}

GoRouter _buildTestRouter({
  required String taskId,
  required TaskStatusStore store,
  String? initialLocation,
}) {
  return GoRouter(
    initialLocation: initialLocation ?? AppRoutes.taskDetail.replaceFirst(':id', taskId),
    routes: [
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => const _PlaceholderDashboard(),
      ),
      GoRoute(
        path: AppRoutes.taskList,
        builder: (context, state) => const _PlaceholderTaskList(),
      ),
      GoRoute(
        path: AppRoutes.taskDetail,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? taskId;
          return TaskDetailScreen(taskId: id, store: store);
        },
      ),
    ],
  );
}

class _TestApp extends StatelessWidget {
  final GoRouter router;
  const _TestApp({required this.router});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(routerConfig: router);
  }
}

Future<void> _scrollTo(WidgetTester tester, Finder finder) async {
  await tester.scrollUntilVisible(
    finder,
    250,
    scrollable: find.byType(Scrollable),
  );
  await tester.pump();
}

bool _richTextContains(WidgetTester tester, String needle) {
  final richTexts = find.byType(RichText);
  for (final element in richTexts.evaluate()) {
    final rt = tester.widget<RichText>(find.byWidget(element.widget));
    final text = rt.text;
    if (text is TextSpan) {
      final plain = text.toPlainText();
      if (plain.contains(needle)) return true;
    }
  }
  return false;
}

Finder _primaryCtaFinder() {
  // Primary CTA is the ElevatedButton in this screen (Next Step / Mark Done / Next)
  return find.byType(ElevatedButton);
}

Finder _stepOfFinder() {
  // Only matches the progress label like "Step 1 of 3"
  return find.byWidgetPredicate((w) {
    return w is Text &&
        (w.data ?? '').contains('Step ') &&
        RegExp(r'^Step \d+ of \d+$').hasMatch(w.data ?? '');
  });
}


int _currentStepIndexFromLabel(String label) {
  // label: "Step 2 of 4"
  final match = RegExp(r'Step (\d+) of (\d+)').firstMatch(label);
  if (match == null) return 1;
  return int.parse(match.group(1)!);
}

int _totalStepsFromLabel(String label) {
  final match = RegExp(r'Step (\d+) of (\d+)').firstMatch(label);
  if (match == null) return 1;
  return int.parse(match.group(2)!);
}

Future<void> _advanceToLastStep(WidgetTester tester) async {
  final stepOf = _stepOfFinder();
  expect(stepOf, findsOneWidget);

  String labelText = tester.widget<Text>(stepOf).data!;
  final total = _totalStepsFromLabel(labelText);

  for (int i = 1; i < total; i++) {
    final cta = _primaryCtaFinder();
    expect(cta, findsOneWidget);

    await tester.scrollUntilVisible(cta, 250, scrollable: find.byType(Scrollable));
    await tester.tap(cta);
    await tester.pump(); // step increments
  }

  // sanity check: now we're on last step
  labelText = tester.widget<Text>(stepOf).data!;
  expect(_currentStepIndexFromLabel(labelText), equals(_totalStepsFromLabel(labelText)));
}

void main() {
  group('TaskDetailScreen', () {
    final String taskId = mockTasks.first.id;

    testWidgets('renders key content for a valid task', (tester) async {
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump(); // allow initState async to kick off
      await tester.pump(const Duration(milliseconds: 200));

      // Date line
      expect(find.textContaining('Today:'), findsOneWidget);

      // RichText contains "You are on:"
      expect(_richTextContains(tester, 'You are on:'), isTrue);

      // Task title (from mockTasks)
      expect(find.text(mockTasks.first.title), findsOneWidget);

      // Progress label
      expect(find.textContaining('Step 1 of'), findsOneWidget);

      // Primary button (not done)
      expect(find.text('Next Step').evaluate().isNotEmpty || find.text('Mark Done').evaluate().isNotEmpty, isTrue);

      // Return button
      expect(find.text('Return to Tasks'), findsOneWidget);
    });

    testWidgets('Next Step advances step counter', (tester) async {
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.textContaining('Step 1 of'), findsOneWidget);

      // Tap Next Step
      final nextBtn = find.text('Next Step');
      await _scrollTo(tester, nextBtn);
      await tester.tap(nextBtn);
      await tester.pump();

      expect(find.textContaining('Step 2 of'), findsOneWidget);
    });

    testWidgets('Mark Done shows Done dialog', (tester) async {
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      // Move to last step regardless of label text.
      await _advanceToLastStep(tester);

      // Tap primary CTA on last step (should trigger mark done + dialog)
      final cta = _primaryCtaFinder();
      await tester.scrollUntilVisible(cta, 250, scrollable: find.byType(Scrollable));
      await tester.tap(cta);
      await tester.pump(); // showDialog appears on next frame

      expect(find.byType(AlertDialog), findsOneWidget);
      expect(find.text('Done'), findsOneWidget);

      // Dialog button (unique inside AlertDialog)
      final dialogBtn = find.descendant(
        of: find.byType(AlertDialog),
        matching: find.text('Return to Tasks'),
      );
      expect(dialogBtn, findsOneWidget);
    });

    testWidgets('Done dialog Return to Tasks navigates to tasks list', (tester) async {
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      await _advanceToLastStep(tester);

      // Trigger completion dialog
      final cta = _primaryCtaFinder();
      await tester.scrollUntilVisible(cta, 250, scrollable: find.byType(Scrollable));
      await tester.tap(cta);
      await tester.pump(); // dialog frame

      expect(find.byType(AlertDialog), findsOneWidget);

      // ✅ Tap ONLY the dialog button (avoid ambiguity with page button)
      final dialogBtn = find.descendant(
        of: find.byType(AlertDialog),
        matching: find.text('Return to Tasks'),
      );
      expect(dialogBtn, findsOneWidget);

      await tester.tap(dialogBtn);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('TASK LIST'), findsOneWidget);
    });

    testWidgets('If already completed: shows Completed badge and Next button', (tester) async {
      final store = InMemoryTaskStatusStore();
      await store.setCompleted(taskId, DateTime(2026, 1, 1));

      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300)); // allow _loadCompleted

      expect(find.text('Completed'), findsOneWidget);

      // When done, primary should be "Next" (until last step)
      expect(find.text('Next'), findsOneWidget);
    });

    testWidgets('If completed: Next disappears on last step', (tester) async {
      final store = InMemoryTaskStatusStore();
      await store.setCompleted(taskId, DateTime(2026, 1, 1));

      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // Tap Next until last step
      while (true) {
        final next = find.text('Next');
        if (next.evaluate().isEmpty) break;

        await _scrollTo(tester, next);
        await tester.tap(next);
        await tester.pump();
      }

      // On last step, Next hidden
      expect(find.text('Next'), findsNothing);
    });

    testWidgets('Return to Tasks button navigates to tasks list', (tester) async {
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(taskId: taskId, store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      final returnBtn = find.text('Return to Tasks');
      await _scrollTo(tester, returnBtn);
      await tester.tap(returnBtn);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('TASK LIST'), findsOneWidget);
    });
  });
}

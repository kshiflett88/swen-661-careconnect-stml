import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/tasks/task_list_screen.dart';
import 'package:careconnect_stml_flutter/shared/mocks/mock_tasks.dart';
import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';

class _DashboardPlaceholder extends StatelessWidget {
  const _DashboardPlaceholder();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Dashboard Placeholder')));
  }
}

class _TaskDetailPlaceholder extends StatelessWidget {
  final String taskId;
  const _TaskDetailPlaceholder({required this.taskId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text('Task Detail: $taskId')),
    );
  }
}

GoRouter _buildTestRouter({
  required TaskStatusStore store,
  String initialLocation = AppRoutes.taskList, // list screen route
}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (_, __) => const _DashboardPlaceholder(),
      ),
      GoRoute(
        path: AppRoutes.taskList,
        builder: (_, __) => TaskListScreen(store: store),
      ),

      // task detail fallback path that TaskListScreen uses: "$base/$id"
      GoRoute(
        path: '${AppRoutes.taskList}/:id',
        builder: (_, state) {
          final id = state.pathParameters['id']!;
          return _TaskDetailPlaceholder(taskId: id);
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

Future<void> _scrollTo(WidgetTester tester, Finder target) async {
  // Always target a Scrollable, not SingleChildScrollView
  final scrollable = find.byType(Scrollable);
  await tester.scrollUntilVisible(target, 250, scrollable: scrollable);
  await tester.pumpAndSettle();
}

void main() {
  group('TaskListScreen', () {
    testWidgets('renders key content + all task titles', (tester) async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(store: store);

      // Act
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Assert: header + progress pill
      expect(find.textContaining('Today:'), findsOneWidget);
      // "You are on:" is rendered via RichText (TextSpan), not Text
      final rich = find.byType(RichText);
      expect(rich, findsWidgets);

      final hasProgressPill = rich.evaluate().any((e) {
        final w = e.widget as RichText;
        final span = w.text;
        if (span is TextSpan) {
          final text = span.toPlainText();
          return text.contains('You are on:') && text.contains('Tasks');
        }
        return false;
      });
      expect(hasProgressPill, isTrue);

      // Assert: all mock task titles appear somewhere
      for (final t in mockTasks) {
        expect(find.text(t.title), findsOneWidget);
      }

      // Return button exists (may require scroll depending on device)
      final returnHome = find.byKey(const Key('return_home_button'));
      await _scrollTo(tester, returnHome);
      expect(returnHome, findsOneWidget);
    });

    testWidgets('incomplete tasks show "Not Started" + Start button', (tester) async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(store: store);

      // Act
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Assert: at least one Start visible
      expect(find.text('Start'), findsWidgets);
      expect(find.text('Not Started'), findsWidgets);
    });

    testWidgets('completed task shows Done ✓ and View Task', (tester) async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final doneTask = mockTasks.first;
      await store.setCompleted(doneTask.id, DateTime(2026, 1, 1, 9, 30));

      final router = _buildTestRouter(store: store);

      // Act
      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Assert: the completed task has Done ✓ and View Task somewhere on screen
      expect(find.text('Done ✓'), findsWidgets);
      expect(find.text('View Task'), findsWidgets);
    });

    testWidgets('tapping Start navigates to task detail (via /tasks/:id)', (tester) async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final firstTask = mockTasks.first;
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Find the Start button (there can be many) and tap the first one
      final startBtn = find.text('Start').first;
      await tester.tap(startBtn);
      await tester.pumpAndSettle();

      // Assert: navigated to our placeholder detail
      expect(find.text('Task Detail: ${firstTask.id}'), findsOneWidget);
    });

    testWidgets('Return to Home navigates to dashboard', (tester) async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Act
      final returnHome = find.byKey(const Key('return_home_button'));
      await _scrollTo(tester, returnHome);
      await tester.tap(returnHome);
      await tester.pumpAndSettle();

      // Assert
      expect(find.text('Dashboard Placeholder'), findsOneWidget);
    });
  });
}

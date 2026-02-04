import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/screens/health_logging/health_logging_screen.dart';

import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';

GoRouter _buildTestRouter({
  String initialLocation = AppRoutes.healthLogging,
  required HealthLogStore store,
}) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => const _DashboardPlaceholder(),
      ),
      GoRoute(
        path: AppRoutes.healthLogging,
        builder: (context, state) => HealthLoggingScreen(store: store),
      ),
    ],
  );
}

/// Avoid pulling in real dashboard dependencies (tasks, stores, etc.)
class _DashboardPlaceholder extends StatelessWidget {
  const _DashboardPlaceholder();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('DASHBOARD')));
  }
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
    scrollable: find.byType(Scrollable).first,
  );
  await tester.pumpAndSettle();
}

String _plainTextFromRichText(WidgetTester tester, Finder richTextFinder) {
  final rt = tester.widget<RichText>(richTextFinder);
  final span = rt.text as TextSpan;
  return span.toPlainText();
}

void main() {
  group('HealthLoggingScreen', () {
    testWidgets('renders key content', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Date label (Text widget)
      expect(find.textContaining('Today:'), findsOneWidget);

      // "You are on: How I Feel" is RichText, so read its spans
      final rich = find.byType(RichText);
      expect(
        rich,
        findsWidgets,
      ); // there are multiple RichText in app sometimes

      // Find the one that contains "You are on:"
      final matching = rich.evaluate().where((e) {
        final w = e.widget as RichText;
        final span = w.text as TextSpan;
        return span.toPlainText().contains('You are on:');
      }).toList();

      expect(matching.length, 1);

      final plain = (matching.single.widget as RichText).text as TextSpan;
      expect(plain.toPlainText(), contains('You are on: How I Feel'));

      // Mood labels
      expect(find.text('Happy'), findsOneWidget);
      expect(find.text('Okay'), findsOneWidget);
      expect(find.text('Sad'), findsOneWidget);

      // Buttons (need scroll for bottom ones)
      final saveBtn = find.byKey(const Key('save_button'));
      final homeBtn = find.byKey(const Key('return_home_button'));

      await _scrollTo(tester, saveBtn);
      expect(saveBtn, findsOneWidget);

      await _scrollTo(tester, homeBtn);
      expect(homeBtn, findsOneWidget);
    });

    testWidgets('tapping mood allows Save flow (selection works)', (
      tester,
    ) async {
      final store = InMemoryHealthLogStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Tap the visible label inside the card
      await tester.tap(find.text('Happy'));
      await tester.pumpAndSettle();

      // Now Save should produce Saved dialog (meaning mood was selected)
      final saveBtn = find.byKey(const Key('save_button'));
      await _scrollTo(tester, saveBtn);

      await tester.tap(saveBtn);
      await tester.pumpAndSettle();

      expect(find.text('Saved'), findsOneWidget);
      expect(find.text('OK'), findsOneWidget);
    });

    testWidgets('Save without mood shows SnackBar', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final saveBtn = find.byKey(const Key('save_button'));
      await _scrollTo(tester, saveBtn);

      await tester.tap(saveBtn);
      await tester.pump(); // snackbar frame

      expect(find.text('Please choose how you feel.'), findsOneWidget);
    });

    testWidgets('Select mood + Save shows Saved dialog', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      // Tap Happy
      await tester.tap(find.text('Happy'));
      await tester.pumpAndSettle();

      // Tap Save
      final saveBtn = find.byKey(const Key('save_button'));
      await _scrollTo(tester, saveBtn);

      await tester.tap(saveBtn);
      await tester.pumpAndSettle();

      expect(find.text('Saved'), findsOneWidget);
      expect(find.text('OK'), findsOneWidget);
    });

    testWidgets('OK on Saved dialog navigates to Dashboard', (tester) async {
      final store = InMemoryHealthLogStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Happy'));
      await tester.pumpAndSettle();

      final saveBtn = find.byKey(const Key('save_button'));
      await _scrollTo(tester, saveBtn);
      await tester.tap(saveBtn);
      await tester.pumpAndSettle();

      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      expect(find.text('DASHBOARD'), findsOneWidget);
    });

    testWidgets('Return to Home navigates to Dashboard (scroll required)', (
      tester,
    ) async {
      final store = InMemoryHealthLogStore();
      final router = _buildTestRouter(store: store);

      await tester.pumpWidget(_TestApp(router: router));
      await tester.pumpAndSettle();

      final returnBtn = find.byKey(const Key('return_home_button'));
      await _scrollTo(tester, returnBtn);

      await tester.tap(returnBtn);
      await tester.pumpAndSettle();

      expect(find.text('DASHBOARD'), findsOneWidget);
    });
  });
}

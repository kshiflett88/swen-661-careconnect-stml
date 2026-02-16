import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('App launches (smoke)', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    // TODO: Replace with a real assertion once we see main.dart.
    // Examples:
    // expect(find.text('Dashboard'), findsOneWidget);
    // expect(find.byKey(const Key('dashboard_screen')), findsOneWidget);
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}

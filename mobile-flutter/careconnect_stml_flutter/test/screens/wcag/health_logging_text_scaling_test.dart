import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';
import '../../helpers/test_app.dart';

void main() {
  testWidgets('HealthLogging supports 200% text scaling', (tester) async {
    final store = InMemoryHealthLogStore();
    final router = buildHealthLoggingTestRouter(store: store);

    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(2.0)),
        child: TestApp(router: router),
      ),
    );
    await tester.pumpAndSettle();

    // If any overflow occurs, the pump would generally throw.
    expect(find.text('Happy'), findsOneWidget);

    final saveBtn = find.byKey(const Key('save_button'));
    await scrollTo(tester, saveBtn);
    expect(saveBtn, findsOneWidget);
  });
}

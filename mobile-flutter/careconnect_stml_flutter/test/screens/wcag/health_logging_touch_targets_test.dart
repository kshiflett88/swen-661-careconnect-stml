import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';
import '../../helpers/test_app.dart';

void main() {
  testWidgets('HealthLogging touch targets meet 48x48 minimum', (tester) async {
    final store = InMemoryHealthLogStore();
    final router = buildHealthLoggingTestRouter(store: store);

    await tester.pumpWidget(TestApp(router: router));
    await tester.pumpAndSettle();

    final saveBtn = find.byKey(const Key('save_button'));
    final homeBtn = find.byKey(const Key('return_home_button'));

    await scrollTo(tester, saveBtn);
    await scrollTo(tester, homeBtn);

    final saveRect = tester.getRect(saveBtn);
    expect(saveRect.width >= 48 && saveRect.height >= 48, isTrue);

    final homeRect = tester.getRect(homeBtn);
    expect(homeRect.width >= 48 && homeRect.height >= 48, isTrue);
  });
}

import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;
import '../../helpers/wcag_text_scaling.dart';

void main() {
  testWidgets('WCAG: Welcome supports 200% text scaling without overflow', (tester) async {
    // Run the real app under text scale 2.0
    app.main();
    await tester.pumpAndSettle();

    // Re-pump with text scaling applied. We need to pump a widget tree, so we re-run main
    // by pumping the app via pumpWidget. Easiest: wrap the existing app root.
    // In this codebase, app.main() calls runApp, so instead we directly pump CareConnectApp.
    // Import main.dart exposes CareConnectApp.
    await pumpNoOverflow(
      tester,
      withTextScale(const app.CareConnectApp(), 2.0),
    );

    // Sanity: key content still visible
    expect(find.text('Access CareConnect'), findsOneWidget);
  });
}


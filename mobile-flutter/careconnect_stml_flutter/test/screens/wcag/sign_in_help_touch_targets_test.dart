import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart';

void main() {
  testWidgets('SignInHelpScreen - touch targets are at least 48x48 logical pixels', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SignInHelpScreen()));
    await tester.pumpAndSettle();

    // Back button
    final backSize = tester.getSize(find.byKey(const Key('sign_in_help_back_button')));
    expect(backSize.width >= 48, isTrue);
    expect(backSize.height >= 48, isTrue);

    // Main action buttons (they are large, but check anyway)
    for (final k in const [
      Key('call_caregiver_button'),
      Key('send_message_button'),
      Key('face_id_button'),
    ]) {
      final size = tester.getSize(find.byKey(k));
      expect(size.width >= 48, isTrue);
      expect(size.height >= 48, isTrue);
    }
  });
}

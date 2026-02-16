import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/profile_screen.dart'; // update path

void main() {
  testWidgets('ProfileScreen - touch targets are at least 48x48', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    for (final key in const [
      Key('accessibility_setup_button'),
      Key('back_to_home_button'),
      Key('sign_out_button'),
    ]) {
      final size = tester.getSize(find.byKey(key));
      expect(size.width >= 48, isTrue);
      expect(size.height >= 48, isTrue);
    }
  });
}

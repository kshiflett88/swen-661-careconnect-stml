import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/profile_screen.dart'; // update path

void main() {
  testWidgets('ProfileScreen - has meaningful semantics on interactive elements', (tester) async {
    final handle = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        const MaterialApp(
          home: ProfileScreen(
            onOpenAccessibilitySetup: null,
            onBackToHome: null,
            onSignOut: null,
          ),
        ),
      );
      await tester.pumpAndSettle();

      final a11y = tester.getSemantics(find.byKey(const Key('accessibility_setup_button')));
      expect(a11y.label, 'View Accessibility Setup');
      expect(a11y.hasFlag(SemanticsFlag.isButton), isTrue);

      final home = tester.getSemantics(find.byKey(const Key('back_to_home_button')));
      expect(home.label, 'Back to Home');
      expect(home.hasFlag(SemanticsFlag.isButton), isTrue);

      final signOut = tester.getSemantics(find.byKey(const Key('sign_out_button')));
      expect(signOut.label, 'Sign Out');
      expect(signOut.hasFlag(SemanticsFlag.isButton), isTrue);
    } finally {
      handle.dispose();
    }
  });
}

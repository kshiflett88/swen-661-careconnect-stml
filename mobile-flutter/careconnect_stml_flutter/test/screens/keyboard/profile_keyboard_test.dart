import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/profile_screen.dart'; // update path

void main() {
  testWidgets('ProfileScreen - Enter/Space activates focused actions', (tester) async {
    var opened = false;
    var wentHome = false;
    var signedOut = false;

    await tester.pumpWidget(
      MaterialApp(
        home: ProfileScreen(
          onOpenAccessibilitySetup: () => opened = true,
          onBackToHome: () => wentHome = true,
          onSignOut: () => signedOut = true,
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Focus a11y button
    final a11yDetector = tester.widget<FocusableActionDetector>(
      find.byKey(const Key('focus_profile_accessibility_setup')),
    );
    a11yDetector.focusNode!.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(opened, isTrue);

    // Focus back home
    final homeDetector = tester.widget<FocusableActionDetector>(
      find.byKey(const Key('focus_profile_back_to_home')),
    );
    homeDetector.focusNode!.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(wentHome, isTrue);

    // Focus sign out
    final signOutDetector = tester.widget<FocusableActionDetector>(
      find.byKey(const Key('focus_profile_sign_out')),
    );
    signOutDetector.focusNode!.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(signedOut, isTrue);
  });
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart';

void main() {
  testWidgets('SignInHelpScreen - Enter/Space activates focused actions', (tester) async {
    var called = false;
    var messaged = false;

    await tester.pumpWidget(
      MaterialApp(
        home: SignInHelpScreen(
          onCallCaregiver: () => called = true,
          onSendMessage: () => messaged = true,
          onTryFaceId: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Focus Call caregiver deterministically
    final callDetector = tester.widget<FocusableActionDetector>(
      find.byKey(const Key('focus_call_caregiver')),
    );
    callDetector.focusNode!.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(called, isTrue);

    // Focus Send message deterministically
    final msgDetector = tester.widget<FocusableActionDetector>(
      find.byKey(const Key('focus_send_message')),
    );
    msgDetector.focusNode!.requestFocus();
    await tester.pump();

    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(messaged, isTrue);
  });
}

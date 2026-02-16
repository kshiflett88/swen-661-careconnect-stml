import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/sign_in_help/sign_in_help_screen.dart'; // adjust path

void main() {
  testWidgets('SignInHelpScreen - has meaningful semantics on interactive elements', (tester) async {
    final handle = tester.ensureSemantics();

    try {
      await tester.pumpWidget(const MaterialApp(home: SignInHelpScreen()));
      await tester.pumpAndSettle();

      // Back
      final back = tester.getSemantics(find.byKey(const Key('sign_in_help_back_button')));
      expect(back.label, equals('Back'));
      expect(back.hasFlag(SemanticsFlag.isButton), isTrue);

      // Call caregiver
      final call = tester.getSemantics(find.byKey(const Key('call_caregiver_button')));
      expect(call.label, equals('Call my caregiver'));
      expect(call.hasFlag(SemanticsFlag.isButton), isTrue);

      // Send message
      final msg = tester.getSemantics(find.byKey(const Key('send_message_button')));
      expect(msg.label, equals('Send a message to my caregiver'));
      expect(msg.hasFlag(SemanticsFlag.isButton), isTrue);

      // Face ID
      final face = tester.getSemantics(find.byKey(const Key('face_id_button')));
      expect(face.label, equals('Try Face ID again'));
      expect(face.hasFlag(SemanticsFlag.isButton), isTrue);
    } finally {
      
      handle.dispose();
    }
  });
}

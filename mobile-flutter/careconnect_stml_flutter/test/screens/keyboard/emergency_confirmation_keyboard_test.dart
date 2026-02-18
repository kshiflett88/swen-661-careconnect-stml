import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/emergency/emergency_confirmation_screen.dart';

void main() {
  testWidgets('Keyboard: Confirmation Tab order is Send Alert then Cancel', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: EmergencyConfirmationScreen()));
    await tester.pumpAndSettle();

    final send = find.byKey(const Key('focus_send_alert'));
    final cancel = find.byKey(const Key('focus_confirm_cancel'));

    expect(send, findsOneWidget);
    expect(cancel, findsOneWidget);

    bool hasFocus(Finder f) => Focus.of(tester.element(f)).hasFocus;

    expect(hasFocus(send), isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(hasFocus(cancel), isTrue);
  });
}

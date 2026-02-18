import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/main.dart' as app;

void main() {
  testWidgets('Keyboard: Tab moves focus through welcome screen actions in order', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    Finder fFaceId = find.byKey(const Key('focus_face_id'));
    Finder fCaregiver = find.byKey(const Key('focus_caregiver'));
    Finder fHelp = find.byKey(const Key('focus_help_signin'));

    expect(fFaceId, findsOneWidget);
    expect(fCaregiver, findsOneWidget);
    expect(fHelp, findsOneWidget);

    bool hasFocus(Finder f) => Focus.of(tester.element(f)).hasFocus;

    // Because we set autofocus: true on Face ID, it should be focused initially.
    expect(hasFocus(fFaceId), isTrue);

    // Tab -> Caregiver
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(hasFocus(fCaregiver), isTrue);

    // Tab -> Help
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(hasFocus(fHelp), isTrue);

    // Shift+Tab -> Caregiver
    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pump();
    expect(hasFocus(fCaregiver), isTrue);
  });
}
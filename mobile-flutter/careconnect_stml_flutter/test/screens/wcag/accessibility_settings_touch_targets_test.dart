import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/accessibility_settings_screen.dart'; 

void main() {
  testWidgets('AccessibilitySettings - touch targets >= 48x48', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: AccessibilitySettingsScreen()));
    await tester.pumpAndSettle();

    for (final k in const [
      Key('toggle_large_text'),
      Key('toggle_voice_guidance'),
      Key('toggle_high_contrast'),
      Key('toggle_extra_reminders'),
      Key('return_to_profile_button'),
    ]) {
      final size = tester.getSize(find.byKey(k));
      expect(size.width >= 48, isTrue);
      expect(size.height >= 48, isTrue);
    }
  });
}

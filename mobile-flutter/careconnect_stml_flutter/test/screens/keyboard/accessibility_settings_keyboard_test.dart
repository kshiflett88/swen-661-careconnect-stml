import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/accessibility_settings_screen.dart'; 

void main() {
  testWidgets('AccessibilitySettings - Enter/Space activates focused elements', (tester) async {
    bool largeToggled = false;
    bool voiceToggled = false;
    bool contrastToggled = false;
    bool remindersToggled = false;
    bool returned = false;

    await tester.pumpWidget(
      MaterialApp(
        home: AccessibilitySettingsScreen(
          onToggleLargeText: (_) => largeToggled = true,
          onToggleVoiceGuidance: (_) => voiceToggled = true,
          onToggleHighContrast: (_) => contrastToggled = true,
          onToggleExtraReminders: (_) => remindersToggled = true,
          onReturnToProfile: () => returned = true,
        ),
      ),
    );
    await tester.pumpAndSettle();

    Future<void> focusAndPress(Key focusKey, LogicalKeyboardKey key) async {
      final det = tester.widget<FocusableActionDetector>(find.byKey(focusKey));
      det.focusNode!.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(key);
      await tester.pump();
    }

    await focusAndPress(const Key('focus_toggle_large_text'), LogicalKeyboardKey.enter);
    expect(largeToggled, isTrue);

    await focusAndPress(const Key('focus_toggle_voice_guidance'), LogicalKeyboardKey.space);
    expect(voiceToggled, isTrue);

    await focusAndPress(const Key('focus_toggle_high_contrast'), LogicalKeyboardKey.enter);
    expect(contrastToggled, isTrue);

    await focusAndPress(const Key('focus_toggle_extra_reminders'), LogicalKeyboardKey.space);
    expect(remindersToggled, isTrue);

    await focusAndPress(const Key('focus_return_to_profile'), LogicalKeyboardKey.enter);
    expect(returned, isTrue);
  });
}

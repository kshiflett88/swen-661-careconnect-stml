import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/screens/profile/accessibility_settings_screen.dart'; 
import '../../helpers/semantics_audit.dart';

void main() {
  testWidgets('AccessibilitySettings - toggles expose name + role/state, and state updates', (tester) async {
    final audit = SemanticsAudit(tester);
    await audit.start();

    try {
      await tester.pumpWidget(const MaterialApp(home: AccessibilitySettingsScreen()));
      await tester.pumpAndSettle();

      // Verify each toggle has a label and exposes a checked/toggled state.
      final large = find.byKey(const Key('toggle_large_text'));
      final voice = find.byKey(const Key('toggle_voice_guidance'));
      final contrast = find.byKey(const Key('toggle_high_contrast'));
      final reminders = find.byKey(const Key('toggle_extra_reminders'));

      audit.expectToggle(large, labelContains: 'Large');
      audit.expectToggle(voice, labelContains: 'Voice');
      audit.expectToggle(contrast, labelContains: 'Contrast');
      audit.expectToggle(reminders, labelContains: 'Reminder');

      // State-change proof: tap one toggle and ensure semantics state flips.
      final beforeOn = tester
          .getSemantics(large)
          .hasFlag(SemanticsFlag.isChecked) ||
          tester.getSemantics(large).hasFlag(SemanticsFlag.isToggled);
      await tester.tap(large);
      await tester.pumpAndSettle();
      final afterOn = tester
          .getSemantics(large)
          .hasFlag(SemanticsFlag.isChecked) ||
          tester.getSemantics(large).hasFlag(SemanticsFlag.isToggled);
      expect(afterOn, isNot(beforeOn), reason: 'Toggle semantics state should update after interaction.');

      // Return button must be a real button.
      audit.expectButton(
        find.byKey(const Key('return_to_profile_button')),
        labelContains: 'Return',
        reason: 'Return-to-profile must expose button role + tap action + label.',
      );
    } finally {
      audit.dispose();
    }
  });
}

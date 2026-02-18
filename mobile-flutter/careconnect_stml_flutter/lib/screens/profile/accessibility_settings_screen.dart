import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../../../models/accessibility_settings.dart';
import '../../../theme/app_colors.dart';
import '../../../widgets/orientation_header.dart';
import '../../../app/router.dart';

class AccessibilitySettingsScreen extends StatefulWidget {
  final ValueChanged<bool>? onToggleLargeText;
  final ValueChanged<bool>? onToggleVoiceGuidance;
  final ValueChanged<bool>? onToggleHighContrast;
  final ValueChanged<bool>? onToggleExtraReminders;
  final VoidCallback? onReturnToProfile;

  const AccessibilitySettingsScreen({
    super.key,
    this.onToggleLargeText,
    this.onToggleVoiceGuidance,
    this.onToggleHighContrast,
    this.onToggleExtraReminders,
    this.onReturnToProfile,
  });

  @override
  State<AccessibilitySettingsScreen> createState() => _AccessibilitySettingsScreenState();
}

class _AccessibilitySettingsScreenState extends State<AccessibilitySettingsScreen> {
  late bool largeText;
  late bool voiceGuidance;
  late bool highContrast;
  late bool extraReminders;

  final FocusNode _largeTextNode = FocusNode(debugLabel: 'a11yLargeText');
  final FocusNode _voiceNode = FocusNode(debugLabel: 'a11yVoiceGuidance');
  final FocusNode _contrastNode = FocusNode(debugLabel: 'a11yHighContrast');
  final FocusNode _remindersNode = FocusNode(debugLabel: 'a11yExtraReminders');
  final FocusNode _returnNode = FocusNode(debugLabel: 'a11yReturnToProfile');

  @override
  void initState() {
    super.initState();
    final settings = AccessibilitySettings.mock();
    largeText = settings.largeTextEnabled;
    voiceGuidance = settings.voiceGuidanceEnabled;
    highContrast = settings.highContrastEnabled;
    extraReminders = settings.extraRemindersEnabled;
  }

  @override
  void dispose() {
    _largeTextNode.dispose();
    _voiceNode.dispose();
    _contrastNode.dispose();
    _remindersNode.dispose();
    _returnNode.dispose();
    super.dispose();
  }

  void _returnToProfile(BuildContext context) {
    (widget.onReturnToProfile ?? () => context.go(AppRoutes.dashboard))();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: FocusTraversalGroup(
          policy: OrderedTraversalPolicy(),
          child: Column(
            children: [
              const OrientationHeader(screenName: 'Accessibility'),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Semantics(
                        header: true,
                        child: Text(
                          'Accessibility Settings',
                          style: TextStyle(
                            fontSize: 34,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Info card (non-interactive)
                      Semantics(
                        label:
                            'These settings help make the app easier to use. You can enable large text, voice guidance, high contrast, and extra reminders.',
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.primary),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.info_outline),
                              SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'Adjust these options for better readability and support.',
                                  style: TextStyle(fontSize: 16),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      FocusTraversalOrder(
                        order: const NumericFocusOrder(1),
                        child: _buildToggle(
                          key: const Key('toggle_large_text'),
                          focusKey: const Key('focus_toggle_large_text'),
                          focusNode: _largeTextNode,
                          title: 'Large Text',
                          description: 'Increases text size for better readability',
                          isEnabled: largeText,
                          icon: Icons.text_fields,
                          onToggle: (v) {
                            setState(() => largeText = v);
                            widget.onToggleLargeText?.call(v);
                          },
                        ),
                      ),

                      FocusTraversalOrder(
                        order: const NumericFocusOrder(2),
                        child: _buildToggle(
                          key: const Key('toggle_voice_guidance'),
                          focusKey: const Key('focus_toggle_voice_guidance'),
                          focusNode: _voiceNode,
                          title: 'Voice Guidance',
                          description: 'Text-to-speech for screen content',
                          isEnabled: voiceGuidance,
                          icon: Icons.record_voice_over,
                          onToggle: (v) {
                            setState(() => voiceGuidance = v);
                            widget.onToggleVoiceGuidance?.call(v);
                          },
                        ),
                      ),

                      FocusTraversalOrder(
                        order: const NumericFocusOrder(3),
                        child: _buildToggle(
                          key: const Key('toggle_high_contrast'),
                          focusKey: const Key('focus_toggle_high_contrast'),
                          focusNode: _contrastNode,
                          title: 'High Contrast',
                          description: 'Enhances color contrast for visibility',
                          isEnabled: highContrast,
                          icon: Icons.contrast,
                          onToggle: (v) {
                            setState(() => highContrast = v);
                            widget.onToggleHighContrast?.call(v);
                          },
                        ),
                      ),

                      FocusTraversalOrder(
                        order: const NumericFocusOrder(4),
                        child: _buildToggle(
                          key: const Key('toggle_extra_reminders'),
                          focusKey: const Key('focus_toggle_extra_reminders'),
                          focusNode: _remindersNode,
                          title: 'Extra Reminders',
                          description: 'More frequent task notifications',
                          isEnabled: extraReminders,
                          icon: Icons.notifications_active,
                          onToggle: (v) {
                            setState(() => extraReminders = v);
                            widget.onToggleExtraReminders?.call(v);
                          },
                        ),
                      ),

                      const SizedBox(height: 18),

                      FocusTraversalOrder(
                        order: const NumericFocusOrder(5),
                        child: Semantics(
                          button: true,
                          label: 'Return to Profile',
                          hint: 'Returns to your profile screen',
                          child: FocusableActionDetector(
                            key: const Key('focus_return_to_profile'),
                            focusNode: _returnNode,
                            shortcuts: const <ShortcutActivator, Intent>{
                              SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
                              SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
                            },
                            actions: <Type, Action<Intent>>{
                              ActivateIntent: CallbackAction<ActivateIntent>(
                                onInvoke: (intent) {
                                  _returnToProfile(context);
                                  return null;
                                },
                              ),
                            },
                            child: SizedBox(
                              height: 56,
                              width: double.infinity,
                              child: ElevatedButton(
                                key: const Key('return_to_profile_button'),
                                onPressed: () => _returnToProfile(context),
                                style: ElevatedButton.styleFrom(
                                  // AA-safe pairing
                                  backgroundColor: const Color(0xFF155DFC),
                                  foregroundColor: Colors.white,
                                ),
                                child: const Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.arrow_back),
                                    SizedBox(width: 12),
                                    Text(
                                      'Return to Profile',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildToggle({
    required Key key,
    required Key focusKey,
    required FocusNode focusNode,
    required String title,
    required String description,
    required bool isEnabled,
    required IconData icon,
    required ValueChanged<bool> onToggle,
  }) {
    const enabledBg = Color(0xFF15803D); // AA-safe with white
    const disabledBg = Color(0xFF6B7280); // AA-safe with white

    return Semantics(
      container: true,
      button: true,
      toggled: isEnabled,
      label: title,
      hint: '$description. ${isEnabled ? "Enabled" : "Disabled"}. Press to toggle.',
      excludeSemantics: true,
      child: FocusableActionDetector(
        key: focusKey,
        focusNode: focusNode,
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (intent) {
              onToggle(!isEnabled);
              return null;
            },
          ),
        },
        child: InkWell(
          key: key,
          onTap: () => onToggle(!isEnabled),
          borderRadius: BorderRadius.circular(12),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 56),
            child: Container(
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Row(
                children: [
                  Icon(icon, color: AppColors.primary, size: 32),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          description,
                          style: TextStyle(fontSize: 16, color: AppColors.mutedText),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            color: isEnabled ? enabledBg : disabledBg,
                          ),
                          child: Text(
                            isEnabled ? 'Enabled' : 'Disabled',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  ExcludeSemantics(
                    child: Switch(value: isEnabled, onChanged: null),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

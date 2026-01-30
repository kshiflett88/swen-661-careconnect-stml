import 'package:flutter/material.dart';
import '../../../models/accessibility_settings.dart';
import '../../../theme/app_colors.dart';
import '../../../widgets/orientation_header.dart';

class AccessibilitySettingsScreen extends StatelessWidget {
  const AccessibilitySettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = AccessibilitySettings.mock();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            const OrientationHeader(screenName: 'Accessibility'),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Accessibility Settings',
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.primary),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.info_outline,
                            color: AppColors.primary,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              settings.managedBy,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    _buildToggle(
                      'Large Text',
                      'Increases text size for better readability',
                      settings.largeTextEnabled,
                      Icons.text_fields,
                    ),
                    _buildToggle(
                      'Voice Guidance',
                      'Text-to-speech for screen content',
                      settings.voiceGuidanceEnabled,
                      Icons.record_voice_over,
                    ),
                    _buildToggle(
                      'High Contrast',
                      'Enhances color contrast for visibility',
                      settings.highContrastEnabled,
                      Icons.contrast,
                    ),
                    _buildToggle(
                      'Extra Reminders',
                      'More frequent task notifications',
                      settings.extraRemindersEnabled,
                      Icons.notifications_active,
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.secondary,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.arrow_back),
                            SizedBox(width: 12),
                            Text(
                              'Return to Profile',
                              style: TextStyle(fontSize: 18),
                            ),
                          ],
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
    );
  }

  Widget _buildToggle(
    String title,
    String description,
    bool isEnabled,
    IconData icon,
  ) {
    return Container(
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
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: isEnabled
                        ? AppColors.success.withOpacity(0.1)
                        : AppColors.disabled.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    isEnabled ? 'Enabled' : 'Disabled',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isEnabled
                          ? AppColors.success
                          : AppColors.mutedText,
                    ),
                  ),
                ),
              ],
            ),
          ),
          IgnorePointer(child: Switch(value: isEnabled, onChanged: null)),
        ],
      ),
    );
  }
}

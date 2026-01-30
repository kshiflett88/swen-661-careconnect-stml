/// Caregiver-managed accessibility configuration (view-only for user)
class AccessibilitySettings {
  final bool largeTextEnabled;
  final bool voiceGuidanceEnabled;
  final bool highContrastEnabled;
  final bool extraRemindersEnabled;
  final String managedBy;

  const AccessibilitySettings({
    required this.largeTextEnabled,
    required this.voiceGuidanceEnabled,
    required this.highContrastEnabled,
    required this.extraRemindersEnabled,
    this.managedBy = 'Managed by your caregiver',
  });

  factory AccessibilitySettings.mock() {
    return const AccessibilitySettings(
      largeTextEnabled: true,
      voiceGuidanceEnabled: true,
      highContrastEnabled: false,
      extraRemindersEnabled: true,
    );
  }

  String getStatusLabel(bool isEnabled) {
    return isEnabled ? 'Enabled' : 'Disabled';
  }
}

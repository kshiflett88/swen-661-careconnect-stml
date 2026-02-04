/// Tracks emergency alert flow state
enum EmergencyStatus {
  idle,
  awaitingConfirmation,
  sending,
  calling,
  alertSent,
  cancelled,
}

class EmergencyState {
  final EmergencyStatus status;
  final String? caregiverName;
  final String? caregiverPhone;
  final int countdownSeconds;

  const EmergencyState({
    required this.status,
    this.caregiverName,
    this.caregiverPhone,
    this.countdownSeconds = 3,
  });

  factory EmergencyState.idle() {
    return const EmergencyState(status: EmergencyStatus.idle);
  }

  EmergencyState copyWith({
    EmergencyStatus? status,
    String? caregiverName,
    String? caregiverPhone,
    int? countdownSeconds,
  }) {
    return EmergencyState(
      status: status ?? this.status,
      caregiverName: caregiverName ?? this.caregiverName,
      caregiverPhone: caregiverPhone ?? this.caregiverPhone,
      countdownSeconds: countdownSeconds ?? this.countdownSeconds,
    );
  }

  bool get isActiveFlow =>
      status != EmergencyStatus.idle && status != EmergencyStatus.cancelled;
}

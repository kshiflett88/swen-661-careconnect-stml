class HealthLogEntry {
  final String id;
  final DateTime timestamp;
  final String type; // e.g., "mood", "bp", "note"
  final String value; // e.g., "Good", "120/80", "Headache"
  final String? note;

  const HealthLogEntry({
    required this.id,
    required this.timestamp,
    required this.type,
    required this.value,
    this.note,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'timestamp': timestamp.toIso8601String(),
        'type': type,
        'value': value,
        'note': note,
      };

  static HealthLogEntry fromJson(Map<String, dynamic> json) => HealthLogEntry(
        id: json['id'] as String,
        timestamp: DateTime.parse(json['timestamp'] as String),
        type: json['type'] as String,
        value: json['value'] as String,
        note: json['note'] as String?,
      );
}

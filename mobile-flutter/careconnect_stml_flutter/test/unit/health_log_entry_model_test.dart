import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/data/models/health_log_entry.dart';

void main() {
  group('HealthLogEntry', () {
    test('toJson serializes correctly with note', () {
      final ts = DateTime.utc(2026, 1, 1, 12, 30, 0);
      final entry = HealthLogEntry(
        id: '1',
        timestamp: ts,
        type: 'mood',
        value: 'Happy',
        note: 'Feeling good',
      );

      final json = entry.toJson();

      expect(json['id'], '1');
      expect(json['timestamp'], ts.toIso8601String());
      expect(json['type'], 'mood');
      expect(json['value'], 'Happy');
      expect(json['note'], 'Feeling good');
    });
    

    test('toJson includes note as null when note is null', () {
      final ts = DateTime.utc(2026, 1, 1, 12, 30, 0);
      final entry = HealthLogEntry(
        id: '2',
        timestamp: ts,
        type: 'mood',
        value: 'Okay',
        note: null,
      );

      final json = entry.toJson();

      expect(json['id'], '2');
      expect(json['timestamp'], ts.toIso8601String());
      expect(json['note'], isNull);
    });

    test('fromJson deserializes correctly', () {
      final ts = DateTime.utc(2026, 1, 2, 8, 0, 0);

      final json = {
        'id': '3',
        'timestamp': ts.toIso8601String(),
        'type': 'bp',
        'value': '120/80',
        'note': 'Morning reading',
      };

      final entry = HealthLogEntry.fromJson(json);

      expect(entry.id, '3');
      expect(entry.timestamp.toIso8601String(), ts.toIso8601String());
      expect(entry.type, 'bp');
      expect(entry.value, '120/80');
      expect(entry.note, 'Morning reading');
    });

    test('round-trip toJson -> fromJson preserves values', () {
      final ts = DateTime.utc(2026, 1, 3, 9, 15, 0);
      final original = HealthLogEntry(
        id: '4',
        timestamp: ts,
        type: 'note',
        value: 'Headache',
        note: null,
      );

      final rebuilt = HealthLogEntry.fromJson(original.toJson());

      expect(rebuilt.id, original.id);
      expect(rebuilt.timestamp.toIso8601String(), original.timestamp.toIso8601String());
      expect(rebuilt.type, original.type);
      expect(rebuilt.value, original.value);
      expect(rebuilt.note, original.note);
    });
  });
}

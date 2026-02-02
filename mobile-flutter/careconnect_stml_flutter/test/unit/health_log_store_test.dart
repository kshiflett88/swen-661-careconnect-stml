import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:careconnect_stml_flutter/data/models/health_log_entry.dart';
import 'package:careconnect_stml_flutter/shared/storage/health_log_store.dart';

void main() {
  group('SharedPrefsHealthLogStore', () {
    setUp(() async {
      SharedPreferences.setMockInitialValues({});
    });

    test('getAll returns empty list when nothing stored', () async {
      final store = SharedPrefsHealthLogStore();

      final all = await store.getAll();

      expect(all, isEmpty);
    });

    test('add persists entry and getAll returns it', () async {
      final store = SharedPrefsHealthLogStore();

      final entry = HealthLogEntry(
        id: 'a',
        timestamp: DateTime.utc(2026, 1, 1, 10, 0, 0),
        type: 'mood',
        value: 'Happy',
        note: 'First',
      );

      await store.add(entry);
      final all = await store.getAll();

      expect(all.length, 1);
      expect(all.first.id, 'a');
      expect(all.first.value, 'Happy');
      expect(all.first.note, 'First');
    });

    test('getAll returns newest first', () async {
      final store = SharedPrefsHealthLogStore();

      final older = HealthLogEntry(
        id: 'old',
        timestamp: DateTime.utc(2026, 1, 1, 9, 0, 0),
        type: 'mood',
        value: 'Okay',
      );

      final newer = HealthLogEntry(
        id: 'new',
        timestamp: DateTime.utc(2026, 1, 1, 11, 0, 0),
        type: 'mood',
        value: 'Happy',
      );

      await store.add(older);
      await store.add(newer);

      final all = await store.getAll();

      expect(all.length, 2);
      expect(all[0].id, 'new'); // newest first
      expect(all[1].id, 'old');
    });

    test('clearAll removes stored entries', () async {
      final store = SharedPrefsHealthLogStore();

      await store.add(
        HealthLogEntry(
          id: 'x',
          timestamp: DateTime.utc(2026, 1, 1, 10, 0, 0),
          type: 'mood',
          value: 'Sad',
        ),
      );

      expect((await store.getAll()).length, 1);

      await store.clearAll();

      final all = await store.getAll();
      expect(all, isEmpty);
    });
  });
}

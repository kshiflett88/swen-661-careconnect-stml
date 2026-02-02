import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';

void main() {
  group('SharedPrefsTaskStatusStore', () {
    setUp(() async {
      SharedPreferences.setMockInitialValues({});
    });

    test('getCompletedAt returns null when task has no completion', () async {
      final store = SharedPrefsTaskStatusStore();

      final completedAt = await store.getCompletedAt('task-1');

      expect(completedAt, isNull);
    });

    test('setCompleted persists and getCompletedAt returns value', () async {
      final store = SharedPrefsTaskStatusStore();
      final when = DateTime.utc(2026, 1, 1, 12, 0, 0);

      await store.setCompleted('task-1', when);

      final completedAt = await store.getCompletedAt('task-1');
      expect(completedAt, isNotNull);
      expect(completedAt!.toIso8601String(), when.toIso8601String());
    });

    test('clearCompleted removes only one task id', () async {
      final store = SharedPrefsTaskStatusStore();
      final when1 = DateTime.utc(2026, 1, 1, 12, 0, 0);
      final when2 = DateTime.utc(2026, 1, 1, 13, 0, 0);

      await store.setCompleted('task-1', when1);
      await store.setCompleted('task-2', when2);

      await store.clearCompleted('task-1');

      expect(await store.getCompletedAt('task-1'), isNull);
      expect((await store.getCompletedAt('task-2'))!.toIso8601String(), when2.toIso8601String());
    });

    test('clearAll wipes all completion status', () async {
      final store = SharedPrefsTaskStatusStore();
      await store.setCompleted('task-1', DateTime.utc(2026, 1, 1, 12, 0, 0));
      await store.setCompleted('task-2', DateTime.utc(2026, 1, 1, 13, 0, 0));

      await store.clearAll();

      expect(await store.getCompletedAt('task-1'), isNull);
      expect(await store.getCompletedAt('task-2'), isNull);
    });
  });
}

import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_stml_flutter/shared/storage/task_status_store.dart';

void main() {
  group('TaskStatusStore (InMemory)', () {
    test('getCompletedAt returns null by default', () async {
      // Arrange
      final store = InMemoryTaskStatusStore();

      // Act
      final result = await store.getCompletedAt('task-1');

      // Assert
      expect(result, isNull);
    });

    test('setCompleted then getCompletedAt returns saved date', () async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final when = DateTime(2026, 1, 1, 10, 15);

      // Act
      await store.setCompleted('task-1', when);
      final result = await store.getCompletedAt('task-1');

      // Assert
      expect(result, when);
    });

    test('setCompleted on multiple tasks keeps them separate', () async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      final when1 = DateTime(2026, 1, 1, 10, 0);
      final when2 = DateTime(2026, 1, 1, 11, 0);

      // Act
      await store.setCompleted('task-1', when1);
      await store.setCompleted('task-2', when2);

      final r1 = await store.getCompletedAt('task-1');
      final r2 = await store.getCompletedAt('task-2');

      // Assert
      expect(r1, when1);
      expect(r2, when2);
    });

    test('clearAll removes all completion timestamps', () async {
      // Arrange
      final store = InMemoryTaskStatusStore();
      await store.setCompleted('task-1', DateTime(2026, 1, 1, 10, 0));
      await store.setCompleted('task-2', DateTime(2026, 1, 1, 11, 0));

      // Act
      await store.clearAll();
      final r1 = await store.getCompletedAt('task-1');
      final r2 = await store.getCompletedAt('task-2');

      // Assert
      expect(r1, isNull);
      expect(r2, isNull);
    });
  });
}

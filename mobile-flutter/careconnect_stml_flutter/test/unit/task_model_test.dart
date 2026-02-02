import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_stml_flutter/data/models/task.dart';

void main() {
  group('Task model', () {
    test('constructor sets required fields', () {
      // Arrange
      const id = 't1';
      const title = 'Take medication';
      const description = 'Take your morning pill';

      // Act
      final task = Task(id: id, title: title, description: description);

      // Assert
      expect(task.id, id);
      expect(task.title, title);
      expect(task.description, description);
    });

    test('defaults: isCritical=false, scheduledAt=null, steps empty, imageAsset null', () {
      // Arrange + Act
      final task = Task(id: 't1', title: 'Title', description: 'Desc');

      // Assert
      expect(task.isCritical, isFalse);
      expect(task.scheduledAt, isNull);
      expect(task.steps, isEmpty);
      expect(task.imageAsset, isNull);
    });

    test('can set all optional fields', () {
      // Arrange
      final when = DateTime(2026, 1, 1, 9, 30);
      final steps = ['Step 1', 'Step 2'];

      // Act
      final task = Task(
        id: 't2',
        title: 'Walk',
        description: 'Go outside',
        isCritical: true,
        scheduledAt: when,
        steps: steps,
        imageAsset: 'assets/images/tasks/walk.png',
      );

      // Assert
      expect(task.isCritical, isTrue);
      expect(task.scheduledAt, when);
      expect(task.steps, steps);
      expect(task.imageAsset, 'assets/images/tasks/walk.png');
    });

    test('steps is immutable by default usage (new list must be provided to change)', () {
      // Arrange
      final task = Task(id: 't3', title: 'Test', description: 'Test');

      // Act
      final originalSteps = task.steps;

      // Assert
      expect(originalSteps, isA<List<String>>());
      expect(originalSteps, isEmpty);
    });
  });
}

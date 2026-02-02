import '../../data/models/task.dart';

/// Mock task data for prototype UI.
final mockTasks = <Task>[
  Task(
    id: '1',
    title: 'Take Morning Medication',
    description: 'Blue pill after breakfast',
    isCritical: true,
    scheduledAt: DateTime.now().copyWith(hour: 8, minute: 0),
    imageAsset: 'assets/images/tasks/medication.png',
    steps: const [
      'Get the blue pill bottle',
      'Take 1 pill with water',
      'Mark as done',
    ],
  ),
  Task(
    id: '2',
    title: 'Drink Water',
    description: 'One full glass',
    scheduledAt: DateTime.now().copyWith(hour: 10, minute: 30),
    imageAsset: 'assets/images/tasks/water.png',
    steps: const [
      'Fill a glass with water',
      'Drink the full glass',
      'Mark as done',
    ],
  ),
  Task(
    id: '3',
    title: 'Go for a Walk',
    description: '10 minutes outside',
    scheduledAt: DateTime.now().copyWith(hour: 14, minute: 0),
    imageAsset: 'assets/images/tasks/exercise.png',
    steps: const [
      'Put on comfortable shoes',
      'Walk outside for 10 minutes',
      'Mark as done',
    ],
  ),
];
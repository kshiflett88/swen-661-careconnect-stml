class Task {
  final String id;
  final String title;
  final String description;

  // Optional schedule fields (use if your UI needs “Schedule” on the same page)
  final DateTime? scheduledAt;
  final bool isCritical;

  // Optional steps for “Task Detail (Step-by-Step)”
  final List<String> steps;

  const Task({
    required this.id,
    required this.title,
    required this.description,
    this.scheduledAt,
    this.isCritical = false,
    this.steps = const [],
  });
}
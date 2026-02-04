class Task {
  final String id;
  final String title;
  final String description;
  final bool isCritical;
  final DateTime? scheduledAt;
  final List<String> steps;
  final String? imageAsset; 

  Task({
    required this.id,
    required this.title,
    required this.description,
    this.isCritical = false,
    this.scheduledAt,
    this.steps = const [],
    this.imageAsset, 
  });
}
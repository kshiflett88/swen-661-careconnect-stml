import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/router.dart';
import '../../data/models/task.dart';
import '../../shared/mocks/mock_tasks.dart';
import '../../shared/storage/task_status_store.dart';
import '../../shared/theme/app_colors.dart';

/// STML / accessibility-forward Task Detail (Task Step) screen
/// Updates per your request:
/// - If task is already completed:
///   - Step content shows a GREEN "Completed" with a check icon
///   - Primary blue button becomes "Next" (advances steps)
///   - On the LAST step, the blue button disappears
/// - Return to Tasks goes back to tasks list (go_router)
/// - Image uses asset if available; otherwise placeholder (NO network images)
class TaskDetailScreen extends StatefulWidget {
  final String taskId;

  /// ✅ Inject store so widget tests can use InMemoryTaskStatusStore
  final TaskStatusStore? store;

  const TaskDetailScreen({super.key, required this.taskId, this.store});

  @override
  State<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends State<TaskDetailScreen> {
  late final TaskStatusStore _store;

  late final Task _task;
  late final List<String> _steps;

  int _stepIndex = 0;
  DateTime? _completedAt;

  @override
  void initState() {
    super.initState();

    _store = widget.store ?? SharedPrefsTaskStatusStore();

    _task = mockTasks.firstWhere(
      (t) => t.id == widget.taskId,
      orElse: () => Task(
        id: widget.taskId,
        title: 'Task not found',
        description: 'No mock task matches this id.',
      ),
    );

    final dynamic maybeSteps = _tryReadSteps(_task);
    if (maybeSteps is List<String> && maybeSteps.isNotEmpty) {
      _steps = maybeSteps;
    } else {
      _steps = _defaultStepsFromTask(_task);
    }

    _loadCompleted();
  }

  Future<void> _loadCompleted() async {
    _completedAt = await _store.getCompletedAt(_task.id);
    if (mounted) setState(() {});
  }

  dynamic _tryReadSteps(Task task) {
    // Allows compilation even if your Task model doesn't have "steps".
    try {
      final dyn = task as dynamic;
      return dyn.steps;
    } catch (_) {
      return null;
    }
  }

  List<String> _defaultStepsFromTask(Task task) {
    final d = task.description.trim();
    if (d.isNotEmpty) {
      return const [
        'Step 1: Get what you need',
        'Step 2: Do the action',
        'Step 3: Double-check you finished',
        'Step 4: Mark done',
      ];
    }
    return const ['Do the task', 'Mark done'];
  }

  String _todayLabel(DateTime dt) {
    const weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return 'Today: ${weekdays[dt.weekday - 1]}, \n'
        '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
  }

  void _goTasks() => context.go(AppRoutes.taskList);

  double _progressValue() {
    if (_steps.isEmpty) return 0;
    return (_stepIndex + 1) / _steps.length;
  }

  String _stepTitle() => 'Step ${_stepIndex + 1}';
  String _stepOf() => 'Step ${_stepIndex + 1} of ${_steps.length}';

  String _cleanStepText(String s) {
    final raw = s.trim();
    final idx = raw.indexOf(':');
    if (raw.toLowerCase().startsWith('step') && idx != -1 && idx < 10) {
      return raw.substring(idx + 1).trim();
    }
    return raw;
  }

  String _currentStepText() {
    if (_steps.isEmpty) return '';
    return _cleanStepText(_steps[_stepIndex]);
  }

  bool get _isDone => _completedAt != null;

  Future<void> _markDone() async {
    final now = DateTime.now();
    await _store.setCompleted(_task.id, now);
    _completedAt = now;

    if (!mounted) return;

    await showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.fromLTRB(24, 26, 24, 12),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Icon(Icons.check_circle, color: Colors.green, size: 110),
            SizedBox(height: 16),
            Text(
              'Done',
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
            ),
            SizedBox(height: 8),
            Text(
              'Task marked as complete.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18),
            ),
          ],
        ),
        actionsPadding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
        actions: [
          SizedBox(
            height: 64,
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
                _goTasks();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E5BFF),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                ),
                textStyle: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              child: const Text('Return to Tasks'),
            ),
          ),
        ],
      ),
    );

    if (mounted) setState(() {});
  }

  void _nextNormal() {
    if (_stepIndex < _steps.length - 1) {
      setState(() => _stepIndex++);
    } else {
      _markDone();
    }
  }

  void _nextWhenDone() {
    if (_stepIndex < _steps.length - 1) {
      setState(() => _stepIndex++);
    }
    // last step: button disappears (handled in build)
  }

  String? _taskImageAsset(Task task) {
    try {
      final dyn = task as dynamic;
      final v = dyn.imageAsset;
      if (v is String && v.trim().isNotEmpty) return v.trim();
    } catch (_) {}

    final t = ('${task.title} ${task.description}').toLowerCase();

    // Update these paths to match assets you actually have.
    if (t.contains('medication') ||
        t.contains('pill') ||
        t.contains('medicine')) {
      return 'assets/images/tasks/medication.png';
    }
    if (t.contains('breakfast') ||
        t.contains('lunch') ||
        t.contains('dinner') ||
        t.contains('meal')) {
      return 'assets/images/tasks/meal.png';
    }
    if (t.contains('walk') ||
        t.contains('exercise') ||
        t.contains('therapy') ||
        t.contains('physical')) {
      return 'assets/images/tasks/exercise.png';
    }
    if (t.contains('water') || t.contains('drink')) {
      return 'assets/images/tasks/water.png';
    }
    return null;
  }

  Widget _imagePlaceholder() {
    return Container(
      color: const Color(0xFFF3F4F6),
      alignment: Alignment.center,
      child: const Icon(Icons.image, size: 44, color: Color(0xFF9CA3AF)),
    );
  }

  Widget _completedBadge() {
    const green = Color(0xFF16A34A);
    const greenBg = Color(0xFFDCFCE7);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: greenBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: green, width: 2),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: const [
          Icon(Icons.check_circle, color: green, size: 22),
          SizedBox(width: 10),
          Text(
            'Completed',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: green,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF1E5BFF);
    const borderGrey = Color(0xFFD1D5DB);
    const subtleText = Color(0xFF6B7280);

    final now = DateTime.now();

    final asset = _taskImageAsset(_task);

    final imageWidget = ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
      child: AspectRatio(
        aspectRatio: 16 / 10,
        child: asset == null
            ? _imagePlaceholder()
            : Image.asset(
                asset,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _imagePlaceholder(),
              ),
      ),
    );

    final bool showNextWhenDone = _isDone && _stepIndex < _steps.length - 1;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                _todayLabel(now),
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 14),

              // "You are on: Task Step" pill (RichText)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: blue, width: 2),
                  borderRadius: BorderRadius.circular(14),
                  color: blue.withAlpha(15),
                ),
                child: RichText(
                  text: const TextSpan(
                    style: TextStyle(fontSize: 22, color: AppColors.primary),
                    children: [
                      TextSpan(text: 'You are on: '),
                      TextSpan(
                        text: 'Task Step',
                        style: TextStyle(fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 18),

              // Task title
              Text(
                _task.title,
                style: const TextStyle(
                  fontSize: 30,
                  height: 1.1,
                  fontWeight: FontWeight.w900,
                  color: AppColors.textPrimary,
                ),
              ),

              const SizedBox(height: 14),

              // Step progress card
              Container(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                decoration: BoxDecoration(
                  border: Border.all(color: borderGrey, width: 1.8),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _stepOf(),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(999),
                      child: LinearProgressIndicator(
                        minHeight: 12,
                        value: _progressValue(),
                        backgroundColor: const Color(0xFFE5E7EB),
                        valueColor: const AlwaysStoppedAnimation<Color>(blue),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              Container(height: 3, color: blue),
              const SizedBox(height: 18),

              // Main step card with image + content
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: blue, width: 3),
                  color: Colors.white,
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x12000000),
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    imageWidget,
                    Padding(
                      padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Step label
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 124,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: const Color(0xFF93C5FD),
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              color: const Color(0xFFEFF6FF),
                            ),
                            child: Text(
                              _stepTitle(),
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF1E3A8A),
                              ),
                            ),
                          ),

                          const SizedBox(height: 14),

                          if (_isDone) ...[
                            _completedBadge(),
                            const SizedBox(height: 12),
                          ],

                          Text(
                            _currentStepText().isEmpty
                                ? _task.description
                                : _currentStepText(),
                            style: const TextStyle(
                              fontSize: 32,
                              height: 1.25,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                          ),

                          if (_isDone) ...[
                            const SizedBox(height: 12),
                            const Text(
                              'This step is complete.',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: subtleText,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Primary CTA logic
              if (!_isDone || showNextWhenDone) ...[
                SizedBox(
                  height: 92,
                  child: ElevatedButton(
                    onPressed: _isDone ? _nextWhenDone : _nextNormal,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: blue,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    child: Text(
                      _isDone
                          ? 'Next'
                          : (_stepIndex < _steps.length - 1
                                ? 'Next Step'
                                : 'Mark Done'),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
              ],

              // Return to Tasks
              SizedBox(
                height: 92,
                child: OutlinedButton(
                  onPressed: _goTasks,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black,
                    side: const BorderSide(color: borderGrey, width: 2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    textStyle: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  child: const Text('Return to Tasks'),
                ),
              ),

              const SizedBox(height: 18),
            ],
          ),
        ),
      ),
    );
  }
}

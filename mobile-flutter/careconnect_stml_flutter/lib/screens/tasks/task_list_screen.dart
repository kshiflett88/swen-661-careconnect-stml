import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../shared/theme/app_colors.dart';
import '../../data/models/task.dart';
import '../../shared/mocks/mock_tasks.dart';
import '../../shared/storage/task_status_store.dart';

/// STML / accessibility-forward Task List screen 
/// - Large cards + large tap targets
/// - Clear state: Done vs Not Started
/// - High contrast, minimal cognitive load
/// - Local completion status via TaskStatusStore
///
/// IMPORTANT: set these to match your router.dart
/// Home/Dashboard:
const String kHomeRouteName = AppRoutes.dashboard; 
const String kHomePath = AppRoutes.dashboard;     


class TaskListScreen extends StatefulWidget {
  final TaskStatusStore? store;

  const TaskListScreen({super.key, this.store});

  @override
  State<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  late final TaskStatusStore _store;
  final Map<String, DateTime?> _completedAt = {};

  @override
  void initState() {
    super.initState();
    _store = widget.store ?? SharedPrefsTaskStatusStore();
    _loadStatuses();
  }

  Future<void> _loadStatuses() async {
    for (final t in mockTasks) {
      _completedAt[t.id] = await _store.getCompletedAt(t.id);
    }
    if (mounted) setState(() {});
  }

  void _goHome() {
    try {
      if (kHomeRouteName.isNotEmpty) {
        context.goNamed(kHomeRouteName);
        return;
      }
    } catch (_) {}
    try {
      if (kHomePath.isNotEmpty) {
        context.go(kHomePath);
        return;
      }
    } catch (_) {
      Navigator.popUntil(context, (route) => route.isFirst);
    }
  }

  void _goTaskDetail(String id) {
    // Prefer named route with param "id" (matches your earlier router screenshot)
    try {
      if (AppRoutes.taskList.isNotEmpty) {
        context.goNamed(AppRoutes.taskList, pathParameters: {'id': id});
        return;
      }
    } catch (_) {}
    // Fallback to path navigation: /tasks/<id>
    try {
      final base = AppRoutes.taskList.isEmpty ? '/tasks' : AppRoutes.taskList;
      context.go('$base/$id');
    } catch (_) {
      // last fallback: do nothing
    }
  }

  String _todayLabel(DateTime dt) {
    const weekdays = [
      'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
    ];
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return 'Today: ${weekdays[dt.weekday - 1]}, \n'
        '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
  }

  String _formatTime(DateTime? dt) {
    if (dt == null) return '';
    int hour = dt.hour;
    final minute = dt.minute;
    final suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour == 0) hour = 12;
    final mm = minute.toString().padLeft(2, '0');
    return '$hour:$mm $suffix';
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    // Sort by scheduled time (nulls last)
    final List<Task> tasks = [...mockTasks]
      ..sort((a, b) {
        final at = a.scheduledAt;
        final bt = b.scheduledAt;
        if (at == null && bt == null) return 0;
        if (at == null) return 1;
        if (bt == null) return -1;
        return at.compareTo(bt);
      });

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadStatuses,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header: Today
                Text(
                  _todayLabel(now),
                  style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                ),
                const SizedBox(height: 14),

                // Progress pill: You are on: Tasks
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.primary, width: 2),
                    borderRadius: BorderRadius.circular(14),
                    color: AppColors.primary.withAlpha(15),
                  ),
                  child: RichText(
                    text: const TextSpan(
                      style: TextStyle(fontSize: 22, color: AppColors.primary),
                      children: [
                        TextSpan(text: 'You are on: '),
                        
                        TextSpan(
                          text: 'Tasks',
                          style: TextStyle(fontWeight: FontWeight.w800),
                          
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                // Divider line (blue)
                Container(height: 3, color: const Color(0xFF1E5BFF)),
                const SizedBox(height: 18),

                // Task cards
                for (final task in tasks) ...[
                  _TaskCard(
                    title: task.title,
                    timeLabel: _formatTime(task.scheduledAt),
                    isDone: _completedAt[task.id] != null,
                    onStart: () => _goTaskDetail(task.id),
                    onView: () => _goTaskDetail(task.id),
                  ),
                  const SizedBox(height: 18),
                ],

                const SizedBox(height: 8),

                // Return to Home
                SizedBox(
                  key: const Key('return_home_button'),
                  height: 92,
                  child: OutlinedButton(
                    onPressed: _goHome,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.black,
                      side: const BorderSide(color: Color(0xFFD1D5DB), width: 2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    child: const Text('Return to Home'),
                  ),
                ),
                ElevatedButton(
                  onPressed: () async {
                    await _store.clearAll();
                    // force rebuild
                    (context as Element).markNeedsBuild();
                  },
                  child: const Text('Reset Tasks (Dev)'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  final String title;
  final String timeLabel;
  final bool isDone;
  final VoidCallback onStart;
  final VoidCallback onView;

  const _TaskCard({
    required this.title,
    required this.timeLabel,
    required this.isDone,
    required this.onStart,
    required this.onView,
  });

  @override
  Widget build(BuildContext context) {
    const borderGrey = Color(0xFFD1D5DB);
    const green = Color(0xFF16A34A);

    final borderColor = isDone ? green : borderGrey;
    final statusText = isDone ? 'Done ✓' : 'Not Started';

    return Semantics(
      container: true,
      label: 'Task card: $title. ${isDone ? "Done" : "Not started"} at $timeLabel.',
      child: Container(
        padding: const EdgeInsets.fromLTRB(36, 18, 18, 36),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor, width: 2.6),
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _StatusIcon(isDone: isDone),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          color : AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        timeLabel,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Status pill (Done / Not Started)
             Padding(
                padding: const EdgeInsets.only(left: 58), // 44 (icon) + 14 (gap) ≈ text start
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isDone ? green : const Color(0xFF9CA3AF),
                    width: 2,
                  ),
                  color: isDone ? green.withAlpha(30) : Colors.white,
                ),
                child: Text(
                  statusText,
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: isDone ? const Color(0xFF065F46) : const Color(0xFF374151),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 18),

            // Action buttons stack 
            if (isDone) ...[
              Padding(
                padding: const EdgeInsets.only(left: 58), // 44 (icon) + 14 (gap) ≈ text start
                child: SizedBox(
                  width: 260,
                  height: 64,
                  child: OutlinedButton(
                    onPressed: onView,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF6B7280),
                      backgroundColor: const Color(0xFFE5E7EB),
                      side: const BorderSide(color: Color(0xFFC7CCD6), width: 2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    child: const Text('View Task'),
                  ),
                ),
              ),
            ] else ...[
              Padding(
                padding: const EdgeInsets.only(left: 58), // 44 (icon) + 14 (gap) ≈ text start
                child: SizedBox(
                  width: 260,
                  height: 92,
                  child: ElevatedButton(
                    onPressed: onStart,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      textStyle: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    child: const Text('Start'),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _StatusIcon extends StatelessWidget {
  final bool isDone;
  const _StatusIcon({required this.isDone});

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF16A34A);
    const grey = Color(0xFFCBD5E1);

    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: isDone ? green : grey,
          width: 3.6,
        ),
        color: isDone ? green : Colors.transparent,
      ),
      child: isDone
          ? const Icon(Icons.check, color: Colors.white, size: 26)
          : null,
    );
  }
}

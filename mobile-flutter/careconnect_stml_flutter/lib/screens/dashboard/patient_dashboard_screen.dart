import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/router.dart';
import '../../shared/theme/app_colors.dart';
import '../../shared/mocks/mock_tasks.dart';
import '../../shared/storage/task_status_store.dart';
import '../../data/models/task.dart';

//Today's date label
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

class PatientDashboardScreen extends StatelessWidget {
  final TaskStatusStore taskStore;
  final List<Task> tasks;

  PatientDashboardScreen({
    super.key,
    TaskStatusStore? taskStore,
    List<Task>? tasks,
  })  : taskStore = taskStore ?? SharedPrefsTaskStatusStore(),
        tasks = tasks ?? mockTasks;

  // Add this helper method to get the next incomplete task
  Future<Task?> _getNextIncompleteTask() async {
    final sortedTasks = [...tasks]..sort((a, b) {
      final at = a.scheduledAt;
      final bt = b.scheduledAt;
      if (at == null && bt == null) return 0;
      if (at == null) return 1;
      if (bt == null) return -1;
      return at.compareTo(bt);
    });

    for (final task in sortedTasks) {
      final completedAt = await taskStore.getCompletedAt(task.id);
      if (completedAt == null) return task;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    // Mock data (UI only)
    final locationLabel = 'Home';



// This helper should already exist in your file, but if not, add it:
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

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top row: date + profile icon
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      //'$dateLine1\n$dateLine2',
                      _todayLabel(DateTime.now()),
                      style: t.titleLarge?.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  _CircleIconButton(
                    key: const Key('profile_settings_button'),
                    icon: Icons.person_outline,
                    onPressed: () => context.go(AppRoutes.settings),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // "You are on: Home" info card
              Container(
                key: const Key('location_card'),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    width: 2,
                    color: AppColors.primary,
                  ),
                  color: AppColors.infoCardBg,
                ),
                child: RichText(
                  textAlign: TextAlign.left,
                  text: TextSpan(
                    style: t.bodyLarge?.copyWith(
                      color: AppColors.primary,
                      height: 1.2,
                    ),
                    children: [
                      const TextSpan(text: 'You are on: '),
                      TextSpan(
                        text: locationLabel,
                        style: t.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Divider line
              Container(
                height: 4,
                color: AppColors.primary,
              ),

              const SizedBox(height: 18),

              // Feeling card
              _CardButton(
                key: const Key('feeling_button'),
                height: 140,
                onPressed: () {
                  // Later: route to mood logging (for now can go to health logging)
                  context.go(AppRoutes.healthLogging);
                },
                child: Padding(padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'How Am I\nFeeling Today?',
                        textAlign: TextAlign.center,
                        style: t.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        '😊 😐 😔',
                        style: TextStyle(fontSize: 22),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Next Task card
              FutureBuilder<Task?>(
                future: _getNextIncompleteTask(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (snapshot.hasError) {
                    // For dev: show something visible so you don’t silently mask errors
                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(width: 2, color: AppColors.primary),
                        color: Colors.white,
                      ),
                      child: Text(
                        'Error loading tasks:\n${snapshot.error}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    );
                  }

                  // Show loading or placeholder while fetching
                  if (!snapshot.hasData) {
                    return Container(
                      padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(width: 2, color: AppColors.primary),
                        color: Colors.white,
                      ),
                      child: const Center(
                        child: Text(
                          'No tasks scheduled',
                          style: TextStyle(
                            fontSize: 18,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    );
                  }

                  final nextTask = snapshot.data!;
                  final timeLabel = _formatTime(nextTask.scheduledAt);

                  return Container(
                    padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(width: 2, color: AppColors.primary),
                      color: Colors.white,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Next Task',
                          style: t.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          nextTask.title,
                          style: t.headlineMedium?.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w900,
                            height: 1.05,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          timeLabel,
                          style: t.titleLarge?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Start button (green)
                        SizedBox(
                          height: 72,
                          child: ElevatedButton(
                            key: const Key('start_task_button'),
                            onPressed: () => context.go(AppRoutes.taskDetail.replaceFirst(':id', nextTask.id)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF16A34A), // green
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 6,
                            ),
                            child: Text(
                              'Start',
                              style: t.headlineSmall?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),

              const SizedBox(height: 16),

              // Schedule button
              _CardButton(
                key: const Key('schedule_button'),
                height: 92,
                onPressed: () {
                  // Later: calendar/schedule screen
                  // For now you can route to tasks list as placeholder
                  context.go(AppRoutes.taskList);
                },
                child: Text(
                  'Schedule',
                  style: t.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Messages button
              _CardButton(
                key: const Key('messages_button'),
                height: 92,
                onPressed: () {
                  // Later: messaging screen (if you add route)
                  // For now, just route to sign-in help or keep placeholder
                  context.go(AppRoutes.signInHelp);
                },
                child: Text(
                  'Messages',
                  style: t.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Emergency button (red)
              SizedBox(
                height: 78,
                child: ElevatedButton(
                  key: const Key('emergency_help_button'),
                  onPressed: () => context.go(AppRoutes.sos),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 8,
                  ),
                  child: Text(
                    'Emergency Help',
                    style: t.titleLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const _CircleIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFE6F0FF),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onPressed,
        child: const SizedBox(
          width: 52,
          height: 52,
          child: Icon(Icons.person_outline, size: 30),
        ),
      ),
    );
  }
}

class _CardButton extends StatelessWidget {
  final double height;
  final Widget child;
  final VoidCallback onPressed;

  const _CardButton({
    super.key,
    required this.height,
    required this.child,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          side: const BorderSide(width: 2, color: Color(0xFFCAD5E2)),
          elevation: 4,
          shadowColor: Colors.black12,
        ),
        child: Center(child: child),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_text_styles.dart';
import '../widgets/primary_button.dart';
import '../widgets/progress_header.dart';
import 'task_complete_screen.dart';

class TaskStepScreen extends StatefulWidget {
  final Task task;

  const TaskStepScreen({super.key, required this.task});

  @override
  State<TaskStepScreen> createState() => _TaskStepScreenState();
}

class _TaskStepScreenState extends State<TaskStepScreen> {
  int stepIndex = 0;

  @override
  Widget build(BuildContext context) {
    final steps = widget.task.steps;
    final isLast = stepIndex == steps.length - 1;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.task.title),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ProgressHeader(stepIndex: stepIndex, totalSteps: steps.length),
            const SizedBox(height: 16),
            Text('What to do now', style: AppTextStyles.h2),
            const SizedBox(height: 10),
            Text(steps[stepIndex], style: AppTextStyles.body),
            const Spacer(),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: stepIndex == 0
                        ? null
                        : () => setState(() => stepIndex -= 1),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(56),
                    ),
                    child: const Text('Back'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: PrimaryButton(
                    label: isLast ? 'Done' : 'Next',
                    onPressed: () {
                      if (isLast) {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (_) => TaskCompleteScreen(
                              taskTitle: widget.task.title,
                              completedAt: DateTime.now(),
                            ),
                          ),
                        );
                        return;
                      }
                      setState(() => stepIndex += 1);
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

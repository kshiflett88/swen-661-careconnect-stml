import 'package:flutter/material.dart';
import '../theme/app_text_styles.dart';
import '../theme/app_colors.dart';
import '../widgets/primary_button.dart';

class TaskCompleteScreen extends StatelessWidget {
  final String taskTitle;
  final DateTime completedAt;

  const TaskCompleteScreen({
    super.key,
    required this.taskTitle,
    required this.completedAt,
  });

  @override
  Widget build(BuildContext context) {
    final ts =
        '${completedAt.hour.toString().padLeft(2, '0')}:${completedAt.minute.toString().padLeft(2, '0')}';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Completed'),
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Done ✅', style: AppTextStyles.h1),
            const SizedBox(height: 8),
            Text(taskTitle, style: AppTextStyles.body),
            const SizedBox(height: 8),
            Text('Completed at $ts', style: AppTextStyles.bodyMuted),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.success.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'You’re all set. If you feel unsure later, you can check here again.',
                style: AppTextStyles.body,
              ),
            ),
            const Spacer(),
            PrimaryButton(
              label: 'Back to Today',
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
            ),
          ],
        ),
      ),
    );
  }
}

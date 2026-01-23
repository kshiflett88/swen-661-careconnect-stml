import 'package:flutter/material.dart';
import '../data/sample_tasks.dart';
import '../theme/app_text_styles.dart';
import '../widgets/primary_button.dart';
import 'task_step_screen.dart';

class DailyOverviewScreen extends StatelessWidget {
  const DailyOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Today'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('CareConnect', style: AppTextStyles.h1),
            const SizedBox(height: 6),
            Text(
              'Daily Plan • ${today.month}/${today.day}/${today.year}',
              style: AppTextStyles.bodyMuted,
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Next task', style: AppTextStyles.h2),
                    const SizedBox(height: 8),
                    Text(sampleTask.title, style: AppTextStyles.body),
                    const SizedBox(height: 16),
                    PrimaryButton(
                      label: 'Start',
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => TaskStepScreen(task: sampleTask),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Tip: If you feel unsure, come back here to check what’s next.',
              style: AppTextStyles.bodyMuted,
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../../shared/widgets/back_to_dashboard_button.dart';

class TaskDetailScreen extends StatelessWidget {
  final String taskId;

  const TaskDetailScreen({
    super.key,
    required this.taskId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Task Detail')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Task Detail $taskId'),
            SizedBox(height: 16),
            BackToDashboardButton(),
          ],
        ),
      ),
    );
  }
}

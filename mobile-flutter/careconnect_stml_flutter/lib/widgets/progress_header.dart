import 'package:flutter/material.dart';
import '../theme/app_text_styles.dart';

class ProgressHeader extends StatelessWidget {
  final int stepIndex; // 0-based
  final int totalSteps;

  const ProgressHeader({
    super.key,
    required this.stepIndex,
    required this.totalSteps,
  });

  @override
  Widget build(BuildContext context) {
    final stepNumber = stepIndex + 1;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step $stepNumber of $totalSteps', style: AppTextStyles.step),
        const SizedBox(height: 8),
        LinearProgressIndicator(value: stepNumber / totalSteps),
      ],
    );
  }
}

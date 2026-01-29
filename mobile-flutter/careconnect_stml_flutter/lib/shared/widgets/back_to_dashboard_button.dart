import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/router.dart';

class BackToDashboardButton extends StatelessWidget {
  const BackToDashboardButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () => context.go(AppRoutes.dashboard),
      icon: const Icon(Icons.home),
      label: const Text('Back to Dashboard'),
    );
  }
}

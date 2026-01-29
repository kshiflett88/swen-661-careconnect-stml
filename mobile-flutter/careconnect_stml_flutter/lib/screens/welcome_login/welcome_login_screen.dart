import 'package:flutter/material.dart';
import '../../shared/widgets/back_to_dashboard_button.dart';

class WelcomeLoginScreen extends StatelessWidget {
  const WelcomeLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tasks')),
      body: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Welcome Screen (STML)'),
            SizedBox(height: 16),
            BackToDashboardButton(),
          ],
        ),
      ),
    );
  }
}

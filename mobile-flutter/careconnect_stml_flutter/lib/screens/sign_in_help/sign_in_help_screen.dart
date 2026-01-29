import 'package:flutter/material.dart';
import '../../shared/widgets/back_to_dashboard_button.dart';

class SignInHelpScreen extends StatelessWidget {
  const SignInHelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tasks')),
      body: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Sign In Screen (STML)'),
            SizedBox(height: 16),
            BackToDashboardButton(),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../../shared/widgets/back_to_dashboard_button.dart';

class ProfileSettingsScreen extends StatelessWidget {
  const ProfileSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tasks')),
      body: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Profile Settings Screen (STML)'),
            SizedBox(height: 16),
            BackToDashboardButton(),
          ],
        ),
      ),
    );
  }
}

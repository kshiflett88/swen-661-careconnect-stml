import 'package:flutter/material.dart';
import '../../shared/widgets/back_to_dashboard_button.dart';

class SosScreen extends StatelessWidget {
  const SosScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tasks')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('SOS Screen (STML)'),
            SizedBox(height: 16),
            BackToDashboardButton(),
          ],
        ),
      ),
    );
  }
}

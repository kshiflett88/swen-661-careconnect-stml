import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/router.dart';

class PatientDashboardScreen extends StatelessWidget {
  const PatientDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard (STML)')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Dev Navigation',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 12),

          _NavCard(
            title: 'Welcome / Login',
            onTap: () => context.go(AppRoutes.welcomeLogin),
          ),
          _NavCard(
            title: 'Sign-In Help',
            onTap: () => context.go(AppRoutes.signInHelp),
          ),
          _NavCard(
            title: 'Task List',
            onTap: () => context.go(AppRoutes.taskList),
          ),
          _NavCard(
            title: 'Task Detail (id=1)',
            onTap: () => context.go('/tasks/1'),
          ),
          _NavCard(
            title: 'Health Logging',
            onTap: () => context.go(AppRoutes.healthLogging),
          ),
          _NavCard(
            title: 'Emergency / SOS',
            onTap: () => context.go(AppRoutes.sos),
          ),
          _NavCard(
            title: 'Profile / Settings',
            onTap: () => context.go(AppRoutes.settings),
          ),
        ],
      ),
    );
  }
}

class _NavCard extends StatelessWidget {
  final String title;
  final VoidCallback onTap;

  const _NavCard({required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}

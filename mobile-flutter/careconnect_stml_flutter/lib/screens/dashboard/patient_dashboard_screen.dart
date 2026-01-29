import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/router.dart';
import '../../shared/theme/app_colors.dart';

class PatientDashboardScreen extends StatelessWidget {
  const PatientDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    // Mock data (UI only)
    final dateLine1 = 'Monday, January';
    final dateLine2 = '26, 2026';
    final locationLabel = 'Home';

    final nextTaskTitle = 'Take Morning\nMedication';
    final nextTaskTime = '9:00 AM';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top row: date + profile icon
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      '$dateLine1\n$dateLine2',
                      style: t.titleLarge?.copyWith(
                        color: AppColors.textPrimary,
                        height: 1.15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  _CircleIconButton(
                    icon: Icons.person_outline,
                    onPressed: () => context.go(AppRoutes.settings),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // "You are on: Home" info card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    width: 2,
                    color: AppColors.primary,
                  ),
                  color: AppColors.infoCardBg,
                ),
                child: RichText(
                  textAlign: TextAlign.left,
                  text: TextSpan(
                    style: t.bodyLarge?.copyWith(
                      color: AppColors.primary,
                      height: 1.2,
                    ),
                    children: [
                      const TextSpan(text: 'You are on: '),
                      TextSpan(
                        text: locationLabel,
                        style: t.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Divider line
              Container(
                height: 4,
                color: AppColors.primary,
              ),

              const SizedBox(height: 18),

              // Feeling card
              _CardButton(
                height: 140,
                onPressed: () {
                  // Later: route to mood logging (for now can go to health logging)
                  context.go(AppRoutes.healthLogging);
                },
                child: Padding(padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'How Am I\nFeeling Today?',
                        textAlign: TextAlign.center,
                        style: t.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        '😊 😐 😔',
                        style: TextStyle(fontSize: 22),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Next Task card
              Container(
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(width: 2, color: AppColors.primary),
                  color: Colors.white,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Next Task',
                      style: t.bodyMedium?.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      nextTaskTitle,
                      style: t.headlineMedium?.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w900,
                        height: 1.05,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      nextTaskTime,
                      style: t.titleLarge?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Start button (green)
                    SizedBox(
                      height: 72,
                      child: ElevatedButton(
                        onPressed: () => context.go(AppRoutes.taskDetail.replaceFirst(':id', '1')),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF16A34A), // green
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 6,
                        ),
                        child: Text(
                          'Start',
                          style: t.headlineSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Schedule button
              _CardButton(
                height: 92,
                onPressed: () {
                  // Later: calendar/schedule screen
                  // For now you can route to tasks list as placeholder
                  context.go(AppRoutes.taskList);
                },
                child: Text(
                  'Schedule',
                  style: t.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Messages button
              _CardButton(
                height: 92,
                onPressed: () {
                  // Later: messaging screen (if you add route)
                  // For now, just route to sign-in help or keep placeholder
                  context.go(AppRoutes.signInHelp);
                },
                child: Text(
                  'Messages',
                  style: t.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Emergency button (red)
              SizedBox(
                height: 78,
                child: ElevatedButton(
                  onPressed: () => context.go(AppRoutes.sos),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 8,
                  ),
                  child: Text(
                    'Emergency Help',
                    style: t.titleLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const _CircleIconButton({
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFE6F0FF),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onPressed,
        child: const SizedBox(
          width: 52,
          height: 52,
          child: Icon(Icons.person_outline, size: 30),
        ),
      ),
    );
  }
}

class _CardButton extends StatelessWidget {
  final double height;
  final Widget child;
  final VoidCallback onPressed;

  const _CardButton({
    required this.height,
    required this.child,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          side: const BorderSide(width: 2, color: Color(0xFFCAD5E2)),
          elevation: 4,
          shadowColor: Colors.black12,
        ),
        child: Center(child: child),
      ),
    );
  }
}


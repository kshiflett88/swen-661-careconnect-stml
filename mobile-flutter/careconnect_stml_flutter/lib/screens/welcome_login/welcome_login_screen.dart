import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/cupertino.dart';

import '../../app/router.dart';
import '../../shared/theme/app_colors.dart';

class WelcomeLoginScreen extends StatelessWidget {
  const WelcomeLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),

              // TODO: Replace with your asset once exported from Figma.
              // Keeping a placeholder circle + icon.
              Center(
                child: Container(
                  width: 96,
                  height: 96,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFFE6F0FF),
                  ),
                  child: const Icon(Icons.local_hospital, size: 40),
                ),
              ),

              const SizedBox(height: 16),

              Text(
                'CareConnect',
                textAlign: TextAlign.center,
                style: t.headlineLarge,
              ),

              const SizedBox(height: 20),

              // Info card
              Container(
                height: 116,
                padding: const EdgeInsets.symmetric(horizontal: 26),
                decoration: BoxDecoration(
                  color: AppColors.infoCardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(width: 2, color: AppColors.infoCardBorder),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Your caregiver has set\nthis up for you.',
                      textAlign: TextAlign.center,
                      style: t.bodyMedium,
                    ),
                  ],
                ),
              ),


              const SizedBox(height: 20),

              // Primary Face ID button (mock -> dashboard)
              _PrimaryBigButton(
                label: 'Continue\nwith Face ID',
                onPressed: () => context.go(AppRoutes.dashboard),
                icon: CupertinoIcons.viewfinder,
              ),

              const SizedBox(height: 12),

              Text(
                'Look at the camera to sign in',
                textAlign: TextAlign.center,
                style: t.bodyLarge,
              ),

              const SizedBox(height: 20),

              // Secondary buttons
              _SecondaryCardButton(
                label: 'I am a\nCaregiver',
                icon: Icons.person_add_alt_1_outlined,
                onPressed: () {
                  // You can decide later. For now route to dashboard or caregiver dashboard mock.
                  context.go(AppRoutes.dashboard);
                },
              ),

              const SizedBox(height: 12),

              _SecondaryCardButton(
                label: 'I need help\nsigning in',
                icon: Icons.help_outline,
                onPressed: () => context.go(AppRoutes.signInHelp),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PrimaryBigButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData? icon;

  const _PrimaryBigButton({required this.label, required this.onPressed, this.icon});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return SizedBox(
      height: 240,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          padding: const EdgeInsets.all(40),
          shadowColor: Colors.black.withOpacity(0.25),
        ).copyWith(
          // This better matches your Figma drop shadow
          elevation: const WidgetStatePropertyAll(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 56, color: Colors.white),
              const SizedBox(height: 16),
            ],
            Text(
              label,
              textAlign: TextAlign.center,
              style: t.headlineMedium,
            ),
          ],
        ),
      ),
    );
  }
}

class _SecondaryCardButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onPressed;

  const _SecondaryCardButton({
    required this.label,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return SizedBox(
      height: 140,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.textPrimary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          side: const BorderSide(width: 2, color: AppColors.outlineBorder),
          padding: const EdgeInsets.all(34),
        ).copyWith(
          elevation: const WidgetStatePropertyAll(4),
          shadowColor: WidgetStatePropertyAll(Colors.black.withOpacity(0.10)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 36), // bigger icon
            const SizedBox(width: 24),
            Expanded(
              child: Text(
                label,
                textAlign: TextAlign.center,
                style: t.titleLarge,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

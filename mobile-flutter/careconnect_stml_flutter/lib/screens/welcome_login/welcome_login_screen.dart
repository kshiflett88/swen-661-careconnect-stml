import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/cupertino.dart';

import '../../app/router.dart';
import '../../shared/theme/app_colors.dart';

import 'package:flutter/widgets.dart';


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
                'Access CareConnect',
                textAlign: TextAlign.center,
                style: t.headlineLarge,
              ),

              const SizedBox(height: 20),

              // Info card
              ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 116),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.infoCardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(width: 2, color: AppColors.infoCardBorder),
                  ),
                  child: Center(
                    child: Text(
                      'Your caregiver has set up\nsecure access up for you.',
                      textAlign: TextAlign.center,
                      style: t.bodyMedium,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              FocusTraversalGroup(
                policy: OrderedTraversalPolicy(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    FocusTraversalOrder(
                      order: const NumericFocusOrder(1),
                      child: Focus(
                        key: const Key('focus_face_id'),
                        autofocus: true,
                        child: _PrimaryBigButton(
                          key: const Key('face_id_button'),
                          label: 'Sign in\nwith Face ID',
                          onPressed: () => context.go(AppRoutes.dashboard),
                          icon: CupertinoIcons.viewfinder,
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    Text(
                      'Look at the camera to sign in',
                      textAlign: TextAlign.center,
                      style: t.bodyLarge,
                    ),

                    const SizedBox(height: 20),

                    FocusTraversalOrder(
                      order: const NumericFocusOrder(2),
                      child: Focus(
                        key: const Key('focus_caregiver'),
                        child: _SecondaryCardButton(
                          key: const Key('caregiver_button'),
                          label: 'I am a\nCaregiver (Setup)',
                          icon: Icons.person_add_alt_1_outlined,
                          onPressed: () => context.go(AppRoutes.dashboard),
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    FocusTraversalOrder(
                      order: const NumericFocusOrder(3),
                      child: Focus(
                        key: const Key('focus_help_signin'),
                        child: _SecondaryCardButton(
                          key: const Key('help_signing_in_button'),
                          label: 'I need help\nsigning in',
                          icon: Icons.help_outline,
                          onPressed: () => context.go(AppRoutes.signInHelp),
                        ),
                      ),
                    ),
                  ],
                ),
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

  const _PrimaryBigButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon
  });

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 240),
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
  final Key? _buttonKey;
  
  const _SecondaryCardButton({
    Key? key,
    required this.label,
    required this.icon,
    required this.onPressed,
  }) : _buttonKey = key;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 140),
      child: Semantics(
        button: true,
        label: label.replaceAll('\n', ' '),
        child: OutlinedButton(
          key: _buttonKey, // or key: key if you're using that version
          onPressed: onPressed,
          style: OutlinedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: AppColors.textPrimary,
            minimumSize: const Size(double.infinity, 120),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20), // <-- rounded square
            ),
            side: const BorderSide(
              width: 2,
              color: AppColors.outlineBorder,
            ),
            elevation: 4,
            shadowColor: Colors.black.withOpacity(0.10),
          ),
          child: Row(
            children: [
              Icon(icon, size: 36),
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
      ),
    );

  }
}

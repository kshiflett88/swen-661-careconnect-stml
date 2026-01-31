import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/cupertino.dart';

import '../../app/router.dart';
import '../../shared/theme/app_colors.dart';

class SignInHelpScreen extends StatelessWidget {
  const SignInHelpScreen({super.key});

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
              // Back row (top-left)
              _BackRow(
                onPressed: () {
                  // Prefer pop if possible; fallback to dashboard
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go(AppRoutes.welcomeLogin);
                  }
                },
              ),

              const SizedBox(height: 20),

              // Icon circle
              Center(
                child: Container(
                  width: 96,
                  height: 96,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFFE6F0FF),
                  ),
                  child: const Icon(
                    Icons.favorite,
                    size: 44,
                    color: Color(0xFF155DFC),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Title
              Text(
                'Need help\nsigning in?',
                textAlign: TextAlign.center,
                style: t.headlineLarge,
              ),

              const SizedBox(height: 10),

              // Subtitle
              Text(
                'Your caregiver can\nhelp you access the\napp.',
                textAlign: TextAlign.center,
                style: t.bodyLarge,
              ),

              const SizedBox(height: 24),

              // Buttons
              _LargeActionButton(
                key: Key('call_caregiver_button'),
                variant: _ActionVariant.success,
                icon: Icons.call,
                label: 'Call my\ncaregiver',
                onPressed: () {
                  // UI-only mock
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Calling caregiver (mock)...')),
                  );
                },
              ),

              const SizedBox(height: 16),

              _LargeActionButton(
                key: Key('send_message_button'),
                variant: _ActionVariant.primary,
                icon: Icons.chat_bubble_outline,
                label: 'Send a\nmessage to\nmy caregiver',
                onPressed: () {
                  // UI-only mock
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Messaging caregiver (mock)...')),
                  );
                },
              ),

              const SizedBox(height: 16),

              _LargeActionButton(
                key: Key('face_id_button'),
                variant: _ActionVariant.outlined,
                icon: CupertinoIcons.viewfinder,
                label: 'Try Face\nID again',
                onPressed: () => context.go(AppRoutes.welcomeLogin),
              ),

            ],
          ),
        ),
      ),
    );
  }
}

class _BackRow extends StatelessWidget {
  final VoidCallback onPressed;

  const _BackRow({required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.arrow_back, size: 26, color: AppColors.textPrimary),
            const SizedBox(width: 10),
            Text(
              'Back',
              style: t.titleLarge?.copyWith(color: AppColors.textPrimary),
            ),
          ],
        ),
      ),
    );
  }
}

enum _ActionVariant { success, primary, outlined }

class _LargeActionButton extends StatelessWidget {
  final _ActionVariant variant;
  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  const _LargeActionButton({
    super.key,
    required this.variant,
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    final bool isOutlined = variant == _ActionVariant.outlined;

    final Color bg = switch (variant) {
      _ActionVariant.success => const Color(0xFF16A34A),
      _ActionVariant.primary => AppColors.primary,
      _ActionVariant.outlined => Colors.white,
    };

    final Color fg = switch (variant) {
      _ActionVariant.success => Colors.white,
      _ActionVariant.primary => Colors.white,
      _ActionVariant.outlined => AppColors.textPrimary,
    };

    final BorderSide border = switch (variant) {
      _ActionVariant.outlined => const BorderSide(width: 2, color: AppColors.outlineBorder),
      _ => BorderSide.none,
    };

    return SizedBox(
      height: variant == _ActionVariant.outlined ? 140 : 170,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: border,
          ),
        ).copyWith(
          elevation: WidgetStatePropertyAll(isOutlined ? 6 : 10),
          shadowColor: WidgetStatePropertyAll(
            Colors.black.withOpacity(isOutlined ? 0.10 : 0.25),
          ),
        ),
        child: Row(
          children: [
            Icon(icon, size: 44, color: fg),
            const SizedBox(width: 18),
            Expanded(
              child: Text(
                label,
                textAlign: TextAlign.center,
                style: (variant == _ActionVariant.outlined
                        ? t.titleLarge
                        : t.headlineMedium)
                    ?.copyWith(
                  color: fg,
                  fontWeight: FontWeight.w700,
                  height: 1.1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

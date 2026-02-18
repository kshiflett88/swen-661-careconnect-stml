import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';

import '../../app/router.dart';
import '../../shared/theme/app_colors.dart';

class SignInHelpScreen extends StatelessWidget {
  final VoidCallback? onCallCaregiver;
  final VoidCallback? onSendMessage;
  final VoidCallback? onTryFaceId;

  const SignInHelpScreen({
    super.key,
    this.onCallCaregiver,
    this.onSendMessage,
    this.onTryFaceId,
  });
  

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final callNode = FocusNode(debugLabel: 'callCaregiver');
    final msgNode = FocusNode(debugLabel: 'sendMessage');
    final faceNode = FocusNode(debugLabel: 'tryFaceId');
    // Ordered focus for logical keyboard navigation:
    // Back -> Call -> Message -> Face ID
    return Scaffold(
      body: SafeArea(
        child: FocusTraversalGroup(
          policy: OrderedTraversalPolicy(),
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FocusTraversalOrder(
                  order: const NumericFocusOrder(1),
                  child: _BackRow(
                    key: const Key('sign_in_help_back_button'),
                    onPressed: () {
                      final nav = Navigator.of(context);
                      if (nav.canPop()) {
                        nav.pop();
                        return;
                      }
                      // Only navigate with GoRouter if it exists in the tree (prevents test crash)
                      final router = GoRouter.maybeOf(context);
                      if (router != null) {
                        router.go(AppRoutes.welcomeLogin);
                      }
                    },
                  ),
                ),

                const SizedBox(height: 20),

                // Decorative icon - exclude from semantics so screen readers
                // don't announce it as meaningful content.
                ExcludeSemantics(
                  child: Center(
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
                ),

                const SizedBox(height: 20),

                // Title as a header for screen readers
                Semantics(
                  header: true,
                  label: 'Need help signing in?',
                  child: Text(
                    'Need help\nsigning in?',
                    textAlign: TextAlign.center,
                    style: t.headlineLarge,
                  ),
                ),

                const SizedBox(height: 10),

                Semantics(
                  label: 'Your caregiver can help you access the app.',
                  child: Text(
                    'Your caregiver can\nhelp you access the\napp.',
                    textAlign: TextAlign.center,
                    style: t.bodyLarge,
                  ),
                ),

                const SizedBox(height: 24),

                FocusTraversalOrder(
                  order: const NumericFocusOrder(2),
                  child: _LargeActionButton(
                    key: const Key('call_caregiver_button'),
                    focusKey: const Key('focus_call_caregiver'),
                    focusNode: callNode,
                    semanticsLabel: 'Call my caregiver',
                    semanticsHint: 'Calls your caregiver for help signing in',
                    variant: _ActionVariant.success,
                    icon: Icons.call,
                    label: 'Call my\ncaregiver',
                    onPressed: onCallCaregiver ??
                      () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Calling caregiver (mock)...')),
                        );
                      },
                  ),
                ),

                const SizedBox(height: 16),

                FocusTraversalOrder(
                  order: const NumericFocusOrder(3),
                  child: _LargeActionButton(
                    key: const Key('send_message_button'),
                    focusKey: const Key('focus_send_message'),
                    focusNode: msgNode,
                    semanticsLabel: 'Send a message to my caregiver',
                    semanticsHint: 'Sends a message to your caregiver for help signing in',
                    variant: _ActionVariant.primary,
                    icon: Icons.chat_bubble_outline,
                    label: 'Send a\nmessage to\nmy caregiver',
                    onPressed: onSendMessage ??
                      () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Messaging caregiver (mock)...')),
                        );
                      },
                  ),
                ),

                const SizedBox(height: 16),

                FocusTraversalOrder(
                  order: const NumericFocusOrder(4),
                  child: _LargeActionButton(
                    key: const Key('face_id_button'),
                    focusKey: const Key('focus_face_id'),
                    focusNode: faceNode,
                    semanticsLabel: 'Try Face ID again',
                    semanticsHint: 'Returns to the sign in screen to try Face ID again',
                    variant: _ActionVariant.outlined,
                    icon: CupertinoIcons.viewfinder,
                    label: 'Try Face\nID again',
                    onPressed: onTryFaceId ??
                      () { 
                        context.go(AppRoutes.welcomeLogin);
                      }
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BackRow extends StatelessWidget {
  final VoidCallback onPressed;

  const _BackRow({super.key, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    return Semantics(
      button: true,
      label: 'Back',
      hint: 'Returns to the previous screen',
      excludeSemantics: true,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
          child: FocusableActionDetector(
          shortcuts: const <ShortcutActivator, Intent>{
            SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
            SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
          },
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (intent) {
                onPressed();
                return null;
              },
            ),
          },
          child: ExcludeSemantics(
            child: InkWell(
              onTap: onPressed,
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
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
            ),
          ),
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

  final String semanticsLabel;
  final String semanticsHint;


  final Key? focusKey;
  final FocusNode? focusNode;

  const _LargeActionButton({
    super.key,
    required this.variant,
    required this.icon,
    required this.label,
    required this.onPressed,
    required this.semanticsLabel,
    required this.semanticsHint,
    this.focusKey, 
    this.focusNode,
  });

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;

    final bool isOutlined = variant == _ActionVariant.outlined;

    final Color bg = switch (variant) {
      _ActionVariant.success => const Color(0xFF15803D),
      _ActionVariant.primary => const Color(0xFF155DFC), // AA-safe darker blue
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

    // Buttons already exceed 48x48; keep explicit sizing.
    final double height = variant == _ActionVariant.outlined ? 140 : 170;

    return Semantics(
      button: true,
      label: semanticsLabel,
      hint: semanticsHint,
      excludeSemantics: true,
      child: FocusableActionDetector(
        key: focusKey,
        focusNode: focusNode, 
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (intent) {
              onPressed();
              return null;
            },
          ),
        },
        child: SizedBox(
          height: height,
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
        ),
      ),
    );
  }
}

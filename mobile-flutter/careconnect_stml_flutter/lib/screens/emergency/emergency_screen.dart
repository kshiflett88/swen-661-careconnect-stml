import 'package:flutter/material.dart';
import '../../shared/theme/app_colors.dart';
import 'emergency_confirmation_screen.dart';
import 'package:go_router/go_router.dart';
import '../../../app/router.dart';

class EmergencyScreen extends StatelessWidget {
  const EmergencyScreen({super.key});

  String _todayLabel(DateTime dt) {
    const weekdays = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return 'Today: ${weekdays[dt.weekday - 1]},\n'
        '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final t = Theme.of(context).textTheme;

    const red = Color(0xFFDC2626);
    const redSoft = Color(0xFFFEF2F2);
    const yellow = Color(0xFFEAB308);
    const yellowSoft = Color(0xFFFEF9C3);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Today header (matches your other screens)
                    Text(
                      _todayLabel(now),
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // "You are on" card (red)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                      decoration: BoxDecoration(
                        color: redSoft,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: red, width: 2),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'You are on:',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: red,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Emergency Help',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: red,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // red divider line
                    Container(height: 3, color: red),
                    const SizedBox(height: 18),

                    // Yellow warning card
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: yellowSoft,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: yellow, width: 2),
                      ),
                      child: const Text(
                        'This will send an alert to\nyour caregiver and start\na call',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 22,
                          height: 1.25,
                          fontWeight: FontWeight.w700,
                          color: Colors.black,
                        ),
                      ),
                    ),

                    const SizedBox(height: 18),

                    // SOS button
                    FocusTraversalGroup(
                      policy: OrderedTraversalPolicy(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          FocusTraversalOrder(
                            order: const NumericFocusOrder(1),
                            child: Focus(
                              key: const Key('focus_sos'),
                              autofocus: true,
                              child: Semantics(
                                key: const Key('sem_sos'),
                                button: true,
                                label: 'SOS. Press to call for emergency help.',
                                child: SizedBox(
                                  height: 260,
                                  child: Material(
                                    color: red,
                                    borderRadius: BorderRadius.circular(18),
                                    elevation: 2,
                                    child: InkWell(
                                      borderRadius: BorderRadius.circular(18),
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) => const EmergencyConfirmationScreen(),
                                          ),
                                        );
                                      },
                                      child: Center(
                                        child: FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: const [
                                              Text(
                                                'SOS',
                                                style: TextStyle(
                                                  fontSize: 86,
                                                  fontWeight: FontWeight.w900,
                                                  color: Colors.white,
                                                  letterSpacing: 6,
                                                ),
                                              ),
                                              SizedBox(height: 8),
                                              Text(
                                                'Press to Call for Help',
                                                textAlign: TextAlign.center,
                                                style: TextStyle(
                                                  fontSize: 28,
                                                  fontWeight: FontWeight.w800,
                                                  color: Colors.white,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 18),

                          FocusTraversalOrder(
                            order: const NumericFocusOrder(2),
                            child: Focus(
                              key: const Key('focus_emergency_cancel'),
                              child: Semantics(
                                key: const Key('sem_emergency_cancel'),
                                button: true,
                                label: 'Cancel. Return to the previous screen.',
                                child: _CardButton(
                                  key: const Key('cancel_button'),
                                  height: 92,
                                  onPressed: () => context.go(AppRoutes.dashboard),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(Icons.cancel, size: 28),
                                      const SizedBox(width: 12),
                                      Text(
                                        'Cancel',
                                        style: t.titleLarge?.copyWith(
                                          fontWeight: FontWeight.w900,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),                          

                          const SizedBox(height: 14),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
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
    super.key,
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
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          side: const BorderSide(width: 2, color: Color(0xFFCAD5E2)),
          elevation: 4,
          shadowColor: Colors.black12,
        ),
        child: Center(child: child),
      ),
    );
  }
}

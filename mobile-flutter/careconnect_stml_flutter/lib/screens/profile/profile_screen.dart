import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../app/router.dart';
import '../../shared/theme/app_colors.dart';
import '../../models/user_profile.dart';
import 'accessibility_settings_screen.dart';

// Today's date label (same as dashboard)
String _todayLabel(DateTime dt) {
  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return 'Today: ${weekdays[dt.weekday - 1]}, \n'
      '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  /// Optional DOB support (won’t crash if your UserProfile model doesn’t have it).
  String? _tryDobLabel(UserProfile profile) {
    try {
      final dyn = profile as dynamic;
      final dob = dyn.dateOfBirth;

      if (dob is DateTime) {
        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        return '${months[dob.month - 1]} ${dob.day}, ${dob.year}';
      }

      if (dob is String && dob.trim().isNotEmpty) return dob.trim();
      return null;
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final userProfile = UserProfile.mock();
    final dobLabel = _tryDobLabel(userProfile);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top row: date (same style as dashboard)
              Text(
                _todayLabel(DateTime.now()),
                style: t.titleLarge?.copyWith(
                  color: AppColors.textPrimary,
                  height: 1.15,
                  fontWeight: FontWeight.w600,
                ),
              ),

              const SizedBox(height: 12),

              // "You are on: My Profile" info card (exact dashboard pattern)
              Container(
                key: const Key('location_card_profile'),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(width: 2, color: AppColors.primary),
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
                        text: 'My Profile',
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

              // Divider line (same as dashboard)
              Container(height: 4, color: AppColors.primary),

              const SizedBox(height: 18),

              // ===== Card: Your Information =====
              Container(
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(width: 2, color: Color(0xFFCAD5E2)),
                  color: Colors.white,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Text(
                        'Your Information',
                        style: t.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Profile image placeholder (blue ring)
                    Center(
                      child: Container(
                        width: 96,
                        height: 96,
                        decoration: BoxDecoration(
                          color: AppColors.infoCardBg,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.primary, width: 3),
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 52,
                          color: AppColors.primary,
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    Center(
                      child: Text(
                        'Your Name',
                        style: t.bodyMedium?.copyWith(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),

                    Center(
                      child: Text(
                        userProfile.userName,
                        textAlign: TextAlign.left,
                        style: t.headlineMedium?.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w900,
                          height: 1.05,
                        ),
                      ),
                    ),

                    if (dobLabel != null) ...[
                      const SizedBox(height: 18),
                      Container(
                        padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                        decoration: BoxDecoration(
                          color: AppColors.infoCardBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(width: 1.5, color: const Color(0xFFCAD5E2)),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Date of Birth',
                              style: t.bodyMedium?.copyWith(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              dobLabel,
                              style: t.titleLarge?.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // ===== Card: Caregiver Contact =====
              Container(
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(width: 2, color:  Color(0xFFCAD5E2)),
                  color: Colors.white,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Text(
                        'Caregiver Contact',
                        style: t.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Light info blocks (match your target mock look)
                    Container(
                      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                      decoration: BoxDecoration(
                        color: AppColors.infoCardBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(width: 1.5, color: const Color(0xFFCAD5E2)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Primary Caregiver',
                            style: t.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            userProfile.caregiverName,
                            textAlign: TextAlign.left,
                            style: t.titleLarge?.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    Container(
                      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(width: 1.5, color: const Color(0xFFCAD5E2)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Phone Number',
                            style: t.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            userProfile.caregiverPhone,
                            textAlign: TextAlign.left,
                            style: t.titleLarge?.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    Container(
                      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(width: 1.5, color: const Color(0xFFCAD5E2)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Email',
                            style: t.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            userProfile.caregiverEmail,
                            textAlign: TextAlign.left,
                            style: t.bodyLarge?.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Accessibility Setup button (BLUE + WHITE TEXT like you want)
              SizedBox(
                height: 92, // same feel as dashboard buttons
                child: ElevatedButton(
                  key: const Key('accessibility_setup_button'),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AccessibilitySettingsScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 8,
                  ),
                  child: Text(
                    'View Accessibility Setup',
                    textAlign: TextAlign.center,
                    style: t.titleLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 14),

              // Back to Home (dashboard card button)
              _CardButton(
                key: const Key('back_to_home_button'),
                height: 92,
                onPressed: () => context.go(AppRoutes.dashboard),
                child: Text(
                  'Back to Home',
                  style: t.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
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


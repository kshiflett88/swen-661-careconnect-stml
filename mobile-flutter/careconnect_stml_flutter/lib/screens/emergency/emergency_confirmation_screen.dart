import 'package:flutter/material.dart';
import '../../../models/user_profile.dart';
import '../../../theme/app_colors.dart';
import '../../../widgets/orientation_header.dart';
import '../../../widgets/emergency_button.dart';
import 'emergency_calling_screen.dart';

class EmergencyConfirmationScreen extends StatelessWidget {
  const EmergencyConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProfile = UserProfile.mock();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            const OrientationHeader(screenName: 'Confirm Emergency'),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.warning_rounded,
                      size: 80,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 32),
                    const Text(
                      'Do you want to send an emergency alert?',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.error.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'This will send an alert to ${userProfile.caregiverName} and start a call.',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 64),
                    EmergencyButton(
                      label: 'Yes, Send Alert',
                      icon: Icons.check_circle,
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => EmergencyCallingScreen(
                              caregiverName: userProfile.caregiverName,
                              caregiverPhone: userProfile.caregiverPhone,
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.secondary,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.cancel),
                            SizedBox(width: 12),
                            Text('Cancel', style: TextStyle(fontSize: 18)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

extension on Color? {
  // ignore: body_might_complete_normally_nullable
  Color? withOpacity(double opacity) {}
}

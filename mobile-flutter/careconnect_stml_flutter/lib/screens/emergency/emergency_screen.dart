import 'package:flutter/material.dart';
import '../../../theme/app_colors.dart';
import '../../../widgets/orientation_header.dart';
import '../../../widgets/emergency_button.dart';
import 'emergency_confirmation_screen.dart';

class EmergencyScreen extends StatelessWidget {
  const EmergencyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            const OrientationHeader(screenName: 'Emergency Help'),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: AppColors.error.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.emergency,
                        size: 64,
                        color: AppColors.error,
                      ),
                    ),
                    const SizedBox(height: 32),
                    const Text(
                      'Need Help?',
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Press the button below to contact your caregiver immediately.',
                      style: TextStyle(
                        fontSize: 18,
                        color: AppColors.mutedText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 64),
                    EmergencyButton(
                      label: 'Send Emergency Alert',
                      icon: Icons.phone_in_talk,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                const EmergencyConfirmationScreen(),
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
                            Icon(Icons.home),
                            SizedBox(width: 12),
                            Text(
                              'Return to Home',
                              style: TextStyle(fontSize: 18),
                            ),
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

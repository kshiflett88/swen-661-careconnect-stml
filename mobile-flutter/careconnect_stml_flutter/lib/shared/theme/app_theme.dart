import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    final base = ThemeData.light(useMaterial3: true);

    return base.copyWith(
      scaffoldBackgroundColor: Colors.white,
      colorScheme: base.colorScheme.copyWith(
        primary: AppColors.primary,
        surface: AppColors.surface,
      ),
      textTheme: base.textTheme.copyWith(
        // CareConnect title
        headlineLarge: const TextStyle(
          fontFamily: 'Arial',
          fontSize: 48,
          fontWeight: FontWeight.w700,
          height: 1.0,
          color: AppColors.textPrimary,
        ),
        // Big primary button text
        headlineMedium: const TextStyle(
          fontFamily: 'Arial',
          fontSize: 36,
          fontWeight: FontWeight.w700,
          height: 40 / 36,
          color: Colors.white,
        ),
        // Secondary button text
        titleLarge: const TextStyle(
          fontFamily: 'Arial',
          fontSize: 30,
          fontWeight: FontWeight.w700,
          height: 36 / 30,
          color: AppColors.textPrimary,
        ),
        // Helper subtext
        bodyLarge: const TextStyle(
          fontFamily: 'Arial',
          fontSize: 24,
          fontWeight: FontWeight.w400,
          height: 32 / 24,
          color: AppColors.textSecondary,
        ),
        // Info card text (you didn’t paste typography here, so I matched body sizing)
        bodyMedium: const TextStyle(
          fontFamily: 'Arial',
          fontSize: 24,
          fontWeight: FontWeight.w400,
          height: 32 / 24,
          color: AppColors.primary, // looks like your screenshot uses blue-ish text
        ),
      ),
    );
  }
}

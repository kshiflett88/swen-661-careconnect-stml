import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';

import 'package:careconnect_stml_flutter/shared/theme/app_colors.dart';

import '../../helpers/wcag_contrast.dart';

void main() {
  group('PatientDashboard - WCAG Contrast AA', () {

    test('Primary body text on white meets 4.5:1 (normal text)', () {
      expectContrastAA(
        foreground: AppColors.textPrimary,
        background: Colors.white,
        isLargeText: false,
        reason: 'Primary text must meet 4.5:1 on white',
      );
    });

    test('Secondary text on white meets 4.5:1 (normal text)', () {
      expectContrastAA(
        foreground: AppColors.textSecondary,
        background: Colors.white,
        isLargeText: false,
        reason: 'Secondary text must meet 4.5:1 on white',
      );
    });

    test('Emergency button white text on red meets AA', () {
      expectContrastAA(
        foreground: Colors.white,
        background: const Color(0xFFDC2626),
        isLargeText: false,
        reason: 'White text on emergency red must meet 4.5:1',
      );
    });

    test('Start button white text on green meets AA', () {
      expectContrastAA(
        foreground: Colors.white,
        background: const Color(0xFF15803D),
        isLargeText: false,
        reason: 'White text on start green must meet 4.5:1',
      );
    });

    test('Primary accent (non-text UI) meets 3:1 minimum', () {
      expectContrastAA(
        foreground: AppColors.primary,
        background: Colors.white,
        isLargeText: true, // using 3.0 threshold
        reason: 'Primary accent color should meet at least 3:1',
      );
    });

  });
}

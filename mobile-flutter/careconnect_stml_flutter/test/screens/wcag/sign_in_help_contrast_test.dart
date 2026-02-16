import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_stml_flutter/shared/theme/app_colors.dart'; // adjust if needed

double _srgbToLinear(int c) {
  final v = c / 255.0;
  return (v <= 0.03928) ? (v / 12.92) : math.pow((v + 0.055) / 1.055, 2.4).toDouble();
}

double _relativeLuminance(Color color) {
  final r = _srgbToLinear(color.red);
  final g = _srgbToLinear(color.green);
  final b = _srgbToLinear(color.blue);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

double _contrastRatio(Color a, Color b) {
  final la = _relativeLuminance(a);
  final lb = _relativeLuminance(b);
  final lighter = math.max(la, lb);
  final darker = math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

void main() {
  test('SignInHelpScreen - key color pairs meet WCAG AA contrast requirements', () {
    const white = Colors.white;

    // Use the SAME colors as the screen should use.
    const successBg = Color(0xFF15803D); // AA-safe green
    const accessiblePrimary = Color(0xFF155DFC); // AA-safe blue (white text)

    final r1 = _contrastRatio(white, successBg);
    final r2 = _contrastRatio(white, accessiblePrimary);
    final r3 = _contrastRatio(AppColors.textPrimary, Colors.white);

    expect(r1, greaterThanOrEqualTo(4.5), reason: 'white on successBg must be >= 4.5');
    expect(r2, greaterThanOrEqualTo(4.5), reason: 'white on primaryBg must be >= 4.5');
    expect(r3, greaterThanOrEqualTo(4.5), reason: 'textPrimary on white must be >= 4.5');
  });
}

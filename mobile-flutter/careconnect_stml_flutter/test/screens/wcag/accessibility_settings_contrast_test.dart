import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

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
  test('AccessibilitySettings - key color pairs meet WCAG AA contrast', () {
    const white = Colors.white;

    // Return button
    const primaryBg = Color(0xFF155DFC);
    expect(_contrastRatio(white, primaryBg), greaterThanOrEqualTo(4.5));

    // Toggle status pill colors set in screen
    const enabledBg = Color(0xFF15803D);
    const disabledBg = Color(0xFF6B7280);
    expect(_contrastRatio(white, enabledBg), greaterThanOrEqualTo(4.5));
    expect(_contrastRatio(white, disabledBg), greaterThanOrEqualTo(4.5));
  });
}

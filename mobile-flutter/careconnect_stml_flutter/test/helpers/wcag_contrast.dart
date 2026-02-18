import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

double _linearize(double c) {
  c = c / 255.0;
  return (c <= 0.03928) ? (c / 12.92) : math.pow((c + 0.055) / 1.055, 2.4).toDouble();
}

double relativeLuminance(Color color) {
  final r = _linearize(color.red.toDouble());
  final g = _linearize(color.green.toDouble());
  final b = _linearize(color.blue.toDouble());
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

double contrastRatio(Color fg, Color bg) {
  // If colors have alpha, blend fg onto bg to approximate final rendered color.
  final f = fg.alpha == 255 ? fg : Color.alphaBlend(fg, bg);
  final b = bg;
  final l1 = relativeLuminance(f);
  final l2 = relativeLuminance(b);
  final lighter = math.max(l1, l2);
  final darker = math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/// WCAG AA: normal text >= 4.5:1, large text >= 3.0:1
void expectContrastAA({
  required Color foreground,
  required Color background,
  required bool isLargeText,
  String? reason,
}) {
  final ratio = contrastRatio(foreground, background);
  final min = isLargeText ? 3.0 : 4.5;
  expect(
    ratio >= min,
    isTrue,
    reason: reason ??
        'Contrast ratio ${ratio.toStringAsFixed(2)}:1 is below WCAG AA minimum ${min.toStringAsFixed(1)}:1.',
  );
}

/// WCAG AA non-text contrast (SC 1.4.11): UI components / focus indicators >= 3.0:1
void expectNonTextContrastAA({
  required Color foreground,
  required Color background,
  String? reason,
}) {
  final ratio = contrastRatio(foreground, background);
  const min = 3.0;
  expect(
    ratio >= min,
    isTrue,
    reason: reason ??
        'Non-text contrast ratio ${ratio.toStringAsFixed(2)}:1 is below WCAG AA minimum ${min.toStringAsFixed(1)}:1.',
  );
}

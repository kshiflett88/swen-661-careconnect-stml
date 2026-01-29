import 'package:flutter/material.dart';

class AppTheme {
  // STML-friendly colors
  static const Color primary = Color(0xFF1E88E5); // calm blue
  static const Color secondary = Color(0xFF43A047); // success green
  static const Color danger = Color(0xFFE53935); // emergency red
  static const Color background = Color(0xFFF9FAFB);
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF212121);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: background,

    colorScheme: const ColorScheme.light(
      primary: primary,
      secondary: secondary,
      error: danger,
      surface: surface,
    ),

    appBarTheme: const AppBarTheme(
      backgroundColor: primary,
      foregroundColor: Colors.white,
      centerTitle: true,
      elevation: 0,
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(double.infinity, 56), // big touch target
        textStyle: const TextStyle(fontSize: 18),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),

    textTheme: const TextTheme(
      bodyLarge: TextStyle(fontSize: 18, color: textPrimary),
      bodyMedium: TextStyle(fontSize: 16, color: textPrimary),
      titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
    ),
  );
}

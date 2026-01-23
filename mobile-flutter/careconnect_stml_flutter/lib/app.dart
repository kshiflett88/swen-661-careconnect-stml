import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/daily_overview_screen.dart';

class CareConnectStmlApp extends StatelessWidget {
  const CareConnectStmlApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CareConnect – STML',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const DailyOverviewScreen(),
    );
  }
}

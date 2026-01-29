import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:careconnect_stml_flutter/shared/theme/app_theme.dart';
import 'package:flutter/material.dart';

class CareConnectStmlApp extends StatelessWidget {
  const CareConnectStmlApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'CareConnect – STML',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      routerConfig: createRouter(),
    );
  }
}

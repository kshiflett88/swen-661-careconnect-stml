import 'package:flutter/material.dart';
import 'dart:async';
import '../../../theme/app_colors.dart';
import '../../../widgets/orientation_header.dart';
import 'emergency_alert_sent_screen.dart';

class EmergencyCallingScreen extends StatefulWidget {
  final String caregiverName;
  final String caregiverPhone;

  const EmergencyCallingScreen({
    super.key,
    required this.caregiverName,
    required this.caregiverPhone,
  });

  @override
  State<EmergencyCallingScreen> createState() => _EmergencyCallingScreenState();
}

class _EmergencyCallingScreenState extends State<EmergencyCallingScreen> {
  int _countdown = 3;
  Timer? _timer;
  bool _cancelled = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown > 0) {
        setState(() => _countdown--);
      } else {
        _timer?.cancel();
        if (!_cancelled) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  EmergencyAlertSentScreen(caregiverName: widget.caregiverName),
            ),
          );
        }
      }
    });
  }

  void _cancelCall() {
    setState(() => _cancelled = true);
    _timer?.cancel();
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Emergency call cancelled')));
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) Navigator.popUntil(context, (route) => route.isFirst);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            const OrientationHeader(screenName: 'Calling for Help'),
                          Expanded(
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    return SingleChildScrollView(
                      padding: const EdgeInsets.all(24),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(minHeight: constraints.maxHeight),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                color: AppColors.error.withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.phone_in_talk,
                                size: 64,
                                color: AppColors.error,
                              ),
                            ),
                            const SizedBox(height: 32),
                            Text(
                              'Calling ${widget.caregiverName} now',
                              style: const TextStyle(
                                fontSize: 34,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 24),
                            if (_countdown > 0)
                              Container(
                                padding: const EdgeInsets.all(24),
                                decoration: BoxDecoration(
                                  color: AppColors.error.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Text(
                                  '$_countdown',
                                  style: TextStyle(
                                    fontSize: 48,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.error,
                                  ),
                                ),
                              ),
                            const SizedBox(height: 64),
                            if (_countdown > 0)
                              FocusTraversalGroup(
                                policy: OrderedTraversalPolicy(),
                                child: FocusTraversalOrder(
                                  order: const NumericFocusOrder(1),
                                  child: Focus(
                                    key: const Key('focus_cancel_call'),
                                    autofocus: true,
                                    child: SizedBox(
                                      width: double.infinity,
                                      height: 56,
                                      child: ElevatedButton(
                                        onPressed: _cancelCall,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: AppColors.secondary,
                                        ),
                                        child: const Text(
                                          'Cancel Call',
                                          style: TextStyle(fontSize: 18),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
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

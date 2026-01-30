import 'package:careconnect_stml_flutter/app/router.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/storage/health_log_store.dart';
import '../../data/models/health_log_entry.dart';

/// STML / accessibility-forward Health Logging screen:
/// - Large tap targets (>= 48dp), generous spacing
/// - High contrast, clear labels, minimal cognitive load
/// - Local persistence via HealthLogStore (SharedPreferences JSON)
///
/// IMPORTANT: Set your real dashboard route here:
/// - If you use named routes in go_router: set [kHomeRouteName]
/// - Otherwise set [kHomePath]
///
/// If both are set, the screen tries goNamed first, then falls back to go(path).
const String kHomeRouteName = AppRoutes.dashboard; // <-- change to your dashboard route NAME if you have one
const String kHomePath = AppRoutes.dashboard;     // <-- change to your dashboard route PATH if needed
///font sizes
const double dButtonFontSize = 28;
const double dMsgFontSize = 18;
const double dTitleFontSize = 32;
const double dCardFontSize = 30; 
const double dButtonHeight = 92;  


class HealthLoggingScreen extends StatefulWidget {
  const HealthLoggingScreen({super.key});

  @override
  State<HealthLoggingScreen> createState() => _HealthLoggingScreenState();
}

class _HealthLoggingScreenState extends State<HealthLoggingScreen> {
  final HealthLogStore _store = HealthLogStore();
  final TextEditingController _noteController = TextEditingController();

  String? _selectedMood;
  static const int _maxChars = 200;

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  String _todayLabel(DateTime dt) {
    const weekdays = [
      'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
    ];
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return 'Today: ${weekdays[dt.weekday - 1]}, \n'
        '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
  }

  void _goHome() {
    // go_router navigation (preferred)
    try {
      if (kHomeRouteName.isNotEmpty) {
        context.goNamed(kHomeRouteName);
        return;
      }
    } catch (_) {
      // ignore and try path fallback
    }
    try {
      if (kHomePath.isNotEmpty) {
        context.go(kHomePath);
        return;
      }
    } catch (_) {
      // last fallback (only works if this screen was pushed on Navigator stack)
      Navigator.popUntil(context, (route) => route.isFirst);
    }
  }

  Future<void> _showSavedDialog() async {
    // Large green confirmation with a single, clear action.
    await showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          contentPadding: const EdgeInsets.fromLTRB(20, 22, 20, 8),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.check_circle, color: Colors.green, size: 96),
              SizedBox(height: 14),
              Text(
                'Saved',
                style: TextStyle(fontSize: dButtonFontSize, fontWeight: FontWeight.w800),
              ),
              SizedBox(height: 8),
              Text(
                'Your entry has been saved.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: dMsgFontSize),
              ),
            ],
          ),
          actionsPadding: const EdgeInsets.fromLTRB(16, 6, 16, 16),
          actions: [
            SizedBox(
              height: 52,
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(dialogContext).pop(); // close dialog
                  _goHome(); // go to dashboard
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E5BFF),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  textStyle: const TextStyle(
                    fontSize: dButtonFontSize,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                child: const Text('OK'),
              ),
            ),
          ],
        );
      },
    );
  }

  Future<void> _save() async {
    if (_selectedMood == null) {
      // Gentle, clear feedback 
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please choose how you feel.')),
      );
      return;
    }

    final entry = HealthLogEntry(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      timestamp: DateTime.now(),
      type: 'mood',
      value: _selectedMood!,
      note: _noteController.text.trim().isEmpty ? null : _noteController.text.trim(),
    );

    await _store.add(entry);

    if (!mounted) return;

    // Reset form 
    setState(() {
      _selectedMood = null;
      _noteController.clear();
    });

    await _showSavedDialog();
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    // High contrast + simple palette
    const blue = AppColors.primary;
    const borderGrey = Color(0xFFD1D5DB);
    const subtleText = Color(0xFF4B5563);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                _todayLabel(now),
                style: const TextStyle(
                  fontSize: dTitleFontSize,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 14),

              // Progress / context pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  border: Border.all(color: blue, width: 2),
                  borderRadius: BorderRadius.circular(14),
                  color: blue.withAlpha(15),
                ),
                child: RichText(
                  text: const TextSpan(
                    style: TextStyle(fontSize: 22, color: AppColors.primary),
                    children: [
                      TextSpan(text: 'You are on: '),
                      TextSpan(
                        text: 'How I Feel',
                        style: TextStyle(fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Large mood cards 
              _MoodCard(
                emoji: '😊',
                label: 'Happy',
                selected: _selectedMood == 'Happy',
                onTap: () => setState(() => _selectedMood = 'Happy'),
              ),
              const SizedBox(height: 18),
              _MoodCard(
                emoji: '😐',
                label: 'Okay',
                selected: _selectedMood == 'Okay',
                onTap: () => setState(() => _selectedMood = 'Okay'),
              ),
              const SizedBox(height: 18),
              _MoodCard(
                emoji: '😢',
                label: 'Sad',
                selected: _selectedMood == 'Sad',
                onTap: () => setState(() => _selectedMood = 'Sad'),
              ),

              const SizedBox(height: 22),

              // Optional note card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border.all(color: borderGrey, width: 1.8),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x12000000),
                      blurRadius: 10,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Optional Note',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _noteController,
                      maxLength: _maxChars,
                      maxLines: 4,
                      textInputAction: TextInputAction.done,
                      decoration: InputDecoration(
                        hintText: 'You can say or write how you feel.',
                        hintStyle: const TextStyle(color: Color(0xFF9CA3AF)),
                        counterText: '',
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: borderGrey, width: 1.8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: blue, width: 2.2),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                      ),
                      onChanged: (_) => setState(() {}),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${_noteController.text.length}/$_maxChars characters',
                      style: const TextStyle(fontSize: 18, color: subtleText),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // Save button (large)
              SizedBox(
                height: dButtonHeight,
                child: ElevatedButton.icon(
                  onPressed: _save,
                  label: const Text('Save'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: blue,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    textStyle: const TextStyle(
                      fontSize: dButtonFontSize,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Return button (large)
              SizedBox(
                height: dButtonHeight,
                child: OutlinedButton.icon(
                  onPressed: _goHome,
                  label: const Text('Return to Home'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black,
                    side: const BorderSide(color: borderGrey, width: 2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    textStyle: const TextStyle(
                      fontSize: dButtonFontSize,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MoodCard extends StatelessWidget {
  final String emoji;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _MoodCard({
    required this.emoji,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF1E5BFF);
    const borderGrey = Color(0xFFD1D5DB);

    final Color borderColor = selected ? blue : borderGrey;

    return Semantics(
      button: true,
      selected: selected,
      label: 'Mood option: $label',
      hint: 'Double tap to select',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 26),
          decoration: BoxDecoration(
            border: Border.all(color: borderColor, width: 2.8),
            borderRadius: BorderRadius.circular(20),
            boxShadow: const [
              BoxShadow(
                color: Color(0x12000000),
                blurRadius: 12,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              _RadioCircle(selected: selected),
              const SizedBox(width: 18),
              Text(emoji, style: const TextStyle(fontSize: 44)),
              const SizedBox(width: 18),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    fontSize: dCardFontSize,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RadioCircle extends StatelessWidget {
  final bool selected;
  const _RadioCircle({required this.selected});

  @override
  Widget build(BuildContext context) {
    const blue = Color(0xFF1E5BFF);
    const grey = Color(0xFFCBD5E1);

    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: selected ? blue : grey,
          width: 3.6,
        ),
      ),
      child: selected
          ? Center(
              child: Container(
                width: 20,
                height: 20,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: blue,
                ),
              ),
            )
          : null,
    );
  }
}

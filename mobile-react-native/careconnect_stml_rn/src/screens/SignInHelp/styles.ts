import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingHorizontal: Spacing.padScreenX,
    paddingVertical: Spacing.padScreenY,
  },

  // Spacing helpers (match Flutter SizedBox)
  spacer10: { height: 10 },
  spacer16: { height: 16 },
  spacer20: { height: 20 },
  spacer24: { height: 24 },

  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  // Back row
  backRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  backRowSpacer: { width: 10 },
  backText: {
    ...Typography.h2,
    color: Colors.text,
    fontSize: 20,
    lineHeight: Math.round(20 * 1.35),
  },

  // Icon circle
  iconWrap: { alignItems: 'center' },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...Typography.h1,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.mutedText,
  },

  // Action buttons
  actionBase: {
    borderRadius: Spacing.radius,
    paddingHorizontal: 28,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {
    flex: 1,
    marginLeft: 18,
  },

  // Variants (match Flutter)
  actionSuccess: {
    height: 170,
    backgroundColor: Colors.success, // 0xFF16A34A
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  actionPrimary: {
    height: 170,
    backgroundColor: Colors.primary, // 0xFF1D4ED8
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  actionOutlined: {
    height: 140,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: '#D1D5DB', // outlineBorder in Flutter version
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  actionLabelFilled: {
    // Flutter: headlineMedium + weight 700 + height 1.1
    fontSize: 24,
    fontWeight: '700',
    lineHeight: Math.round(24 * 1.1),
    color: Colors.surface,
    textAlign: 'center',
  },
  actionLabelOutlined: {
    // Flutter: titleLarge + weight 700 + height 1.1
    fontSize: 20,
    fontWeight: '700',
    lineHeight: Math.round(20 * 1.1),
    color: Colors.text,
    textAlign: 'center',
  },
});

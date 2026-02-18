import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },

  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  spacer6: { height: 6 },
  spacer8: { height: 8 },
  spacer10: { height: 10 },
  spacer12: { height: 12 },
  spacer14: { height: 14 },
  spacer16: { height: 16 },
  spacer18: { height: 18 },

  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  topRowLeft: { flex: 1 },

  dateText: {
    ...Typography.h2,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 32,
    fontSize: 32,
  },

  circleIconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#F2F6FF',
  },
  locationText: {
    ...Typography.body,
    color: Colors.primary,
    lineHeight: Math.round(16 * 1.2),
  },
  locationTextBold: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '800',
  },

  divider: { height: 4, backgroundColor: Colors.primary },

  cardButton: {
    borderRadius: Spacing.radius,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: '#CAD5E2',
    // shadow-ish
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    justifyContent: 'center',
  },
  cardButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  feelingInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  feelingTitle: {
    ...Typography.h2,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.text,
    lineHeight: Math.round(20 * 1.1),
    fontSize: 20,
  },
  emojiRow: { fontSize: 22 },

  nextTaskWrap: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  nextTaskLoading: { padding: 18, alignItems: 'center', justifyContent: 'center' },
  nextTaskError: { padding: 16 },
  errorText: { color: '#DC2626' },

  nextTaskCard: { padding: 18 },
  nextTaskLabel: {
    ...Typography.body,
    color: Colors.mutedText,
    fontWeight: '600',
  },
  nextTaskTitle: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: Math.round(26 * 1.05),
    color: Colors.text,
  },
  nextTaskTime: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  noTasksText: { fontSize: 18, color: Colors.mutedText, textAlign: 'center' },

  startButton: {
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  startButtonText: { fontSize: 20, fontWeight: '900', color: Colors.surface },

  cardButtonText: {
    ...Typography.h2,
    fontWeight: '900',
    color: Colors.text,
    fontSize: 20,
    lineHeight: Math.round(20 * 1.35),
  },

  emergencyButton: {
    height: 78,
    borderRadius: 14,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  emergencyButtonText: { fontSize: 20, fontWeight: '900', color: Colors.surface },
});

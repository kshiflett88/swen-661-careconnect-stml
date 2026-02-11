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

  logoWrap: { alignItems: 'center' },
  logoCircle: {
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

  infoCard: {
    height: 116,
    paddingHorizontal: 26,
    borderRadius: Spacing.radius,
    backgroundColor: '#F2F6FF', // you had this in the screen; keep or make token later
    borderWidth: 2,
    borderColor: '#BFD3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    ...Typography.body,
    textAlign: 'center',
  },

  primaryButton: {
    height: 240,
    borderRadius: Spacing.radius,
    backgroundColor: Colors.primary,
    padding: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  primaryInner: { alignItems: 'center', justifyContent: 'center' },
  primaryLabel: {
    ...Typography.h2,
    color: Colors.surface,
    textAlign: 'center',
    fontSize: 24, // keep it big like Flutter headlineMedium
    lineHeight: Math.round(24 * 1.3),
  },
    primaryIcon: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },


  subtitle: {
    ...Typography.bodyMuted,
    textAlign: 'center',
  },

  secondaryButton: {
    height: 140,
    borderRadius: Spacing.radius,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    padding: 34,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  secondaryRow: { flexDirection: 'row', alignItems: 'center' },
  secondaryTextWrap: { flex: 1, marginLeft: 24 },
  secondaryLabel: {
    ...Typography.h2,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: Math.round(20 * 1.35),
  },

  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  spacer12: { height: 12 },
  spacer16: { height: 16 },
  spacer20: { height: 20 },
});

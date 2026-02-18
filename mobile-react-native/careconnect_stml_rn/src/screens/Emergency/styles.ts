import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';


const redSoft = '#FEF2F2';
const yellowSoft = '#FEF9C3';
const borderGrey = '#CAD5E2';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface ?? '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // spacing helpers
  spacer8: { height: 8 },
  spacer14: { height: 14 },
  spacer16: { height: 16 },
  spacer18: { height: 18 },

  todayText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 36,
  },

  onCard: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: redSoft,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.danger,
  },
  onLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.danger,
  },
  onValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.danger,
  },

  redDivider: {
    height: 3,
    backgroundColor: Colors.danger,
  },

  warningCard: {
    padding: 18,
    backgroundColor: yellowSoft,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  warningText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    color: '#000000',
  },

  sosButton: {
    height: 260,
    backgroundColor: Colors.danger,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow (iOS) + elevation (Android)
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  sosInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    fontSize: 86,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    lineHeight: 92,
  },
  sosSubText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
  },

  cancelButton: {
    height: 92,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: borderGrey,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cancelText: {
    // if you have typography.titleLarge, use it; otherwise keep this
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text ?? '#0F172A',
  },

  pressed: {
    opacity: 0.85,
  },
});

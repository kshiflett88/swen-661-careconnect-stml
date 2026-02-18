import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  // quick internal color handle (optional)
  __colors: {
    primary: Colors.primary ?? '#1D4ED8',
  } as any,

  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // spacing helpers
  spacer6: { height: 6 },
  spacer12: { height: 12 },
  spacer14: { height: 14 },
  spacer16: { height: 16 },
  spacer18: { height: 18 },

  todayText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text ?? '#0F172A',
    lineHeight: 24,
  },

  locationCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary ?? '#1D4ED8',
    backgroundColor: Colors.background ?? '#E6F0FF',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary ?? '#1D4ED8',
    lineHeight: 20,
  },
  locationTextBold: {
    fontWeight: '800',
    color: Colors.primary ?? '#1D4ED8',
  },

  divider: {
    height: 4,
    backgroundColor: Colors.primary ?? '#1D4ED8',
  },

  card: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text ?? '#0F172A',
  },

  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.background ?? '#E6F0FF',
    borderWidth: 3,
    borderColor: Colors.primary ?? '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  labelCenter: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mutedText ?? '#475569',
  },
  userName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text ?? '#0F172A',
    lineHeight: 28,
  },

  infoBlock: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 12,
    backgroundColor: Colors.background ?? '#E6F0FF',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  whiteBlock: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  blockLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mutedText ?? '#475569',
  },
  blockValue: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text ?? '#0F172A',
  },
  blockValueBold: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text ?? '#0F172A',
  },
  emailValue: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text ?? '#0F172A',
  },

  accessibilityButton: {
    height: 92,
    borderRadius: 14,
    backgroundColor: Colors.primary ?? '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  accessibilityButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  backButton: {
    height: 92,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text ?? '#0F172A',
  },

  signOutButton: {
    height: 92,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CAD5E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  signOutText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626', // red text only
  },

  pressed: {
    opacity: 0.85,
  },
});

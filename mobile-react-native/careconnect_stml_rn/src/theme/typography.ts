import type { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography: Record<'h1' | 'h2' | 'body' | 'bodyMuted' | 'step', TextStyle> = {
  h1: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: Math.round(24 * 1.3), // ~31
    color: Colors.text,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: Math.round(18 * 1.35), // ~24
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: Math.round(16 * 1.5), // 24
    color: Colors.text,
  },
  bodyMuted: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: Math.round(16 * 1.5),
    color: Colors.mutedText,
  },
  step: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: Math.round(16 * 1.5),
    color: Colors.primary,
  },
};

import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    paddingHorizontal: 18,
    paddingTop: 0,
  },

  dateText: {
      ...Typography.h2,
      color: Colors.text,
      fontWeight: '600',
      fontSize: 32,
      lineHeight: 32,
    },

  dateSubText: {
    fontSize: 30,
    fontWeight: "500",
    marginBottom: 15,
  },
  pill: {
    borderWidth: 2,
    borderColor: "#2D5BFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    marginBottom: 50,
    backgroundColor: "rgba(45, 91, 255, 0.1)",
  },
  pillText: { fontSize: 24, color: "#2D5BFF" },
  pillBold: { fontWeight: "700" },

  section: { gap: 14, marginBottom: 14 },

  moodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal:6,
    borderWidth: 2,
    borderColor: "#E6E6E6",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  moodCardActive: {
    borderColor: "#2D5BFF",
  },

  radioOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 40,
  },
  radioOuterActive: {
    borderColor: "#2D5BFF",
  },
  radioInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2D5BFF",
  },

  emoji: { fontSize: 72, marginRight: 16 },
  moodLabel: { fontSize: 36, fontWeight: "700", color: "#1C1C1C" },

  noteCard: {
    borderWidth: 2,
    borderColor: "#E6E6E6",
    borderRadius: 14,
    padding: 14,
    marginBottom: 32,
    marginTop: 16,
  },
  noteTitle: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  noteInputWrap: {
    borderWidth: 2,
    borderColor: "#E6E6E6",
    borderRadius: 12,
    padding: 10,
    minHeight: 120,
    backgroundColor: "#FFFFFF",
  },
  noteInput: {
    fontSize: 32,
    minHeight: 160,
    color: "#1C1C1C",
  },
  counter: {
    marginTop: 8,
    fontSize: 20,
    color: Colors.mutedText,
  },

  primaryButton: {
    backgroundColor: "#2D5BFF",
    borderRadius: 14,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 30, fontWeight: "800" },

  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E6E6E6",
  },
  secondaryButtonText: { color: "#1C1C1C", fontSize: 30, fontWeight: "800" },
  
  savedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    zIndex: 999,
  },
  savedCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E6E6E6",
  },
  savedTitle: {
    marginTop: 18,
    fontSize: 36,      // <-- make it bigger here
    fontWeight: "900", // <-- bolder here
    color: "#111",
    // fontFamily: "YourCustomFontName", // (optional, see note below)
  },
  savedSubtitle: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
    color: "#444",
  },
  okButton: {
    marginTop: 26,
    width: "80%",
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: "#2D5BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  okButtonText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    // fontFamily: "YourCustomFontName",
  },
  errorTitle: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "900",
    color: "#B71C1C",
    textAlign: "center",
  },
  errorSubtitle: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
    color: "#444",
  },
});

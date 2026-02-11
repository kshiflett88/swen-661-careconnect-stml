import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  EmergencyScreen: undefined;
  EmergencyConfirmationScreen: undefined;
  Dashboard: undefined; // adjust if your route is named differently
};

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function todayLabel(dt: Date) {
  // JS: Sunday=0..Saturday=6
  const jsDay = dt.getDay();
  const weekdayIdx = jsDay === 0 ? 6 : jsDay - 1; // Monday=0..Sunday=6
  const weekday = weekdays[weekdayIdx];

  const month = months[dt.getMonth()];
  const day = dt.getDate();
  const year = dt.getFullYear();

  // EXACT line breaks to match Flutter:
  // 'Today: <weekday>,\n<month> <day>, <year>'
  return `Today: ${weekday},\n${month} ${day}, ${year}`;
}

// Flutter colors mirrored exactly
const red = "#DC2626";
const redSoft = "#FEF2F2";
const yellow = "#EAB308";
const yellowSoft = "#FEF9C3";
const borderGrey = "#CAD5E2"; // Flutter uses 0xFFCAD5E2 for the button border
// AppColors.textPrimary in Flutter: not provided here; using black to match common usage
const textPrimary = "#000000";

export default function EmergencyScreen({ navigation }: any) {
  const now = new Date();
  const { height: windowHeight } = useWindowDimensions();

const [showConfirm, setShowConfirm] = useState(false);
  const [showSent, setShowSent] = useState(false);

  const openConfirm = () => setShowConfirm(true);
  const cancelConfirm = () => setShowConfirm(false);

  const sendAlert = async () => {
    // TODO: integrate actual caregiver alert + start call
    setShowConfirm(false);
    setShowSent(true);
  };

  const closeSent = () => {
    setShowSent(false);
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.scaffold}>
      <View style={styles.safeArea}>
        {/* Confirm popup (HealthLog-style overlay) */}
        {showConfirm && (
          <View style={styles.overlay}>
            <View style={styles.overlayCard}>
              <Ionicons name="warning" size={140} color={red} />

              <Text style={styles.overlayTitle}>Send Emergency Alert?</Text>

              <Text style={styles.overlaySubtitle}>
                {"This will send an alert to\nyour caregiver and start\na call"}
              </Text>

              <TouchableOpacity
                style={[styles.overlayButton, styles.dangerButton]}
                activeOpacity={0.9}
                onPress={sendAlert}
                testID="confirm_send_alert"
              >
                <Text style={styles.overlayButtonText}>Yes, Send Alert</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.overlayButton, styles.cancelButton]}
                activeOpacity={0.9}
                onPress={cancelConfirm}
                testID="confirm_cancel"
              >
                <Text style={styles.overlayButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Alert Sent popup (HealthLog-style overlay) */}
        {showSent && (
          <View style={styles.overlay}>
            <View style={styles.overlayCard}>
              <Ionicons name="checkmark-circle" size={150} color="#16A34A" />

              <Text style={styles.overlayTitle}>Alert Sent!</Text>

              <Text style={styles.overlaySubtitle}>
                Your caregiver has been notified.
              </Text>

              <TouchableOpacity
                style={styles.overlayButton}
                activeOpacity={0.9}
                onPress={closeSent}
                testID="alert_sent_ok"
              >
                <Text style={styles.overlayButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: windowHeight },
          ]}
        >
          {/* Today header */}
          <Text style={styles.todayHeader}>{todayLabel(now)}</Text>

          <View style={{ height: 14 }} />

          {/* "You are on" card (red) */}
          <View style={styles.onCard}>
            <Text style={styles.onLabel}>You are on: <Text style={styles.onTitle}>Emergency Help</Text></Text>
          </View>

          <View style={{ height: 16 }} />

          {/* red divider line */}
          <View style={styles.redDivider} />
          <View style={{ height: 18 }} />

          {/* Yellow warning card */}
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              {"This will send an alert to\nyour caregiver and start\na call"}
            </Text>
          </View>

          <View style={{ height: 18 }} />

          {/* SOS button (big red block) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="SOS"
            testID="sos_button"
            onPress={openConfirm}
            style={({ pressed }) => [
              styles.sosButton,
              pressed && { opacity: 0.95 },
            ]}
          >
            <View style={styles.sosButtonInner}>
              <Text style={styles.sosText}>SOS</Text>
              <View style={{ height: 8 }} />
              <Text style={styles.sosSubText}>Press to Call for Help</Text>
            </View>
          </Pressable>

          <View style={{ height: 18 }} />

          {/* Cancel button (outlined card) */}
          <CardButton
            testID="cancel_button"
            height={92}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </CardButton>

          <View style={{ height: 14 }} />
        </ScrollView>
      </View>
    </View>
  );
}

function CardButton({
  height,
  children,
  onPress,
  testID,
}: {
  height: number;
  children: React.ReactNode;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <View style={{ height }}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardButton,
          pressed && { opacity: 0.95 },
        ]}
      >
        <View style={styles.cardButtonCenter}>{children}</View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scaffold: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Today header (fontSize 32, w600, black)
  todayHeader: {
    fontSize: 32,
    fontWeight: "600",
    color: "#000000",
  },

  // You are on card
  onCard: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: redSoft,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: red,
  },
  onLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: red,
  },
  onTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: red,
  },

  // Divider
  redDivider: {
    height: 3,
    backgroundColor: red,
  },

  // Yellow warning card
  warningCard: {
    padding: 18,
    backgroundColor: yellowSoft,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: yellow,
  },
  warningText: {
    textAlign: "center",
    fontSize: 22,
    lineHeight: 22 * 1.25,
    fontWeight: "700",
    color: "#000000",
  },

  // SOS button (height 260, radius 18, elevation-ish)
  sosButton: {
    height: 260,
    backgroundColor: red,
    borderRadius: 18,
    // Flutter elevation: 2 → approximate with shadow
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sosButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    fontSize: 86,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 6,
  },
  sosSubText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // Cancel CardButton styles (OutlinedButton look)
  cardButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: borderGrey,
    // Flutter elevation: 4 shadowColor black12
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardButtonCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 22, // close to Flutter t.titleLarge
    fontWeight: "900",
    color: textPrimary,
  },

   /* Overlay popup (HealthLog-style) */
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  overlayCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 20,
    alignItems: "center",
  },
  overlayTitle: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },
  overlaySubtitle: {
    marginTop: 8,
    fontSize: 18,
    textAlign: "center",
    color: "#444",
  },
  overlayButton: {
    marginTop: 18,
    width: "100%",
    height: 64,
    borderRadius: 18,
    backgroundColor: "#1E5BFF", // or set to your theme blue
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonText: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },

  dangerButton: { backgroundColor: red },
  cancelButton: { backgroundColor: "#37474F", marginTop: 12 },
});

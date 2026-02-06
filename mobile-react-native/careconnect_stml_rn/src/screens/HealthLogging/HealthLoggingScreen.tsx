import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routes } from "../../navigation/routes"; 
import { Ionicons } from "@expo/vector-icons";


type MoodKey = "happy" | "okay" | "sad";

type FeelEntry = {
  dateISO: string;          // e.g., "2026-01-26"
  mood: MoodKey | null;
  note: string;
  savedAtISO: string;       // timestamp
};

const STORAGE_KEY = "careconnect.how_i_feel.today";

const MOODS: Array<{ key: MoodKey; label: string; emoji: string }> = [
  { key: "happy", label: "Happy", emoji: "😊" },
  { key: "okay", label: "Okay", emoji: "😐" },
  { key: "sad", label: "Sad", emoji: "😢" },
];

function formatWeekday(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(d);
  } catch {
    return d.toDateString().split(" ")[0];
  }
}

function formatMonthDayYear(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toDateString();
  }
}

function formatLongDate(d: Date) {
  try {
    // Monday, January 26, 2026
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    // Basic fallback
    return d.toDateString();
  }
}

function todayISO(d = new Date()) {
  // local date -> YYYY-MM-DD
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${da}`;
}

export default function HowIFeelTodayScreen({ navigation }: any) {
  const today = useMemo(() => new Date(), []);
  const todayLabel = useMemo(() => formatLongDate(today), [today]);
  const dateISO = useMemo(() => todayISO(today), [today]);

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const noteMax = 200;

  // Load saved state (if any) for today
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed: FeelEntry = JSON.parse(raw);
        // Only restore if it's for today (so it behaves like "How I feel today")
        if (parsed?.dateISO === dateISO) {
          setSelectedMood(parsed.mood ?? null);
          setNote(parsed.note ?? "");
        }
      } catch {
        // ignore (we can optionally log)
      }
    })();
  }, [dateISO]);

  const onChangeNote = (t: string) => {
    // hard limit to 200 chars, matches screenshot behavior
    if (t.length <= noteMax) setNote(t);
    else setNote(t.slice(0, noteMax));
  };

  const save = async () => {
    if (!selectedMood) {
      setErrorMessage("Select a mood \n" + "Please choose how you feel (Happy, Okay, or Sad).");
      setShowError(true);
      return;
    }

    setIsSaving(true);
    try {
      const payload: FeelEntry = {
        dateISO,
        mood: selectedMood,
        note: note.trim(),
        savedAtISO: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setShowSaved(true);
    } catch (e: any) {
      setErrorMessage("Save failed \n" + "Could not save. Please try again.");
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {showError && (
        <View style={styles.savedOverlay}>
          <View style={styles.savedCard}>
            <Ionicons
              name="alert-circle"
              size={140}
              color="#E53935"
              accessibilityRole="image"
              accessibilityLabel="Error"
            />

            <Text style={styles.errorTitle}>Something went wrong</Text>

            <Text style={styles.errorSubtitle}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.okButton}
              onPress={() => {
                setShowError(false);
                // optional: navigation.navigate(Routes.Dashboard);
              }}
              accessibilityRole="button"
              accessibilityLabel="OK"
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showSaved && ( <View style={styles.savedOverlay}>
          <View style={styles.savedCard}>
            <Ionicons
              name="checkmark-circle"
              size={150}
              color="#2ECC71"
              accessibilityRole="image"
              accessibilityLabel="Saved successfully"
            />

            <Text style={styles.savedTitle}>Saved!</Text>
            <Text style={styles.savedSubtitle}>
              Your feeling for today has been saved.
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.okButton}
              onPress={() => {
                setShowSaved(false);
                navigation.navigate(Routes.Dashboard);
              }}
              accessibilityRole="button"
              accessibilityLabel="OK, return to dashboard"
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.todayText}>
          Today: {formatWeekday(today)}
        </Text>

        <Text style={styles.dateSubText}>
          {formatMonthDayYear(today)}
        </Text>

        {/* Pill */}
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            You are on: <Text style={styles.pillBold}>How I Feel</Text>
          </Text>
        </View>

        {/* Mood cards */}
        <View style={styles.section}>
          {MOODS.map((m) => {
            const active = selectedMood === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                activeOpacity={0.85}
                onPress={() => setSelectedMood(m.key)}
                style={[styles.moodCard, active && styles.moodCardActive]}
                accessibilityRole="button"
                accessibilityLabel={`Select mood: ${m.label}`}
              >
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioInner} /> : null}
                </View>

                <Text style={styles.emoji} accessibilityLabel={`${m.label} emoji`}>
                  {m.emoji}
                </Text>

                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Optional note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Optional Note</Text>

          <View style={styles.noteInputWrap}>
            <TextInput
              value={note}
              onChangeText={onChangeNote}
              placeholder="You can say or write how you feel"
              placeholderTextColor="#7A7A7A"
              style={styles.noteInput}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Optional note"
            />
          </View>

          <Text style={styles.counter}>
            {note.length}/{noteMax} characters
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={save}
          disabled={isSaving}
          style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Save"
        >
          <Text style={styles.primaryButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate(Routes.Dashboard)}
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Return to Home"
        >
          <Text style={styles.secondaryButtonText}>Return to Home</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    paddingHorizontal: 18,
    paddingTop: 0,
  },

  todayText: {
    fontSize: 30,
    fontWeight: "500",
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
    color: "#6B6B6B",
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

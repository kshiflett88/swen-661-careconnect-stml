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
import { styles } from './styles';


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

function todayLabel(dt: Date) {
  const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // JS: Sunday=0, Flutter: Monday=1. We’ll map to your Flutter output style.
  const weekdayIndex = (dt.getDay() + 6) % 7; // Monday=0 ... Sunday=6
  return `Today: ${weekdays[weekdayIndex]}, \n${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
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
    <SafeAreaView  style={styles.safe} edges={["top", "left", "right"]}>
      {showError && (
        <View 
          style={styles.savedOverlay}
          accessible
          accessibilityViewIsModal
          importantForAccessibility="yes"
        >
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
      {showSaved && ( 
        <View 
          style={styles.savedOverlay}
          accessible
          accessibilityViewIsModal
          importantForAccessibility="yes"
        >
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

      <ScrollView 
        importantForAccessibility={showSaved || showError ? "no-hide-descendants" : "auto"}
        contentContainerStyle={styles.container }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.dateText} accessibilityRole="header">
          {todayLabel(new Date()).replace('\n', '')}
        </Text>

        {/* Pill */}
        <View 
          style={styles.pill}
          accessibilityRole="text"
          accessibilityLabel={`You are on: How I Feel`}
        >
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
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${m.label}`}
                accessibilityHint="Double tap to select this mood"
              >
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioInner} /> : null}
                </View>

                <Text style={styles.emoji} accessible={false}>
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
              accessibilityHint="Enter up to 200 characters"
            />
          </View>

          <Text style={styles.counter} accessibilityLiveRegion="polite">
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
          testID="return_home_button"
          activeOpacity={0.9}
          onPress={() => navigation.navigate(Routes.Dashboard)}
          style={styles.secondaryButton}
          accessible
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

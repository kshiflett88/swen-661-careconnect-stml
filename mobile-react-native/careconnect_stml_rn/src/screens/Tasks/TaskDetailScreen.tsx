import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Routes } from "../../navigation/routes"; // adjust if needed
import { mockTasks, Task } from "../../shared/mocks/mockTasks";
import { getCompletedAt, setCompletedAt } from "../../shared/storage/taskStatusStore";
import { TASK_IMAGES } from "../../shared/assets/taskImages";

type RouteParams = { id: string };

function todayLabel2Lines(d: Date) {
  const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const weekday = weekdays[d.getDay()];
  const month = months[d.getMonth()];
  return `Today: ${weekday}, \n${month} ${d.getDate()}, ${d.getFullYear()}`;
}

function getSteps(task: Task): string[] {
  const steps = task.steps;
  if (Array.isArray(steps) && steps.length > 0) return steps;

  const d = (task.description ?? "").trim();
  if (d) {
    return [
      "Step 1: Get what you need",
      "Step 2: Do the action",
      "Step 3: Double-check you finished",
      "Step 4: Mark done",
    ];
  }
  return ["Do the task", "Mark done"];
}

function cleanStepText(s: string) {
  const raw = (s ?? "").trim();
  const idx = raw.indexOf(":");
  if (raw.toLowerCase().startsWith("step") && idx !== -1 && idx < 10) {
    return raw.substring(idx + 1).trim();
  }
  return raw;
}

export default function TaskDetailScreen({ navigation, route }: any) {
  const { id } = (route?.params ?? {}) as RouteParams;

  const task = useMemo(() => {
    return (
      mockTasks.find((t) => t.id === id) ?? {
        id,
        title: "Task not found",
        description: "No mock task matches this id.",
      }
    );
  }, [id]);

  const steps = useMemo(() => getSteps(task), [task]);
  const [stepIndex, setStepIndex] = useState(0);
  const [completedAtISO, setCompletedAtISO] = useState<string | null>(null);

  // In-page "Done" overlay (like your Saved overlay)
  const [showDoneOverlay, setShowDoneOverlay] = useState(false);

  const isDone = !!completedAtISO;
  const showNextWhenDone = isDone && stepIndex < steps.length - 1;

  const stepTitle = `Step ${stepIndex + 1}`;
  const stepOf = `Step ${stepIndex + 1} of ${steps.length}`;
  const progress = steps.length ? (stepIndex + 1) / steps.length : 0;
  const stepText = cleanStepText(steps[stepIndex] ?? "") || (task.description ?? "");

  useEffect(() => {
    (async () => {
      const completed = await getCompletedAt(task.id);
      setCompletedAtISO(completed);
    })();
  }, [task.id]);

  const goTasks = () => navigation.navigate(Routes.TaskList);

  const markDone = async () => {
    const nowISO = new Date().toISOString();
    await setCompletedAt(task.id, nowISO);
    setCompletedAtISO(nowISO);
    setShowDoneOverlay(true);
  };

  const nextNormal = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else markDone();
  };

  const nextWhenDone = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    // last step: button disappears (handled by showNextWhenDone)
  };

  const imageKey =
  task.imageKey ??
  (() => {
    const t = `${task.title} ${task.description ?? ""}`.toLowerCase();
    if (t.includes("medication") || t.includes("pill") || t.includes("medicine")) return "medication";
    if (t.includes("meal") || t.includes("breakfast") || t.includes("lunch") || t.includes("dinner")) return "meal";
    if (t.includes("walk") || t.includes("exercise") || t.includes("therapy") || t.includes("physical")) return "exercise";
    if (t.includes("water") || t.includes("drink")) return "water";
    return null;
  })();

const imageSource = imageKey ? TASK_IMAGES[imageKey] : null;

  return (
    <SafeAreaView testID="task_detail_screen" style={styles.safe} edges={["left", "right", "bottom"]}>
      {/* Done overlay (equivalent to Flutter dialog) */}
      {showDoneOverlay && (
        <Modal
          visible={showDoneOverlay}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDoneOverlay(false)}
          accessibilityViewIsModal
        >
          <View style={styles.overlay} testID="task_done_overlay">
            <View
              style={styles.overlayCard}
              accessible
              accessibilityLabel="Task completed"
            >
              <Ionicons
                name="checkmark-circle"
                size={140}
                color="#16A34A"
                accessibilityRole="image"
                accessibilityLabel="Done"
              />

              <Text style={styles.overlayTitle}>Done</Text>
              <Text style={styles.overlaySubtitle}>Task marked as complete.</Text>

              <TouchableOpacity
                testID="task_done_ok_button"
                style={styles.overlayButton}
                activeOpacity={0.9}
                onPress={() => {
                  setShowDoneOverlay(false);
                  goTasks();
                }}
                accessibilityRole="button"
                accessibilityLabel="Return to tasks"
                accessibilityHint="Closes this message and returns to the task list"
              >
                <Text style={styles.overlayButtonText}>Return to Tasks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <View importantForAccessibility={showDoneOverlay ? "no-hide-descendants" : "auto"}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Today */}
          <Text style={styles.todayTop} accessibilityRole="header">
            {todayLabel2Lines(new Date()).replace('\n', '')}
          </Text>

          {/* You are on pill */}
          <View
            style={styles.pill}
            accessible
            accessibilityRole="text"
            accessibilityLabel="You are on: Task Step"
          >
            <Text style={styles.pillText}>
              You are on: <Text style={styles.pillBold}>Task Step</Text>
            </Text>
          </View>

          {/* Task title */}
          <Text style={styles.taskTitle}>{task.title}</Text>

          {/* Step progress card */}
          <View 
            style={styles.progressCard}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Progress: step ${stepIndex + 1} of ${steps.length}`}
            accessibilityValue={{
              min: 0,
              max: steps.length,
              now: stepIndex + 1,
              text: `${stepIndex + 1} of ${steps.length}`,
            }}
          >
            <Text style={styles.stepOf}>{stepOf}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Main step card */}
          <View
            style={styles.stepCard}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${stepTitle}. ${stepText}. ${isDone ? "Completed." : ""}`}
          >
            <View style={styles.imageWrap}>
              {imageSource ? (
                <Image 
                  source={imageSource}
                  style={styles.image}
                  resizeMode="cover" 
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={`Image representing: ${task.title}`}
                />
              ) : (
                <View 
                  style={styles.imagePlaceholder}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel="No image available"  
                >
                  <Ionicons name="image-outline" size={44} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View style={styles.stepContent}>
              {/* Step label */}
              <View style={styles.stepLabelPill}>
                <Text
                  style={styles.stepLabelText}
                  accessibilityRole="header"
                >
                  {stepTitle}
                </Text>
              </View>

              {/* Completed badge */}
              {isDone && (
                <View style={styles.completedBadge}  accessible accessibilityLabel="Completed">
                  <Ionicons 
                    name="checkmark-circle"
                    size={22}
                    color="#16A34A"
                    accessible={false}
                    importantForAccessibility="no"
                  />
                  <Text style={styles.completedBadgeText}>Completed</Text>
                </View>
              )}

              {/* Step text */}
              <Text style={styles.stepText}>{stepText}</Text>

              {isDone && <Text style={styles.stepCompleteHint}>This step is complete.</Text>}
            </View>
          </View>

          {/* Primary CTA logic */}
          {(!isDone || showNextWhenDone) && (
            <TouchableOpacity
              testID="task_primary_cta"
              style={styles.primaryBtn}
              activeOpacity={0.9}
              onPress={isDone ? nextWhenDone : nextNormal}
              accessibilityRole="button"
              accessibilityLabel={
                isDone
                  ? "Next step"
                  : stepIndex < steps.length - 1
                  ? "Next step"
                  : "Mark task done"
              }
              accessibilityHint={
                isDone
                  ? "Moves to the next step"
                  : stepIndex < steps.length - 1
                  ? "Moves to the next step"
                  : "Marks this task as complete"
              }
            >
              <Text style={styles.primaryBtnText}>
                {isDone ? "Next" : stepIndex < steps.length - 1 ? "Next Step" : "Mark Done"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Return to Tasks */}
          <TouchableOpacity 
            testID="task_return_tasks"
            style={styles.secondaryBtn}
            activeOpacity={0.9}
            onPress={goTasks}
            accessibilityRole="button"
            accessibilityLabel="Return to tasks"
            accessibilityHint="Goes back to the task list"
          >
            <Text style={styles.secondaryBtnText}>Return to Tasks</Text>
          </TouchableOpacity>

          <View style={{ height: 16 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#1E5BFF";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { paddingHorizontal: 20, paddingVertical: 16 },

  todayTop: { fontSize: 32, fontWeight: "600", color: "#111827" },
  todayBottom: { fontSize: 32, fontWeight: "600", color: "#111827", marginBottom: 14 },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 14,
    backgroundColor: "rgba(30,91,255,0.06)",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  pillText: { fontSize: 22, color: BLUE },
  pillBold: { fontWeight: "800" },

  taskTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },

  progressCard: {
    borderWidth: 1.8,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  stepOf: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 12 },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: BLUE },

  divider: { height: 3, backgroundColor: BLUE, marginBottom: 18 },

  stepCard: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: BLUE,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 18,
  },

  imageWrap: { width: "100%" },
  image: { width: "100%", height: 220 },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  stepContent: { paddingHorizontal: 18, paddingVertical: 18 },

  stepLabelPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
    marginBottom: 14,
  },
  stepLabelText: { fontSize: 24, fontWeight: "600", color: "#1E3A8A" },

  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7",
    marginBottom: 12,
  },
  completedBadgeText: { fontSize: 18, fontWeight: "900", color: "#16A34A" },

  stepText: {
    fontSize: 32,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 40,
  },
  stepCompleteHint: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
  },

  primaryBtn: {
    height: 92,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 32, fontWeight: "900" },

  secondaryBtn: {
    height: 92,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { fontSize: 32, fontWeight: "900", color: "#111" },

  /* Overlay (Done dialog equivalent) */
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
  overlayTitle: { marginTop: 16, fontSize: 26, fontWeight: "800", color: "#111" },
  overlaySubtitle: { marginTop: 8, fontSize: 18, textAlign: "center", color: "#444" },
  overlayButton: {
    marginTop: 18,
    width: "100%",
    height: 64,
    borderRadius: 18,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonText: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
});

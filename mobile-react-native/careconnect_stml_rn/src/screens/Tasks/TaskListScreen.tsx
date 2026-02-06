import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routes } from "../../navigation/routes"; // adjust if your path differs
import { mockTasks, Task } from "../../shared/mocks/mockTasks";
import { clearAllTasks, getCompletedAt } from "../../shared/storage/taskStatusStore";

type CompletedMap = Record<string, string | null>;

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

function formatTime(d?: Date) {
  if (!d) return "";
  let hour = d.getHours();
  const minute = d.getMinutes();
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const mm = String(minute).padStart(2, "0");
  return `${hour}:${mm} ${suffix}`;
}

export default function TaskListScreen({ navigation }: any) {
  const [completedAt, setCompletedAtState] = useState<CompletedMap>({});
  const [refreshing, setRefreshing] = useState(false);

  const tasks = useMemo(() => {
    const sorted = [...mockTasks].sort((a, b) => {
      const at = a.scheduledAt?.getTime();
      const bt = b.scheduledAt?.getTime();
      if (at == null && bt == null) return 0;
      if (at == null) return 1;
      if (bt == null) return -1;
      return at - bt;
    });
    return sorted;
  }, []);

  const loadStatuses = useCallback(async () => {
    const map: CompletedMap = {};
    for (const t of tasks) {
      map[t.id] = await getCompletedAt(t.id);
    }
    setCompletedAtState(map);
  }, [tasks]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadStatuses();
    } finally {
      setRefreshing(false);
    }
  }, [loadStatuses]);

  const goHome = () => navigation.navigate(Routes.Dashboard);

  const goTaskDetail = (task: Task) => {
    // If your TaskDetail expects an id, pass it here
    navigation.navigate(Routes.TaskDetail, { id: task.id });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Today */}
        <Text style={styles.todayText}>{todayLabel2Lines(new Date())}</Text>

        {/* Progress pill: You are on: Tasks */}
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            You are on: <Text style={styles.pillBold}>Tasks</Text>
          </Text>
        </View>

        {/* Divider line (blue) */}
        <View style={styles.divider} />

        {/* Task cards */}
        {tasks.map((task) => {
          const isDone = !!completedAt[task.id];
          return (
            <View key={task.id} style={{ marginBottom: 18 }}>
              <TaskCard
                title={task.title}
                timeLabel={formatTime(task.scheduledAt)}
                isDone={isDone}
                onStart={() => goTaskDetail(task)}
                onView={() => goTaskDetail(task)}
              />
            </View>
          );
        })}

        {/* Return to Home */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Return to Home"
          style={styles.returnHome}
          onPress={goHome}
        >
          <Text style={styles.returnHomeText}>Return to Home</Text>
        </TouchableOpacity>

        {/* Dev reset button (optional, mirrors Flutter) */}
        <TouchableOpacity
          style={styles.devReset}
          onPress={async () => {
            await clearAllTasks(tasks.map((t) => t.id));
            await loadStatuses();
          }}
        >
          <Text style={styles.devResetText}>Reset Tasks (Dev)</Text>
        </TouchableOpacity>

        <View style={{ height: 12 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskCard({
  title,
  timeLabel,
  isDone,
  onStart,
  onView,
}: {
  title: string;
  timeLabel: string;
  isDone: boolean;
  onStart: () => void;
  onView: () => void;
}) {
  const borderColor = isDone ? "#16A34A" : "#D1D5DB";
  const statusText = isDone ? "Done ✓" : "Not Started";

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Task card: ${title}. ${isDone ? "Done" : "Not started"} at ${timeLabel}.`}
      style={[styles.card, { borderColor }]}
    >
      <View style={styles.rowTop}>
        <StatusIcon isDone={isDone} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardTime}>{timeLabel}</Text>
        </View>
      </View>

      <View style={styles.statusPillWrap}>
        <View
          style={[
            styles.statusPill,
            {
              borderColor: isDone ? "#16A34A" : "#9CA3AF",
              backgroundColor: isDone ? "rgba(22,163,74,0.12)" : "#FFFFFF",
            },
          ]}
        >
          <Text style={[styles.statusPillText, { color: isDone ? "#065F46" : "#374151" }]}>
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.actionsWrap}>
        {isDone ? (
          <TouchableOpacity style={styles.viewBtn} onPress={onView}>
            <Text style={styles.viewBtnText}>View Task</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={onStart}>
            <Text style={styles.startBtnText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function StatusIcon({ isDone }: { isDone: boolean }) {
  return (
    <View
      style={[
        styles.statusIcon,
        {
          borderColor: isDone ? "#16A34A" : "#CBD5E1",
          backgroundColor: isDone ? "#16A34A" : "transparent",
        },
      ]}
    >
      {isDone ? <Text style={styles.statusCheck}>✓</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { paddingHorizontal: 20, paddingVertical: 16 },

  todayText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 14,
  },

  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#1E5BFF",
    borderRadius: 14,
    backgroundColor: "rgba(30,91,255,0.06)",
    marginBottom: 18,
    alignItems: "flex-start",
  },
  pillText: { fontSize: 22, color: "#1E5BFF" },
  pillBold: { fontWeight: "800" },

  divider: { height: 3, backgroundColor: "#1E5BFF", marginBottom: 18 },

  card: {
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 36,
    paddingLeft: 36,
    borderRadius: 18,
    borderWidth: 2.6,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  rowTop: { flexDirection: "row", alignItems: "flex-start", gap: 14 },

  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3.6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  statusCheck: { color: "#FFFFFF", fontSize: 26, fontWeight: "900" },

  cardTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
  },
  cardTime: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "600",
    color: "#6B7280",
  },

  statusPillWrap: { marginTop: 16, marginLeft: 58 },
  statusPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: "flex-start",
  },
  statusPillText: { fontSize: 26, fontWeight: "800" },

  actionsWrap: { marginTop: 18, marginLeft: 58 },

  startBtn: {
    width: 260,
    height: 92,
    borderRadius: 14,
    backgroundColor: "#1E5BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnText: { color: "#FFFFFF", fontSize: 32, fontWeight: "900" },

  viewBtn: {
    width: 260,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#C7CCD6",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtnText: { color: "#6B7280", fontSize: 32, fontWeight: "800" },

  returnHome: {
    height: 92,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  returnHomeText: { fontSize: 28, fontWeight: "900", color: "#111" },

  devReset: { alignItems: "center", marginTop: 10, paddingVertical: 10 },
  devResetText: { color: "#1E5BFF", fontWeight: "700" },
});

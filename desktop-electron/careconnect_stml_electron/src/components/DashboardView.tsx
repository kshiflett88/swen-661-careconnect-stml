import { useMemo, useState } from "react";
import type { Task } from "../App";
import { colors, sizing, typography } from "../constants/accessibility";
import { Button } from "./Button";
import { Card } from "./Card";

interface DashboardViewProps {
  tasks: Task[];
  onOpenTasks: () => void;
}

type MoodValue = "happy" | "okay" | "sad";

const moodOptions: Array<{ value: MoodValue; label: string; emoji: string }> = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "sad", label: "Sad", emoji: "😢" },
];

export function DashboardView({ tasks, onOpenTasks }: DashboardViewProps) {
  const [quickTask, setQuickTask] = useState("");
  const [quickDate, setQuickDate] = useState("");
  const [quickTime, setQuickTime] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodSaveMessage, setMoodSaveMessage] = useState("");

  const pendingTasks = useMemo(() => tasks.filter((task) => task.status === "pending"), [tasks]);

  const sortedPending = useMemo(
    () => [...pendingTasks].sort((first, second) => first.dueDateTime.getTime() - second.dueDateTime.getTime()),
    [pendingTasks]
  );

  const nextTask = sortedPending[0];
  const upcomingTasks = sortedPending.slice(1, 4);

  const formatDueTime = (dateValue: Date) => {
    const targetDate = new Date(dateValue);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const targetDay = targetDate.toDateString();
    const todayDay = today.toDateString();
    const tomorrowDay = tomorrow.toDateString();

    const timePart = targetDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (targetDay === todayDay) {
      return `Today at ${timePart}`;
    }

    if (targetDay === tomorrowDay) {
      return `Tomorrow at ${timePart}`;
    }

    return `${targetDate.toLocaleDateString([], { month: "long", day: "numeric" })} at ${timePart}`;
  };

  const panelTitleStyles: React.CSSProperties = {
    margin: 0,
    marginBottom: sizing.spaceMd,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  };

  const sectionHeaderStyles: React.CSSProperties = {
    margin: 0,
    marginBottom: sizing.spaceSm,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
  };

  const dividerStyles: React.CSSProperties = {
    height: "1px",
    backgroundColor: colors.border,
    marginBottom: sizing.spaceMd,
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      return;
    }

    const selectedLabel = moodOptions.find((option) => option.value === selectedMood)?.label ?? "Mood";
    setMoodSaveMessage(`${selectedLabel} saved for today.`);
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: sizing.spaceLg,
        fontFamily: typography.fontFamilyBase,
      }}
    >
      <div
        style={{
          backgroundColor: colors.primaryLight,
          border: `1px solid ${colors.border}`,
          borderRadius: sizing.borderRadiusSm,
          padding: `${sizing.spaceSm}px ${sizing.spaceMd}px`,
          fontSize: typography.fontSizeMd,
          fontWeight: typography.fontWeightBold,
          color: colors.text,
        }}
      >
        You are on: Dashboard
      </div>

      <h1 style={{ margin: 0, fontSize: typography.fontSizeXl, fontWeight: typography.fontWeightNormal, color: colors.text }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sizing.spaceMd, alignItems: "start" }}>
        <div style={{ order: 2 }}>
          <Card>
          <h2 style={sectionHeaderStyles}>How are You Feeling Today?</h2>
          <div style={dividerStyles} />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: sizing.spaceSm,
              marginBottom: sizing.spaceMd,
            }}
          >
            {moodOptions.map((option) => {
              const isSelected = selectedMood === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedMood(option.value);
                    setMoodSaveMessage("");
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select mood ${option.label}`}
                  style={{
                    border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                    borderRadius: sizing.borderRadiusMd,
                    backgroundColor: colors.background,
                    padding: `${sizing.spaceSm}px ${sizing.spaceMd}px`,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: sizing.spaceSm,
                    minHeight: "64px",
                    flex: "1 1 120px",
                    minWidth: "120px",
                    fontFamily: typography.fontFamilyBase,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: `2px solid ${colors.primary}`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: colors.primary,
                        opacity: isSelected ? 1 : 0,
                      }}
                    />
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: sizing.spaceSm, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: typography.fontSizeMd,
                        lineHeight: 1,
                      }}
                      aria-hidden="true"
                    >
                      {option.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: typography.fontSizeBase,
                        fontWeight: typography.fontWeightBold,
                        color: colors.text,
                      }}
                    >
                      {option.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: sizing.borderRadiusMd,
              padding: sizing.spaceMd,
              marginBottom: sizing.spaceMd,
            }}
          >
            <label
              htmlFor="mood-note"
              style={{
                display: "block",
                marginBottom: sizing.spaceSm,
                fontSize: typography.fontSizeMd,
                fontWeight: typography.fontWeightBold,
                color: colors.text,
              }}
            >
              Optional Note
            </label>
            <textarea
              id="mood-note"
              value={moodNote}
              maxLength={200}
              onChange={(event) => {
                setMoodNote(event.target.value);
                setMoodSaveMessage("");
              }}
              placeholder="You can write how you feel"
              style={{
                width: "100%",
                minHeight: "88px",
                border: `1px solid ${colors.border}`,
                borderRadius: sizing.borderRadiusSm,
                padding: sizing.spaceMd,
                resize: "none",
                fontSize: typography.fontSizeBase,
                fontFamily: typography.fontFamilyBase,
                color: colors.text,
              }}
            />
            <p style={{ marginTop: sizing.spaceSm, marginBottom: 0, fontSize: typography.fontSizeSm, color: colors.textSecondary }}>
              {moodNote.length}/200 characters
            </p>
          </div>

          <div style={{ display: "flex", gap: sizing.spaceSm }}>
            <Button
              onClick={handleSaveMood}
              variant="primary"
              disabled={!selectedMood}
              ariaLabel="Save selected mood"
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setSelectedMood(null);
                setMoodNote("");
                setMoodSaveMessage("");
              }}
              variant="secondary"
              ariaLabel="Clear mood check-in"
            >
              Clear
            </Button>
          </div>

          {moodSaveMessage && (
            <p
              role="status"
              aria-live="polite"
              style={{ marginTop: sizing.spaceMd, marginBottom: 0, color: colors.success, fontSize: typography.fontSizeBase }}
            >
              {moodSaveMessage}
            </p>
          )}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: sizing.spaceMd, order: 1 }}>
          <Card>
            <h2 style={panelTitleStyles}>Next Task</h2>
            <div style={dividerStyles} />

            {nextTask ? (
              <div
                style={{
                  border: `2px solid ${colors.warningLight}`,
                  borderRadius: sizing.borderRadiusMd,
                  padding: sizing.spaceMd,
                  marginBottom: sizing.spaceMd,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    marginBottom: sizing.spaceSm,
                    fontSize: typography.fontSizeLg,
                    fontWeight: typography.fontWeightBold,
                    color: colors.text,
                  }}
                >
                  {nextTask.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    marginBottom: sizing.spaceMd,
                    color: colors.textSecondary,
                    fontSize: typography.fontSizeBase,
                  }}
                >
                  Due: {formatDueTime(nextTask.dueDateTime)}
                </p>
                <Button onClick={onOpenTasks} variant="success" fullWidth ariaLabel="Open tasks and mark next task complete">
                  Mark Complete
                </Button>
              </div>
            ) : (
              <p style={{ margin: 0, color: colors.textSecondary }}>No pending tasks for now.</p>
            )}

            <p style={{ margin: 0, fontSize: typography.fontSizeSm, color: colors.textSecondary, fontStyle: "italic" }}>
              This is your most important task right now.
            </p>
          </Card>

          <Card>
            <h2 style={panelTitleStyles}>Upcoming Tasks</h2>
            <div style={dividerStyles} />

            {upcomingTasks.length === 0 ? (
              <p style={{ margin: 0, color: colors.textSecondary }}>No additional upcoming tasks.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: sizing.spaceSm }}>
                {upcomingTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={onOpenTasks}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: sizing.borderRadiusSm,
                      backgroundColor: colors.backgroundAlt,
                      padding: sizing.spaceMd,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    aria-label={`Open tasks and view ${task.title}`}
                  >
                    <div style={{ display: "flex", gap: sizing.spaceSm, alignItems: "flex-start" }}>
                      <span aria-hidden="true" style={{ color: colors.primary, fontWeight: typography.fontWeightBold }}>
                        ☑
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: typography.fontSizeBase,
                            fontWeight: typography.fontWeightMedium,
                            color: colors.text,
                          }}
                        >
                          {task.title}
                        </div>
                        <div style={{ fontSize: typography.fontSizeSm, color: colors.textSecondary }}>
                          {formatDueTime(task.dueDateTime)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <p style={{ marginTop: sizing.spaceMd, marginBottom: 0, fontSize: typography.fontSizeSm, color: colors.textSecondary }}>
              Right-click any task for more options
            </p>
          </Card>
        </div>
      </div>

      <Card>
          <h2 style={sectionHeaderStyles}>Quick Add Task</h2>
          <div style={dividerStyles} />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: sizing.spaceMd, alignItems: "end" }}>
            <div>
              <label
                htmlFor="quick-add-title"
                style={{
                  display: "block",
                  marginBottom: sizing.spaceSm,
                  fontSize: typography.fontSizeBase,
                  fontWeight: typography.fontWeightMedium,
                  color: colors.text,
                }}
              >
                What do you need to remember?
              </label>
              <input
                id="quick-add-title"
                type="text"
                value={quickTask}
                onChange={(event) => setQuickTask(event.target.value)}
                placeholder="Type your task here..."
                style={{
                  width: "100%",
                  height: `${sizing.inputHeight}px`,
                  border: `1px solid ${colors.border}`,
                  borderRadius: sizing.borderRadiusSm,
                  padding: `0 ${sizing.inputPadding}px`,
                  fontSize: typography.fontSizeBase,
                  fontFamily: typography.fontFamilyBase,
                }}
              />
            </div>

            <div>
              <label
                htmlFor="quick-add-date"
                style={{
                  display: "block",
                  marginBottom: sizing.spaceSm,
                  fontSize: typography.fontSizeBase,
                  fontWeight: typography.fontWeightMedium,
                  color: colors.text,
                }}
              >
                Due Date
              </label>
              <input
                id="quick-add-date"
                type="date"
                value={quickDate}
                onChange={(event) => setQuickDate(event.target.value)}
                style={{
                  width: "100%",
                  height: `${sizing.inputHeight}px`,
                  border: `1px solid ${colors.border}`,
                  borderRadius: sizing.borderRadiusSm,
                  padding: `0 ${sizing.inputPadding}px`,
                  fontSize: typography.fontSizeBase,
                  fontFamily: typography.fontFamilyBase,
                }}
              />
            </div>

            <div>
              <label
                htmlFor="quick-add-time"
                style={{
                  display: "block",
                  marginBottom: sizing.spaceSm,
                  fontSize: typography.fontSizeBase,
                  fontWeight: typography.fontWeightMedium,
                  color: colors.text,
                }}
              >
                Due Time
              </label>
              <input
                id="quick-add-time"
                type="time"
                value={quickTime}
                onChange={(event) => setQuickTime(event.target.value)}
                style={{
                  width: "100%",
                  height: `${sizing.inputHeight}px`,
                  border: `1px solid ${colors.border}`,
                  borderRadius: sizing.borderRadiusSm,
                  padding: `0 ${sizing.inputPadding}px`,
                  fontSize: typography.fontSizeBase,
                  fontFamily: typography.fontFamilyBase,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: sizing.spaceSm, marginTop: sizing.spaceMd }}>
            <Button
              onClick={onOpenTasks}
              variant="primary"
              ariaLabel="Open tasks screen to add this task"
              disabled={!quickTask.trim()}
            >
              Add Task
            </Button>
            <Button
              onClick={() => {
                setQuickTask("");
                setQuickDate("");
                setQuickTime("");
              }}
              variant="secondary"
              ariaLabel="Clear quick add form"
            >
              Clear
            </Button>
          </div>
      </Card>

    </section>
  );
}
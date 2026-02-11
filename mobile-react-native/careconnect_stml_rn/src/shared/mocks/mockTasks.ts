import type { TaskImageKey } from "../assets/taskImages"; // adjust if needed

export type Task = {
  id: string;
  title: string;
  description?: string;
  isCritical?: boolean;
  scheduledAt?: Date;      // optional
  imageAsset?: string;     // optional (if you later add images)
  imageKey?: TaskImageKey;
  steps?: string[];
};

const todayAt = (hour: number, minute: number) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
};


// React Native mock equivalent of your Flutter mock_tasks.dart
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Take Morning Medication",
    description: "Blue pill after breakfast",
    isCritical: true,
    scheduledAt: todayAt(8, 0),
    imageKey: "medication",
    steps: ["Get the blue pill bottle", "Take 1 pill with water", "Mark as done"],
  },
  {
    id: "2",
    title: "Drink Water",
    description: "One full glass",
    scheduledAt: todayAt(10, 30),
    imageKey: "water",
    steps: ["Fill a glass with water", "Drink the full glass", "Mark as done"],
  },
  {
    id: "3",
    title: "Go for a Walk",
    description: "10 minutes outside",
    scheduledAt: todayAt(14, 0),
    imageKey: "exercise",
    steps: ["Put on comfortable shoes", "Walk for 10 minutes", "Mark as done"],
  },
];


//test line (important)
export default mockTasks;
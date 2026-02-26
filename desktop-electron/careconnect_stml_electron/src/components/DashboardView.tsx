import type { Task } from "../App";

interface DashboardViewProps {
  tasks: Task[];
  onOpenTasks: () => void;
}

export function DashboardView({ tasks, onOpenTasks }: DashboardViewProps) {
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  return (
    <section>
      <h1>Dashboard</h1>
      <p>This is a placeholder dashboard view.</p>
      <p>Pending tasks: {pendingTasks}</p>
      <p>Completed tasks: {completedTasks}</p>
      <button onClick={onOpenTasks}>Go to Tasks</button>
    </section>
  );
}
import type { Task } from '../models/task';

export const mockTasks: Task[] = [
  { id: '1', title: 'Take morning medication', scheduledAt: new Date().toISOString() },
  { id: '2', title: 'Drink water', scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
  { id: '3', title: 'Stretch', scheduledAt: null },
];

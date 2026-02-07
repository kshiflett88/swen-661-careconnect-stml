import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = 'task_completed_at:';

export class TaskStatusStore {
  async getCompletedAt(taskId: string): Promise<string | null> {
    return AsyncStorage.getItem(prefix + taskId);
  }

  async setCompletedAt(taskId: string, isoDate: string): Promise<void> {
    await AsyncStorage.setItem(prefix + taskId, isoDate);
  }

  async clearCompletedAt(taskId: string): Promise<void> {
    await AsyncStorage.removeItem(prefix + taskId);
  }
}

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "careconnect.task.completedAt:";

export async function getCompletedAt(taskId: string): Promise<string | null> {
  return AsyncStorage.getItem(`${KEY_PREFIX}${taskId}`);
}

export async function setCompletedAt(taskId: string, iso: string): Promise<void> {
  await AsyncStorage.setItem(`${KEY_PREFIX}${taskId}`, iso);
}

export async function clearCompletedAt(taskId: string): Promise<void> {
  await AsyncStorage.removeItem(`${KEY_PREFIX}${taskId}`);
}

export async function clearAllTasks(taskIds: string[]): Promise<void> {
  const keys = taskIds.map((id) => `${KEY_PREFIX}${id}`);
  await AsyncStorage.multiRemove(keys);
}

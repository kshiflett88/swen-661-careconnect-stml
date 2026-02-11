export type Task = {
  id: string;
  title: string;
  scheduledAt?: string | null; // ISO string for easy storage/mock
};

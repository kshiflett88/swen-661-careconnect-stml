/**
 * Type definitions for CareConnect STML
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string; // ISO date string
  dueTime?: string; // Time in HH:mm format
  completed: boolean;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

export interface HealthLogEntry {
  id: string;
  type: 'medication' | 'symptom' | 'vitals' | 'appointment';
  timestamp: string; // ISO timestamp
  title: string;
  notes?: string;
  // Specific fields based on type
  medicationName?: string;
  dosage?: string;
  symptomSeverity?: 1 | 2 | 3 | 4 | 5;
  heartRate?: number;
  bloodPressure?: string; // e.g., "120/80"
  temperature?: number;
  appointmentLocation?: string;
}

export type ScreenId =
  | 'welcome'
  | 'signin-help'
  | 'dashboard'
  | 'task-list'
  | 'task-detail'
  | 'health-log'
  | 'contacts'
  | 'emergency'
  | 'emergency-confirmation'
  | 'emergency-calling'
  | 'profile'
  | 'accessibility';

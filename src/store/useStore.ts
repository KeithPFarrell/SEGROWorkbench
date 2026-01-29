import { create } from 'zustand';
import {
  UL360Task,
  MeterExceptionTask,
  ValidationTask,
  ActivityLogEntry,
  MeterDataCycle,
  ArchiveFile,
} from '../types';
import {
  ul360Tasks as initialUL360Tasks,
  meterExceptionTasks as initialMeterExceptionTasks,
  validationTasks as initialValidationTasks,
  activityLog as initialActivityLog,
  meterDataCycles as initialMeterDataCycles,
  archiveFiles as initialArchiveFiles,
} from '../mock/data';

interface AppState {
  // Data
  ul360Tasks: UL360Task[];
  meterExceptionTasks: MeterExceptionTask[];
  validationTasks: ValidationTask[];
  activityLog: ActivityLogEntry[];
  meterDataCycles: MeterDataCycle[];
  archiveFiles: ArchiveFile[];

  // Actions
  updateUL360Task: (id: string, updates: Partial<UL360Task>) => void;
  updateMeterExceptionTask: (id: string, updates: Partial<MeterExceptionTask>) => void;
  updateValidationTask: (id: string, updates: Partial<ValidationTask>) => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  addArchiveFile: (file: Omit<ArchiveFile, 'id' | 'generatedAt'>) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  ul360Tasks: initialUL360Tasks,
  meterExceptionTasks: initialMeterExceptionTasks,
  validationTasks: initialValidationTasks,
  activityLog: initialActivityLog,
  meterDataCycles: initialMeterDataCycles,
  archiveFiles: initialArchiveFiles,

  // Update UL360 Task
  updateUL360Task: (id, updates) =>
    set((state) => ({
      ul360Tasks: state.ul360Tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    })),

  // Update Meter Exception Task
  updateMeterExceptionTask: (id, updates) =>
    set((state) => ({
      meterExceptionTasks: state.meterExceptionTasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    })),

  // Update Validation Task
  updateValidationTask: (id, updates) =>
    set((state) => ({
      validationTasks: state.validationTasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    })),

  // Add Activity Log Entry
  addActivityLog: (entry) =>
    set((state) => ({
      activityLog: [
        {
          ...entry,
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        ...state.activityLog,
      ],
    })),

  // Add Archive File
  addArchiveFile: (file) =>
    set((state) => ({
      archiveFiles: [
        {
          ...file,
          id: `file-${Date.now()}`,
          generatedAt: new Date().toISOString(),
        },
        ...state.archiveFiles,
      ],
    })),
}));

import type { UserSettings, WorkLog, Reminder } from '../types';

export type SyncActionType = 
  | 'SAVE_WORK_LOG' 
  | 'DELETE_WORK_LOG' 
  | 'SAVE_ANNUAL_LEAVE_BATCH' 
  | 'CLEAR_MONTH_LOGS' 
  | 'UPDATE_SETTINGS'
  | 'ADD_REMINDER'
  | 'TOGGLE_REMINDER'
  | 'DELETE_REMINDER';

export interface SyncQueueItem {
  id: string;
  type: SyncActionType;
  payload: any;
  timestamp: number;
  userId: string;
}

const STORAGE_PREFIX = 'vardiyo_offline_';

const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[OfflineStorage] Read error for key ${key}:`, err);
    return fallback;
  }
};

const safeSet = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[OfflineStorage] Write error for key ${key}:`, err);
  }
};

// --- SETTINGS CACHE ---
export const getCachedSettings = (userId?: string): UserSettings | null => {
  const key = userId ? `${STORAGE_PREFIX}settings_${userId}` : `${STORAGE_PREFIX}settings_guest`;
  return safeGet<UserSettings | null>(key, null);
};

export const setCachedSettings = (userId: string | undefined, settings: UserSettings | null): void => {
  const key = userId ? `${STORAGE_PREFIX}settings_${userId}` : `${STORAGE_PREFIX}settings_guest`;
  safeSet(key, settings);
};

// --- WORK LOGS CACHE ---
export const getCachedWorkLogs = (userId: string): Record<string, WorkLog> => {
  const key = `${STORAGE_PREFIX}work_logs_${userId}`;
  return safeGet<Record<string, WorkLog>>(key, {});
};

export const setCachedWorkLogs = (userId: string, logs: Record<string, WorkLog>): void => {
  const key = `${STORAGE_PREFIX}work_logs_${userId}`;
  safeSet(key, logs);
};

export const updateSingleCachedWorkLog = (userId: string, log: WorkLog & { log_date: string }): void => {
  const current = getCachedWorkLogs(userId);
  current[log.log_date] = log;
  setCachedWorkLogs(userId, current);
};

export const deleteSingleCachedWorkLog = (userId: string, dateKey: string): void => {
  const current = getCachedWorkLogs(userId);
  delete current[dateKey];
  setCachedWorkLogs(userId, current);
};

export const mergeCachedWorkLogs = (userId: string, newLogs: Record<string, WorkLog>): void => {
  const current = getCachedWorkLogs(userId);
  const merged = { ...current, ...newLogs };
  setCachedWorkLogs(userId, merged);
};

export const deleteCachedMonthWorkLogs = (userId: string, firstDay: string, lastDay: string): void => {
  const current = getCachedWorkLogs(userId);
  Object.keys(current).forEach((dateKey) => {
    if (dateKey >= firstDay && dateKey <= lastDay) {
      delete current[dateKey];
    }
  });
  setCachedWorkLogs(userId, current);
};

// --- REMINDERS CACHE ---
export const getCachedReminders = (userId: string): Reminder[] => {
  const key = `${STORAGE_PREFIX}reminders_${userId}`;
  return safeGet<Reminder[]>(key, []);
};

export const setCachedReminders = (userId: string, reminders: Reminder[]): void => {
  const key = `${STORAGE_PREFIX}reminders_${userId}`;
  safeSet(key, reminders);
};

// --- SYNC QUEUE (FIFO) ---
export const getSyncQueue = (userId: string): SyncQueueItem[] => {
  const key = `${STORAGE_PREFIX}sync_queue_${userId}`;
  return safeGet<SyncQueueItem[]>(key, []);
};

export const addToSyncQueue = (userId: string, actionType: SyncActionType, payload: any): SyncQueueItem => {
  const queue = getSyncQueue(userId);
  const newItem: SyncQueueItem = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`,
    type: actionType,
    payload,
    timestamp: Date.now(),
    userId
  };
  queue.push(newItem);
  const key = `${STORAGE_PREFIX}sync_queue_${userId}`;
  safeSet(key, queue);
  window.dispatchEvent(new CustomEvent('vardiyo-sync-queue-updated', { detail: { count: queue.length, userId } }));
  return newItem;
};

export const removeFromSyncQueue = (userId: string, id: string): void => {
  let queue = getSyncQueue(userId);
  queue = queue.filter(item => item.id !== id);
  const key = `${STORAGE_PREFIX}sync_queue_${userId}`;
  safeSet(key, queue);
  window.dispatchEvent(new CustomEvent('vardiyo-sync-queue-updated', { detail: { count: queue.length, userId } }));
};

export const getSyncQueueCount = (userId?: string): number => {
  if (!userId) return 0;
  return getSyncQueue(userId).length;
};


import { supabase } from '../lib/supabaseClient';
import { getSyncQueue, removeFromSyncQueue, type SyncQueueItem } from './offlineStorage';

let isSyncing = false;
type SyncListener = (status: { isSyncing: boolean; pendingCount: number }) => void;
const listeners: Set<SyncListener> = new Set();

export const subscribeToSyncState = (listener: SyncListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = (pendingCount: number) => {
  listeners.forEach(fn => fn({ isSyncing, pendingCount }));
};

export const processSyncQueue = async (userId: string): Promise<boolean> => {
  if (!userId || isSyncing || !navigator.onLine) {
    return false;
  }

  const queue = getSyncQueue(userId);
  if (queue.length === 0) {
    notifyListeners(0);
    return true;
  }

  isSyncing = true;
  notifyListeners(queue.length);

  try {
    for (const item of queue) {
      if (!navigator.onLine) {
        break; // Network dropped during sync, pause
      }

      const success = await executeSyncItem(item);
      if (success) {
        removeFromSyncQueue(userId, item.id);
        notifyListeners(getSyncQueue(userId).length);
      } else {
        // If a fatal network failure occurs, stop processing to prevent out-of-order mutations
        break;
      }
    }
  } catch (err) {
    console.error('[SyncService] Queue processing error:', err);
  } finally {
    isSyncing = false;
    notifyListeners(getSyncQueue(userId).length);
  }

  return getSyncQueue(userId).length === 0;
};

const executeSyncItem = async (item: SyncQueueItem): Promise<boolean> => {
  try {
    switch (item.type) {
      case 'SAVE_WORK_LOG': {
        const { error } = await supabase
          .from('work_logs')
          .upsert(item.payload, { onConflict: 'user_id,log_date' });
        return !error;
      }

      case 'DELETE_WORK_LOG': {
        const { error } = await supabase
          .from('work_logs')
          .delete()
          .eq('user_id', item.userId)
          .eq('log_date', item.payload.dateKey);
        return !error;
      }

      case 'SAVE_WORK_LOG_BATCH': {
        const { error } = await supabase
          .from('work_logs')
          .upsert(item.payload.dates, { onConflict: 'user_id,log_date' });
        return !error;
      }

      case 'CLEAR_MONTH_LOGS': {
        const { error } = await supabase
          .from('work_logs')
          .delete()
          .eq('user_id', item.userId)
          .gte('log_date', item.payload.firstDay)
          .lte('log_date', item.payload.lastDay);
        return !error;
      }

      case 'UPDATE_SETTINGS': {
        const { error } = await supabase
          .from('user_settings')
          .upsert(
            { user_id: item.userId, ...item.payload, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
        return !error;
      }

      case 'ADD_REMINDER': {
        const { error } = await supabase
          .from('reminders')
          .insert(item.payload);
        return !error;
      }

      case 'TOGGLE_REMINDER': {
        const { error } = await supabase
          .from('reminders')
          .update({ is_completed: item.payload.is_completed })
          .eq('id', item.payload.id);
        return !error;
      }

      case 'DELETE_REMINDER': {
        const { error } = await supabase
          .from('reminders')
          .delete()
          .eq('id', item.payload.id);
        return !error;
      }

      default:
        console.warn('[SyncService] Unknown action type:', item);
        return true; // remove corrupted item
    }
  } catch (err) {
    console.error(`[SyncService] Failed to execute ${item.type}:`, err);
    return false;
  }
};


import { supabase } from '../lib/supabaseClient';
import { 
  getCachedSettings, 
  setCachedSettings,
  getCachedWorkLogs, 
  updateSingleCachedWorkLog, 
  deleteSingleCachedWorkLog,
  mergeCachedWorkLogs,
  deleteCachedMonthWorkLogs,
  getCachedReminders,
  setCachedReminders,
  addToSyncQueue 
} from './offlineStorage';
import type { Reminder, UserSettings } from '../types';

export interface DbResult<T = any> {
  data: T | null;
  error: { message: string } | null;
}

export interface DbVoidResult {
  error: { message: string } | null;
}

const isNetworkOffline = () => typeof navigator !== 'undefined' && !navigator.onLine;

// --- USER SETTINGS ---
export const updateUserSettings = async (userId: string, payload: any): Promise<DbResult<UserSettings>> => {
  if (isNetworkOffline()) {
    const current = getCachedSettings(userId) || ({} as UserSettings);
    const updated = { ...current, ...payload, user_id: userId, updated_at: new Date().toISOString() };
    setCachedSettings(userId, updated);
    addToSyncQueue(userId, 'UPDATE_SETTINGS', payload);
    return { data: updated, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        { user_id: userId, ...payload, updated_at: new Date().toISOString() }, 
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    if (data) setCachedSettings(userId, data);
    return { data, error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in updateUserSettings, fallback to offline:', err);
    const current = getCachedSettings(userId) || ({} as UserSettings);
    const updated = { ...current, ...payload, user_id: userId, updated_at: new Date().toISOString() };
    setCachedSettings(userId, updated);
    addToSyncQueue(userId, 'UPDATE_SETTINGS', payload);
    return { data: updated, error: null };
  }
};

export const fetchUserSettings = async (userId: string): Promise<UserSettings | null> => {
  if (isNetworkOffline()) {
    return getCachedSettings(userId);
  }

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setCachedSettings(userId, data);
      return data;
    }
    return getCachedSettings(userId);
  } catch {
    return getCachedSettings(userId);
  }
};

// --- WORK LOGS ---
export const fetchMonthWorkLogs = async (userId: string, firstDay: string, lastDay: string) => {
  const getOfflineLogs = () => {
    const all = getCachedWorkLogs(userId);
    const filtered: Record<string, any> = {};
    Object.keys(all).forEach(dateKey => {
      if (dateKey >= firstDay && dateKey <= lastDay) {
        filtered[dateKey] = all[dateKey];
      }
    });
    return filtered;
  };

  if (isNetworkOffline()) {
    return getOfflineLogs();
  }

  try {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', firstDay)
      .lte('log_date', lastDay);

    if (error) throw error;

    const logsMap: Record<string, any> = {};
    if (data) {
      data.forEach(log => {
        logsMap[log.log_date] = log;
      });
      mergeCachedWorkLogs(userId, logsMap);
    }
    return logsMap;
  } catch (err) {
    console.warn('[dbService] Network failure in fetchMonthWorkLogs, fallback to cache:', err);
    return getOfflineLogs();
  }
};

export const fetchWorkLogsRange = async (userId: string, firstDay: string, lastDay: string) => {
  const getOfflineRange = () => {
    const all = getCachedWorkLogs(userId);
    return Object.keys(all)
      .filter(dateKey => dateKey >= firstDay && dateKey <= lastDay)
      .map(dateKey => all[dateKey]);
  };

  if (isNetworkOffline()) {
    return getOfflineRange();
  }

  try {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', firstDay)
      .lte('log_date', lastDay);

    if (error) throw error;
    return data || [];
  } catch {
    return getOfflineRange();
  }
};

export const saveUserWorkLog = async (payload: any): Promise<DbResult<any>> => {
  const userId = payload.user_id;

  if (isNetworkOffline()) {
    updateSingleCachedWorkLog(userId, payload);
    addToSyncQueue(userId, 'SAVE_WORK_LOG', payload);
    return { data: payload, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('work_logs')
      .upsert(payload, { onConflict: 'user_id,log_date' })
      .select()
      .single();

    if (error) throw error;
    if (data) updateSingleCachedWorkLog(userId, data);
    return { data, error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in saveUserWorkLog, fallback to offline:', err);
    updateSingleCachedWorkLog(userId, payload);
    addToSyncQueue(userId, 'SAVE_WORK_LOG', payload);
    return { data: payload, error: null };
  }
};

export const deleteUserWorkLog = async (userId: string, dateKey: string): Promise<DbVoidResult> => {
  if (isNetworkOffline()) {
    deleteSingleCachedWorkLog(userId, dateKey);
    addToSyncQueue(userId, 'DELETE_WORK_LOG', { dateKey });
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('work_logs')
      .delete()
      .eq('user_id', userId)
      .eq('log_date', dateKey);

    if (error) throw error;
    deleteSingleCachedWorkLog(userId, dateKey);
    return { error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in deleteUserWorkLog, fallback to offline:', err);
    deleteSingleCachedWorkLog(userId, dateKey);
    addToSyncQueue(userId, 'DELETE_WORK_LOG', { dateKey });
    return { error: null };
  }
};

export const saveAnnualLeaveBatch = async (userId: string, dates: any[]): Promise<DbVoidResult> => {
  const cacheMap: Record<string, any> = {};
  dates.forEach(d => { cacheMap[d.log_date] = d; });

  if (isNetworkOffline()) {
    mergeCachedWorkLogs(userId, cacheMap);
    addToSyncQueue(userId, 'SAVE_ANNUAL_LEAVE_BATCH', { dates });
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('work_logs')
      .upsert(dates, { onConflict: 'user_id,log_date' });

    if (error) throw error;
    mergeCachedWorkLogs(userId, cacheMap);
    return { error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in saveAnnualLeaveBatch, fallback to offline:', err);
    mergeCachedWorkLogs(userId, cacheMap);
    addToSyncQueue(userId, 'SAVE_ANNUAL_LEAVE_BATCH', { dates });
    return { error: null };
  }
};

export const clearMonthWorkLogs = async (userId: string, firstDay: string, lastDay: string): Promise<DbVoidResult> => {
  if (isNetworkOffline()) {
    deleteCachedMonthWorkLogs(userId, firstDay, lastDay);
    addToSyncQueue(userId, 'CLEAR_MONTH_LOGS', { firstDay, lastDay });
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('work_logs')
      .delete()
      .eq('user_id', userId)
      .gte('log_date', firstDay)
      .lte('log_date', lastDay);

    if (error) throw error;
    deleteCachedMonthWorkLogs(userId, firstDay, lastDay);
    return { error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in clearMonthWorkLogs, fallback to offline:', err);
    deleteCachedMonthWorkLogs(userId, firstDay, lastDay);
    addToSyncQueue(userId, 'CLEAR_MONTH_LOGS', { firstDay, lastDay });
    return { error: null };
  }
};

// --- REMINDERS ---
export const fetchUserReminders = async (userId: string): Promise<Reminder[]> => {
  if (isNetworkOffline()) {
    return getCachedReminders(userId);
  }

  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false });

    if (error) throw error;
    const reminders = data || [];
    setCachedReminders(userId, reminders);
    return reminders;
  } catch {
    return getCachedReminders(userId);
  }
};

export const saveUserReminder = async (userId: string, payload: any): Promise<DbResult<Reminder>> => {
  const current = getCachedReminders(userId);
  const tempReminder: Reminder = {
    id: Date.now(),
    user_id: userId,
    title: payload.title || '',
    date: payload.date || new Date().toISOString().split('T')[0],
    is_completed: false,
    created_at: new Date().toISOString(),
    ...payload
  };

  if (isNetworkOffline()) {
    setCachedReminders(userId, [tempReminder, ...current]);
    addToSyncQueue(userId, 'ADD_REMINDER', payload);
    return { data: tempReminder, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    setCachedReminders(userId, [data, ...current]);
    return { data, error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in saveUserReminder, fallback to offline:', err);
    setCachedReminders(userId, [tempReminder, ...current]);
    addToSyncQueue(userId, 'ADD_REMINDER', payload);
    return { data: tempReminder, error: null };
  }
};

export const toggleUserReminder = async (userId: string, id: number, currentStatus: boolean): Promise<DbVoidResult> => {
  const current = getCachedReminders(userId);
  const updated = current.map(r => r.id === id ? { ...r, is_completed: !currentStatus } : r);
  setCachedReminders(userId, updated);

  if (isNetworkOffline()) {
    addToSyncQueue(userId, 'TOGGLE_REMINDER', { id, is_completed: !currentStatus });
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('reminders')
      .update({ is_completed: !currentStatus })
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in toggleUserReminder, fallback to offline:', err);
    addToSyncQueue(userId, 'TOGGLE_REMINDER', { id, is_completed: !currentStatus });
    return { error: null };
  }
};

export const deleteUserReminder = async (userId: string, id: number): Promise<DbVoidResult> => {
  const current = getCachedReminders(userId);
  const updated = current.filter(r => r.id !== id);
  setCachedReminders(userId, updated);

  if (isNetworkOffline()) {
    addToSyncQueue(userId, 'DELETE_REMINDER', { id });
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    console.warn('[dbService] Network failure in deleteUserReminder, fallback to offline:', err);
    addToSyncQueue(userId, 'DELETE_REMINDER', { id });
    return { error: null };
  }
};
import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { UserSettings } from '../types';

interface AppState {
  user: User | null;
  session: Session | null;
  settings: UserSettings | null;
  isOnline: boolean;
  pendingSyncCount: number;
  unreadTicketCount: number;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  setIsOnline: (isOnline: boolean) => void;
  setPendingSyncCount: (count: number) => void;
  setUnreadTicketCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  session: null,
  settings: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingSyncCount: 0,
  unreadTicketCount: 0,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setSettings: (settings) => set({ settings }),
  setIsOnline: (isOnline) => set({ isOnline }),
  setPendingSyncCount: (pendingSyncCount) => set({ pendingSyncCount }),
  setUnreadTicketCount: (unreadTicketCount) => set({ unreadTicketCount }),
}));

export function isPremiumUser(settings: UserSettings | null): boolean {
  if (!settings) return false;
  if (settings.role === 'admin') return true;
  if (settings.role === 'premium') return true;
  if (settings.premium_until && new Date(settings.premium_until) > new Date()) return true;
  return false;
}

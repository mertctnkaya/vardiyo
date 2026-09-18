import type { NotificationPreferences } from "./user";

export interface ShiftSystemSectionProps {
  workType: string;
  setWorkType: (val: string) => void;
  shiftStartTime: string;
  setShiftStartTime: (val: string) => void;
  shiftEndTime: string;
  setShiftEndTime: (val: string) => void;
  shiftDuration: string;
  setShiftDuration: (val: string) => void;
  setShiftPattern: (val: number[]) => void;
  restDays: number[];
  setRestDays: (val: number[]) => void;
}

export interface PayrollSectionProps {
  workType: string;
  monthlyGross: string;
  setMonthlyGross: (val: string) => void;
  displayOvertime: string;
  baseWorkHours: string;
  setBaseWorkHours: (val: string) => void;
  nightBonus: string;
  setNightBonus: (val: string) => void;
}

export interface YevmiyeSectionProps {
  dailyYevmiye: string;
  setDailyYevmiye: (val: string) => void;
  paymentFrequency: string;
  setPaymentFrequency: (val: string) => void;
  paymentDayOfWeek: string;
  setPaymentDayOfWeek: (val: string) => void;
}

export interface NotificationSectionProps {
  notificationStatus: string;
  onRequestPermission: () => void;
  prefs: NotificationPreferences;
  onToggle: (key: keyof NotificationPreferences) => void;
}

export interface DateReferencesSectionProps {
  workType: string;
  employmentStartDate: string;
  setEmploymentStartDate: (val: string) => void;
  shiftEpochDate: string;
  setShiftEpochDate: (val: string) => void;
}

export interface SettingsHeaderProps {
  user: import('@supabase/supabase-js').User | null;
}

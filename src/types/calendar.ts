export type DayStatus = 'normal' | 'overtime' | 'leave' | 'annual_leave' | 'holiday_work' | 'absent' | 'late' | 'partial_leave';

export interface WorkLog {
  log_date?: string;
  status: DayStatus;
  hours?: string | number;
  note?: string;
  custom_yevmiye?: number | null;
  worked_hours?: number | null;
}

export interface DayDetail {
  date: Date;
  shiftName: string;
  isNightShift: boolean;
  isOffDay: boolean;
  isPast: boolean;
  isCurrentMonth: boolean;
  shiftId: number;
}

export interface SelectedDayInfo {
  date: Date;
  shiftName: string;
  isNightShift: boolean;
  isOffDay: boolean;
  isPast: boolean;
  isCurrentMonth: boolean;
  shiftId: number;
}

export interface CalendarHeaderProps {
  baseDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export interface CalendarGridProps {
  calendarDays: any[];
  getShiftForDate: (date: Date) => any;
  actualToday: Date;
  employmentStartDate: Date;
  workLogs: Record<string, any>;
  onDayClick: (dayData: DayDetail, isBeforeEmployment: boolean) => void;
  isPaused?: boolean;
  pausedDates?: { start: string; end: string | null } | null;
}

export interface CalendarStatsProps {
  monthlyStats: {
    normal: number;
    overtimeHours: number;
    lateHours: number;
    absent: number;
    leave: number;
    annualLeave: number;
    holidayWork: number;
    weekendPaid: number;
    isDangerAbsent: boolean;
    maxConsecutiveAbsent: number;
  };
  baseDate: Date;
}

export interface DayActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DayDetail | null;
  existingLog: any;
  actualToday: Date;
  user: any;
  onUpdateLog: (dateKey: string, data: any) => void;
  onDeleteLog: (dateKey: string) => void;
}

export interface CalendarPauseProps {
  isPaused: boolean;
  pausedDates?: { start: string; end: string | null } | null;
  onPauseRange: (start: string, end: string | null) => void;
  onPauseCurrentMonth: () => void;
  onResume: () => void;
  onSaveAnnualLeave: (start: string, end: string) => void;
  onClearRange: (start: string, end: string) => void;
}
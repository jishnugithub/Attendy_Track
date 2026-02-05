export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface TimetableConfig {
  id: string
  user_id: string
  working_days: 5 | 6
  slots_per_day: number
  start_date: string
  min_attendance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TimetableSlot {
  id: string
  config_id: string
  day_name: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  slot_number: number
  subject: string
  slot_type: 'class' | 'lunch' | 'break'
  created_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  config_id: string
  date: string
  day_status?: 'normal' | 'holiday' | 'absent'
  created_at: string
  updated_at: string
}

export interface AttendanceSlot {
  id: string
  attendance_record_id: string
  slot_id: string
  status: 'present' | 'absent' | 'not-considered'
  created_at: string
  updated_at: string
}

export interface AttendanceLog {
  id: string
  user_id: string
  log_name: string
  start_date: string
  end_date: string
  data: {
    config: TimetableConfig
    slots: TimetableSlot[]
    attendance: (AttendanceRecord & { attendance_slots: AttendanceSlot[] })[]
  }
  created_at: string
}

export interface DayAttendance {
  date: string
  dayName: string
  dayStatus?: 'normal' | 'holiday' | 'absent'
  slots: Array<{
    id: string
    slotNumber: number
    subject: string
    slotType: 'class' | 'lunch' | 'break'
    status?: 'present' | 'absent' | 'not-considered'
  }>
}

export interface SubjectAttendance {
  subject: string
  present: number
  total: number
  percentage: number
  minRequired: number
  status: 'safe' | 'warning' | 'danger'
}

export interface SubjectStats {
  subject: string
  percentage: number
  present: number
  total: number
  status: 'safe' | 'warning' | 'danger'
  minRequired: number
}

export interface AttendanceStats {
  overall: {
    percentage: number
    present: number
    total: number
    status: 'safe' | 'warning' | 'danger'
  }
  subjects: SubjectAttendance[]
}

export type AttendanceStatus = 'present' | 'absent' | 'not-considered' | null
export type DayStatus = 'normal' | 'holiday' | 'absent'

// Attendance calculation utilities
import { format, parseISO } from 'date-fns'

export const getDayName = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'EEEE') // Monday, Tuesday, etc.
}

export interface AttendanceData {
  date: string
  dayStatus?: string
  slots: Array<{
    slotId: string
    subject: string
    slotType: string
    status?: string
  }>
}

export interface SubjectStats {
  subject: string
  present: number
  total: number
  percentage: number
  minRequired: number
  status: 'safe' | 'warning' | 'danger'
}

export const calculateOverallAttendance = (
  attendanceData: AttendanceData[],
  minAttendance: number = 75
) => {
  let present = 0
  let total = 0

  attendanceData.forEach(day => {
    if (day.dayStatus === 'holiday') return

    day.slots.forEach(slot => {
      if (slot.slotType === 'lunch' || slot.slotType === 'break') return
      if (slot.status === 'not-considered') return

      total++
      if (slot.status === 'present') present++
    })
  })

  const percentage = total > 0 ? (present / total) * 100 : 0
  const status =
    percentage >= minAttendance
      ? 'safe'
      : percentage >= minAttendance - 5
      ? 'warning'
      : 'danger'

  return {
    percentage,
    present,
    total,
    status
  }
}

export const calculateSubjectWiseAttendance = (
  attendanceData: AttendanceData[],
  minAttendance: number = 75
): SubjectStats[] => {
  const subjects: Record<string, { present: number; total: number }> = {}

  attendanceData.forEach(day => {
    if (day.dayStatus === 'holiday') return

    day.slots.forEach(slot => {
      if (slot.slotType === 'lunch' || slot.slotType === 'break') return
      if (slot.status === 'not-considered') return

      if (!subjects[slot.subject]) {
        subjects[slot.subject] = { present: 0, total: 0 }
      }

      subjects[slot.subject].total++
      if (slot.status === 'present') {
        subjects[slot.subject].present++
      }
    })
  })

  return Object.entries(subjects).map(([subject, stats]) => {
    const percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0
    const status =
      percentage >= minAttendance
        ? 'safe'
        : percentage >= minAttendance - 5
        ? 'warning'
        : 'danger'

    return {
      subject,
      present: stats.present,
      total: stats.total,
      percentage: parseFloat(percentage.toFixed(2)),
      minRequired: minAttendance,
      status
    }
  })
}

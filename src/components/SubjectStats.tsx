'use client'

import { useEffect, useState, useMemo } from 'react'
import { getActiveTimetableConfig, getTimetableSlots, getAttendanceRecords } from '@/lib/supabase'
import { calculateSubjectWiseAttendance } from '@/lib/utils'
import type { TimetableConfig, TimetableSlot, AttendanceRecord } from '@/types'

interface SubjectStatsProps {
  userId: string
}

export default function SubjectStats({ userId }: SubjectStatsProps) {
  const [config, setConfig] = useState<TimetableConfig | null>(null)
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [userId])

  async function loadData() {
    try {
      const timetableConfig = await getActiveTimetableConfig(userId)
      
      if (!timetableConfig) {
        setLoading(false)
        return
      }

      setConfig(timetableConfig)

      const timetableSlots = await getTimetableSlots(timetableConfig.id)
      setSlots(timetableSlots)

      const today = new Date().toISOString().split('T')[0]
      const attendanceRecords = await getAttendanceRecords(
        userId,
        timetableConfig.id,
        timetableConfig.start_date,
        today
      )
      setAttendance(attendanceRecords)

      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const subjectStats = useMemo(() => {
    if (!config || slots.length === 0) {
      return []
    }

    const attendanceData = attendance.map(record => ({
      date: record.date,
      dayStatus: record.day_status,
      slots: slots
        .filter(slot => {
          const recordSlots = (record as any).attendance_slots || []
          return recordSlots.some((as: any) => as.slot_id === slot.id)
        })
        .map(slot => {
          const recordSlots = (record as any).attendance_slots || []
          const attendanceSlot = recordSlots.find((as: any) => as.slot_id === slot.id)
          return {
            slotId: slot.id,
            subject: slot.subject,
            slotType: slot.slot_type,
            status: attendanceSlot?.status
          }
        })
    }))

    return calculateSubjectWiseAttendance(attendanceData, config.min_attendance)
  }, [config, slots, attendance])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center py-20">
        <p className="text-dark-400">Please create a timetable first</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-dark-100 mb-2">
          Subject-wise Attendance
        </h1>
        <p className="text-dark-400 text-lg">
          Detailed breakdown by subject
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectStats.map(subject => (
          <div
            key={subject.subject}
            className="bg-dark-900 rounded-xl p-6 border border-dark-800 hover:border-primary-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-dark-100">
                {subject.subject}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  subject.status === 'safe'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : subject.status === 'warning'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {subject.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-dark-100">
                  {subject.present}
                </div>
                <div className="text-xs text-dark-400 uppercase tracking-wider">
                  Present
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-dark-100">
                  {subject.total}
                </div>
                <div className="text-xs text-dark-400 uppercase tracking-wider">
                  Total
                </div>
              </div>
            </div>

            <div className="h-2 bg-dark-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                style={{ width: `${subject.percentage}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-dark-300 font-semibold">
                {subject.percentage.toFixed(1)}%
              </span>
              <span className="text-dark-500">
                Required: {subject.minRequired}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

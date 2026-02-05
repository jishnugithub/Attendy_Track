'use client'

import { useEffect, useState, useMemo } from 'react'
import { getActiveTimetableConfig, getTimetableSlots, getAttendanceRecords } from '@/lib/supabase'
import { calculateOverallAttendance, calculateSubjectWiseAttendance } from '@/lib/utils'
import type { TimetableConfig, TimetableSlot, AttendanceRecord } from '@/types'
import type { SubjectStats } from '@/types'

import type { View } from '@/types/view'

interface DashboardProps {
  userId: string
  onNavigate: (view: View) => void
}


export default function Dashboard({ userId, onNavigate }: DashboardProps) {
  const [config, setConfig] = useState<TimetableConfig | null>(null)
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubjects, setShowSubjects] = useState(false)

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
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    if (!config || slots.length === 0) {
      return { overall: { percentage: 0, present: 0, total: 0, status: 'safe' as const }, subjects: [] }
    }

    // Transform data for calculations
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

    const overall = calculateOverallAttendance(attendanceData, config.min_attendance)
    const subjects = calculateSubjectWiseAttendance(attendanceData, config.min_attendance)

    return { overall, subjects }
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
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif text-dark-100 mb-2">
            Welcome to AttendTrack
          </h1>
          <p className="text-dark-400 text-lg">
            Let's get started with your attendance tracking
          </p>
        </div>

        <div className="bg-dark-900 rounded-2xl p-12 text-center border border-dark-800">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-dark-100 mb-4">
              Create Your Timetable
            </h2>
            <p className="text-dark-400 mb-8">
              You haven't created a timetable yet. Create one to start tracking your attendance!
            </p>
            <button
              onClick={() => onNavigate('timetable')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Create Timetable
            </button>
          </div>
        </div>
      </div>
    )
  }

  const circumference = 2 * Math.PI * 130
  const progress = (stats.overall.percentage / 100) * circumference

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-dark-100 mb-2">
          Dashboard
        </h1>
        <p className="text-dark-400 text-lg">
          Your attendance overview
        </p>
      </div>

      {/* Main Stats Card */}
      <div className="bg-dark-900 rounded-2xl p-8 border border-dark-800 mb-8">
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowSubjects(!showSubjects)}
        >
          {/* Circular Progress */}
          <div className="relative w-72 h-72 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle
                cx="140"
                cy="140"
                r="130"
                stroke="currentColor"
                strokeWidth="20"
                fill="none"
                className="text-dark-800"
              />
              <circle
                cx="140"
                cy="140"
                r="130"
                stroke="url(#progressGradient)"
                strokeWidth="20"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold font-serif bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent">
                {stats.overall.percentage.toFixed(1)}%
              </div>
              <div className="text-dark-400 text-sm uppercase tracking-wider mt-2">
                Overall Attendance
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <ActionCard
              icon="✓"
              title="Enter Attendance"
              description="Mark today's classes"
              onClick={() => onNavigate('attendance')}
            />
            <ActionCard
              icon="📅"
              title="View Heatmap"
              description="Monthly calendar"
              onClick={() => onNavigate('heatmap')}
            />
            <ActionCard
              icon="📚"
              title="Subject-wise"
              description="Detailed breakdown"
              onClick={() => onNavigate('subjects')}
            />
            <ActionCard
              icon="🗓️"
              title="Edit Timetable"
              description="Manage schedule"
              onClick={() => onNavigate('timetable')}
            />
          </div>
        </div>
      </div>

      {/* Subject-wise Stats */}
      {showSubjects && stats.subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.subjects.map(subject => (
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
      )}
    </div>
  )
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 rounded-xl p-6 transition-all duration-300 hover:scale-105 text-center"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-semibold text-dark-100 mb-1">{title}</div>
      <div className="text-xs text-dark-400">{description}</div>
    </button>
  )
}

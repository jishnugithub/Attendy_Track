'use client'

import { useEffect, useState } from 'react'
import { getActiveTimetableConfig, getTimetableSlots, upsertAttendanceRecord, upsertAttendanceSlot } from '@/lib/supabase'
import { getDayName } from '@/lib/utils'
import type { TimetableConfig, TimetableSlot } from '@/types'

interface AttendanceEntryProps {
  userId: string
}

export default function AttendanceEntry({ userId }: AttendanceEntryProps) {
  const [config, setConfig] = useState<TimetableConfig | null>(null)
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [dayStatus, setDayStatus] = useState<'normal' | 'holiday' | 'absent'>('normal')
  const [slotStatuses, setSlotStatuses] = useState<{ [key: string]: string }>({})
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
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const dayName = getDayName(selectedDate)
  const daySlots = slots.filter(s => s.day_name === dayName)

  async function handleSlotClick(slotId: string, currentStatus: string) {
    let newStatus = ''
    
    if (!currentStatus || currentStatus === '') {
      newStatus = 'present'
    } else if (currentStatus === 'present') {
      newStatus = 'absent'
    } else if (currentStatus === 'absent') {
      newStatus = 'not-considered'
    } else {
      newStatus = ''
    }

    setSlotStatuses({ ...slotStatuses, [slotId]: newStatus })

    // Save to database
    if (config) {
      try {
        const record = await upsertAttendanceRecord(userId, config.id, selectedDate, dayStatus)
        if (newStatus) {
          await upsertAttendanceSlot(record.id, slotId, newStatus as any)
        }
      } catch (error) {
        console.error('Error saving attendance:', error)
      }
    }
  }

  async function handleDayClick() {
    let newDayStatus: 'normal' | 'holiday' | 'absent' = 'normal'
    
    if (dayStatus === 'normal') {
      newDayStatus = 'holiday'
    } else if (dayStatus === 'holiday') {
      newDayStatus = 'absent'
    } else {
      newDayStatus = 'normal'
    }

    setDayStatus(newDayStatus)

    if (config) {
      try {
        await upsertAttendanceRecord(userId, config.id, selectedDate, newDayStatus)
      } catch (error) {
        console.error('Error saving day status:', error)
      }
    }
  }

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
          Enter Attendance
        </h1>
        <p className="text-dark-400 text-lg">
          Mark your attendance for each class
        </p>
      </div>

      <div className="bg-dark-900 rounded-2xl p-8 border border-dark-800">
        {/* Date Picker */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={config.start_date}
            max={new Date().toISOString().split('T')[0]}
            className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500"
          />
          <div className="text-dark-400 text-sm">
            Click slots: Present → Absent → Not Considered → Empty
          </div>
        </div>

        {/* Day Header */}
        <button
          onClick={handleDayClick}
          className={`w-full p-6 rounded-xl mb-8 transition-all duration-300 ${
            dayStatus === 'holiday'
              ? 'bg-blue-500/20 border-2 border-blue-500'
              : dayStatus === 'absent'
              ? 'bg-red-500/20 border-2 border-red-500'
              : 'bg-dark-800 border border-dark-700 hover:border-primary-500'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-dark-100">{dayName}</div>
            <div className="text-dark-400 text-sm">
              {dayStatus === 'holiday' && '🔵 Holiday'}
              {dayStatus === 'absent' && '🔴 Full Day Absent'}
              {dayStatus === 'normal' && 'Click to mark day status'}
            </div>
          </div>
        </button>

        {/* Slots Grid */}
        {daySlots.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {daySlots.map(slot => {
              const status = slotStatuses[slot.id] || ''
              const isLunch = slot.slot_type === 'lunch' || slot.slot_type === 'break'

              return (
                <button
                  key={slot.id}
                  onClick={() => !isLunch && handleSlotClick(slot.id, status)}
                  disabled={isLunch}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    status === 'present'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : status === 'absent'
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : status === 'not-considered'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-dark-800 border-dark-700 hover:border-primary-500'
                  } ${isLunch ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                >
                  <div className="font-semibold text-lg mb-2">
                    {slot.subject}
                  </div>
                  <div className="text-xs opacity-80 mb-3">
                    Slot {slot.slot_number}
                    {isLunch && ' (Not counted)'}
                  </div>
                  {status && !isLunch && (
                    <div className="font-semibold text-sm">
                      {status === 'present' && '✓ Present'}
                      {status === 'absent' && '✗ Absent'}
                      {status === 'not-considered' && '○ Not Considered'}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-dark-400 py-12">
            No classes scheduled for {dayName}
          </p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { getActiveTimetableConfig } from '@/lib/supabase'
import type { TimetableConfig } from '@/types'

interface HeatmapProps {
  userId: string
}

export default function Heatmap({ userId }: HeatmapProps) {
  const [config, setConfig] = useState<TimetableConfig | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [userId])

  async function loadData() {
    try {
      const timetableConfig = await getActiveTimetableConfig(userId)
      setConfig(timetableConfig)
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
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

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-dark-100 mb-2">
          Monthly Heatmap
        </h1>
        <p className="text-dark-400 text-lg">
          Visual attendance calendar
        </p>
      </div>

      <div className="bg-dark-900 rounded-2xl p-8 border border-dark-800">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevMonth}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl transition-all duration-300"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-dark-100">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl transition-all duration-300"
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-dark-400 text-sm py-2">
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = dateStr === new Date().toISOString().split('T')[0]

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center bg-dark-800 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isToday ? 'border-2 border-primary-500' : 'border border-dark-700'
                }`}
              >
                <div className="font-semibold text-dark-100">{day}</div>
                <div className="text-xs text-dark-400 mt-1">-</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

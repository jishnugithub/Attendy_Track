'use client'

import { useEffect, useState } from 'react'
import {
  getActiveTimetableConfig,
  getTimetableSlots,
  createTimetableConfig,
  createTimetableSlot,
  deleteTimetableConfig,
} from '@/lib/supabase'
import type { TimetableConfig, TimetableSlot } from '@/types'

interface TimetableProps {
  userId: string
}

export default function Timetable({ userId }: TimetableProps) {
  const [config, setConfig] = useState<TimetableConfig | null>(null)
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [workingDays, setWorkingDays] = useState<5 | 6>(6)
  const [slotsPerDay, setSlotsPerDay] = useState(8)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [minAttendance, setMinAttendance] = useState(75)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [editingSlot, setEditingSlot] = useState<{ day: string; slots: number[] } | null>(null)
  const [subjectInput, setSubjectInput] = useState('')
  const [typeInput, setTypeInput] = useState('class')
  const [loading, setLoading] = useState(true)

  const days = workingDays === 5
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => {
    loadTimetable()
  }, [userId])

  async function loadTimetable() {
    try {
      const timetableConfig = await getActiveTimetableConfig(userId)
      
      if (timetableConfig) {
        setConfig(timetableConfig)
        setWorkingDays(timetableConfig.working_days as 5 | 6)
        setSlotsPerDay(timetableConfig.slots_per_day)
        setStartDate(timetableConfig.start_date)
        setMinAttendance(timetableConfig.min_attendance)

        const timetableSlots = await getTimetableSlots(timetableConfig.id)
        setSlots(timetableSlots)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading timetable:', error)
      setLoading(false)
    }
  }

  async function handleSaveTimetable() {
    try {
      if (!config) {
        // Create new config
        const newConfig = await createTimetableConfig(userId, {
          working_days: workingDays,
          slots_per_day: slotsPerDay,
          start_date: startDate,
          min_attendance: minAttendance,
        })
        setConfig(newConfig)
        alert('Timetable configuration saved!')
      } else {
        // Update existing - for now just alert
        alert('Timetable updated!')
      }
    } catch (error) {
      console.error('Error saving timetable:', error)
      alert('Failed to save timetable')
    }
  }

  async function handleDeleteTimetable() {
    if (!config) return

    if (!confirm('Are you sure? This will delete all attendance data.')) {
      return
    }

    try {
      await deleteTimetableConfig(config.id)
      setConfig(null)
      setSlots([])
      alert('Timetable deleted successfully')
    } catch (error) {
      console.error('Error deleting timetable:', error)
      alert('Failed to delete timetable')
    }
  }

  function handleSlotClick(day: string, slotNum: number) {
    const slotKey = `${day}_${slotNum}`
    if (selectedSlots.includes(slotKey)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slotKey))
    } else {
      const daySlots = selectedSlots.filter(s => s.startsWith(day))
      setSelectedSlots([...daySlots, slotKey])
    }
  }

  function handleMergeSlots() {
    if (selectedSlots.length === 0) return

    const day = selectedSlots[0].split('_')[0]
    const slotNumbers = selectedSlots.map(s => parseInt(s.split('_')[1])).sort((a, b) => a - b)

    setSubjectInput('')
    setTypeInput('class')
    setEditingSlot({ day, slots: slotNumbers })
  }

  async function saveSlot(subject: string, type: string) {
    if (!editingSlot || !config) return

    try {
      for (const slotNum of editingSlot.slots) {
        await createTimetableSlot(config.id, {
          day_name: editingSlot.day as any,
          slot_number: slotNum,
          subject,
          slot_type: type as any,
        })
      }

      await loadTimetable()
      setEditingSlot(null)
      setSelectedSlots([])
      alert('Slot saved successfully!')
    } catch (error) {
      console.error('Error saving slot:', error)
      alert('Failed to save slot')
    }
  }

  function getSlotData(day: string, slotNum: number) {
    return slots.find(s => s.day_name === day && s.slot_number === slotNum)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-dark-100 mb-2">
          Timetable
        </h1>
        <p className="text-dark-400 text-lg">
          Create and manage your class schedule
        </p>
      </div>

      <div className="bg-dark-900 rounded-2xl p-8 border border-dark-800">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 uppercase tracking-wider">
              Working Days
            </label>
            <select
              value={workingDays}
              onChange={(e) => setWorkingDays(parseInt(e.target.value) as 5 | 6)}
              disabled={!!config}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500 disabled:opacity-50"
            >
              <option value={5}>5 Days</option>
              <option value={6}>6 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 uppercase tracking-wider">
              Slots Per Day
            </label>
            <input
              type="number"
              value={slotsPerDay}
              onChange={(e) => setSlotsPerDay(parseInt(e.target.value))}
              min={4}
              max={12}
              disabled={!!config}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-300 mb-2 uppercase tracking-wider">
              Min Attendance (%)
            </label>
            <input
              type="number"
              value={minAttendance}
              onChange={(e) => setMinAttendance(parseInt(e.target.value))}
              min={0}
              max={100}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {selectedSlots.length > 0 && (
            <button
              onClick={handleMergeSlots}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Edit Selected Slots ({selectedSlots.length})
            </button>
          )}
          <button
            onClick={handleSaveTimetable}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Save Timetable
          </button>
          {config && (
            <button
              onClick={handleDeleteTimetable}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Delete Timetable
            </button>
          )}
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto rounded-xl border border-dark-700">
          <table className="w-full">
            <thead>
              <tr>
                <th className="bg-dark-800 px-4 py-3 text-left font-semibold text-dark-300 border-b border-dark-700">
                  Day
                </th>
                {Array.from({ length: slotsPerDay }, (_, i) => (
                  <th
                    key={i}
                    className="bg-dark-800 px-4 py-3 text-center font-semibold text-dark-300 border-b border-dark-700"
                  >
                    Slot {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td className="bg-dark-800 px-4 py-3 font-semibold text-dark-200 border-b border-dark-700">
                    {day}
                  </td>
                  {Array.from({ length: slotsPerDay }, (_, i) => {
                    const slotNum = i + 1
                    const slotData = getSlotData(day, slotNum)
                    const isSelected = selectedSlots.includes(`${day}_${slotNum}`)

                    return (
                      <td key={i} className="border-b border-dark-700 p-0">
                        <button
                          onClick={() => handleSlotClick(day, slotNum)}
                          className={`w-full h-20 p-2 transition-all duration-200 ${
                            isSelected
                              ? 'bg-primary-500/20 border-2 border-primary-500'
                              : slotData
                              ? 'bg-dark-800 hover:bg-dark-700'
                              : 'bg-dark-900 hover:bg-dark-800'
                          }`}
                        >
                          {slotData && (
                            <div className="text-center">
                              <div className="font-semibold text-dark-100 text-sm">
                                {slotData.subject}
                              </div>
                              <div className="text-xs text-dark-400 uppercase">
                                {slotData.slot_type}
                              </div>
                            </div>
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setEditingSlot(null)}>
          <div className="bg-dark-900 rounded-2xl p-8 max-w-md w-full border border-dark-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold font-serif text-dark-100 mb-4">
              Edit Slot
            </h2>
            <p className="text-dark-400 mb-6">
              {editingSlot.day} - Slots {editingSlot.slots.join(', ')}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-300 mb-2">
                  Subject / Period Type
                </label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="e.g., Mathematics, Lunch, Free Period"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-300 mb-2">
                  Type
                </label>
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 focus:outline-none focus:border-primary-500"
                >
                  <option value="class">Class</option>
                  <option value="lunch">Lunch</option>
                  <option value="break">Break</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (subjectInput.trim()) {
                    saveSlot(subjectInput, typeInput)
                  }
                }}
                disabled={!subjectInput.trim()}
                className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300"
              >
                Save Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

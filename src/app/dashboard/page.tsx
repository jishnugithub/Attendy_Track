'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, signOut } from '@/lib/supabase'

import Dashboard from '@/components/Dashboard'
import Timetable from '@/components/Timetable'
import AttendanceEntry from '@/components/AttendanceEntry'
import Heatmap from '@/components/Heatmap'
import SubjectStats from '@/components/SubjectStats'

import type { User } from '@/types'
import type { View } from '@/types/view'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        setLoading(false)
        router.push('/auth/login')
        return
      }

      const u = data.user

      setUser({
        id: u.id,
        email: u.email || '',
        full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
        avatar_url: u.user_metadata?.avatar_url || ''
      })
    } catch (err) {
      console.error('Supabase Auth Error:', err)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-dark-950 flex">

      {/* Sidebar */}
      <aside className="w-72 bg-dark-900 border-r border-dark-800 p-6 flex flex-col">

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent">
            AttendTrack
          </h1>
        </div>

        {/* User Info */}
        <div className="mb-8 p-4 bg-dark-800 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold">
            {user.full_name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-dark-100 truncate">
              {user.full_name}
            </div>
            <div className="text-xs text-dark-400 truncate">
              {user.email}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem icon="📊" label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <NavItem icon="✓" label="Enter Attendance" active={currentView === 'attendance'} onClick={() => setCurrentView('attendance')} />
            <NavItem icon="📅" label="Monthly Heatmap" active={currentView === 'heatmap'} onClick={() => setCurrentView('heatmap')} />
            <NavItem icon="📚" label="Subject-wise" active={currentView === 'subjects'} onClick={() => setCurrentView('subjects')} />
            <NavItem icon="🗓️" label="Timetable" active={currentView === 'timetable'} onClick={() => setCurrentView('timetable')} />
            <NavItem icon="📁" label="Logs" active={currentView === 'logs'} onClick={() => setCurrentView('logs')} />
          </ul>
        </nav>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full mt-6 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-semibold transition-all border border-red-500/30 hover:border-red-500"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">

          {currentView === 'dashboard' && <Dashboard userId={user.id} onNavigate={setCurrentView} />}
          {currentView === 'attendance' && <AttendanceEntry userId={user.id} />}
          {currentView === 'heatmap' && <Heatmap userId={user.id} />}
          {currentView === 'subjects' && <SubjectStats userId={user.id} />}
          {currentView === 'timetable' && <Timetable userId={user.id} />}
          {currentView === 'logs' && <LogsView userId={user.id} />}

        </div>
      </main>

    </div>
  )
}

/* Navigation Item */
function NavItem({ icon, label, active, onClick }: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
          active
            ? 'bg-gradient-to-r from-primary-500/20 to-primary-400/20 text-primary-400 border border-primary-500/30'
            : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  )
}

/* Logs View */
function LogsView({ userId }: { userId: string }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-dark-100 mb-2">
          Attendance Logs
        </h1>
        <p className="text-dark-400 text-lg">
          View your historical attendance records
        </p>
      </div>

      <div className="bg-dark-900 rounded-2xl p-8 border border-dark-800">
        <p className="text-center text-dark-400 py-12">
          No logs yet. End your current attendance tracking to create a log.
        </p>
      </div>
    </div>
  )
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for authentication
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  
  return user
}

// Database helper functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

export const getActiveTimetableConfig = async (userId: string) => {
  const { data, error } = await supabase
    .from('timetable_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching timetable config:', error)
    return null
  }
  
  return data
}

export const getTimetableSlots = async (configId: string) => {
  const { data, error } = await supabase
    .from('timetable_slots')
    .select('*')
    .eq('config_id', configId)
    .order('day_name')
    .order('slot_number')
  
  if (error) {
    console.error('Error fetching timetable slots:', error)
    return []
  }
  
  return data
}

export const getAttendanceRecords = async (userId: string, configId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      attendance_slots (
        *,
        slot:timetable_slots (*)
      )
    `)
    .eq('user_id', userId)
    .eq('config_id', configId)
  
  if (startDate) {
    query = query.gte('date', startDate)
  }
  
  if (endDate) {
    query = query.lte('date', endDate)
  }
  
  const { data, error } = await query.order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching attendance records:', error)
    return []
  }
  
  return data
}

export const createTimetableConfig = async (userId: string, config: {
  working_days: number
  slots_per_day: number
  start_date: string
  min_attendance: number
}) => {
  // First, deactivate any existing active configs
  await supabase
    .from('timetable_configs')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)
  
  // Create new config
  const { data, error } = await supabase
    .from('timetable_configs')
    .insert({
      user_id: userId,
      ...config,
      is_active: true,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating timetable config:', error)
    throw error
  }
  
  return data
}

export const createTimetableSlot = async (configId: string, slot: {
  day_name: string
  slot_number: number
  subject: string
  slot_type: string
}) => {
  const { data, error } = await supabase
    .from('timetable_slots')
    .insert({
      config_id: configId,
      ...slot,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating timetable slot:', error)
    throw error
  }
  
  return data
}

export const upsertAttendanceRecord = async (
  userId: string,
  configId: string,
  date: string,
  dayStatus?: string
) => {
  const { data, error } = await supabase
    .from('attendance_records')
    .upsert({
      user_id: userId,
      config_id: configId,
      date,
      day_status: dayStatus || 'normal',
    }, {
      onConflict: 'user_id,config_id,date'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting attendance record:', error)
    throw error
  }
  
  return data
}

export const upsertAttendanceSlot = async (
  attendanceRecordId: string,
  slotId: string,
  status: string
) => {
  const { data, error } = await supabase
    .from('attendance_slots')
    .upsert({
      attendance_record_id: attendanceRecordId,
      slot_id: slotId,
      status,
    }, {
      onConflict: 'attendance_record_id,slot_id'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting attendance slot:', error)
    throw error
  }
  
  return data
}

export const deleteTimetableConfig = async (configId: string) => {
  // This will cascade delete all slots and attendance records
  const { error } = await supabase
    .from('timetable_configs')
    .delete()
    .eq('id', configId)
  
  if (error) {
    console.error('Error deleting timetable config:', error)
    throw error
  }
}

export const createAttendanceLog = async (userId: string, log: {
  log_name: string
  start_date: string
  end_date: string
  data: any
}) => {
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert({
      user_id: userId,
      ...log,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating attendance log:', error)
    throw error
  }
  
  return data
}

export const getAttendanceLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching attendance logs:', error)
    return []
  }
  
  return data
}

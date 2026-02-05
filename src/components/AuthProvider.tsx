'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email)
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}

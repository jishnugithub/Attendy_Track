import type { Metadata } from 'next'
import { DM_Sans, Crimson_Pro } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const crimsonPro = Crimson_Pro({ 
  subsets: ['latin'],
  variable: '--font-crimson-pro',
})

export const metadata: Metadata = {
  title: 'AttendTrack - Student Attendance Tracker',
  description: 'Track your class attendance with ease',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${crimsonPro.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

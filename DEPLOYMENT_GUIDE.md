# Complete Deployment Guide: Attendance Tracker with Google OAuth

## 📋 Table of Contents
1. [Google OAuth Setup](#google-oauth-setup)
2. [Project Structure for Vercel](#project-structure)
3. [Backend Setup (Supabase)](#backend-setup)
4. [Frontend Configuration](#frontend-configuration)
5. [Vercel Deployment](#vercel-deployment)
6. [Testing & Troubleshooting](#testing)

---

## 🔐 PART 1: Google OAuth Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Navigate to: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click on the project dropdown (top left, next to "Google Cloud")
   - Click "NEW PROJECT"
   - Enter project name: `attendance-tracker`
   - Click "CREATE"
   - Wait for project creation (15-30 seconds)

3. **Select Your Project**
   - Click the project dropdown again
   - Select your newly created project

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"
   - Or use direct link: https://console.cloud.google.com/apis/library

2. **Enable Required APIs**
   - Search for "Google+ API"
   - Click on it and click "ENABLE"
   - Also search and enable "Google Identity Services"

### Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Left sidebar: "APIs & Services" → "OAuth consent screen"
   - Or: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - Select "External" (allows anyone with a Google account)
   - Click "CREATE"

3. **Fill App Information**
   ```
   App name: Attendance Tracker
   User support email: [Your email]
   Developer contact: [Your email]
   ```

4. **App Domain (Optional for testing)**
   - Skip for now, add later when deploying

5. **Scopes**
   - Click "ADD OR REMOVE SCOPES"
   - Select these scopes:
     * `.../auth/userinfo.email`
     * `.../auth/userinfo.profile`
   - Click "UPDATE"

6. **Test Users (for development)**
   - Click "ADD USERS"
   - Add your email address
   - Click "SAVE AND CONTINUE"

7. **Summary**
   - Review and click "BACK TO DASHBOARD"

### Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Left sidebar: "APIs & Services" → "Credentials"
   - Or: https://console.cloud.google.com/apis/credentials

2. **Create OAuth Client ID**
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"

3. **Configure Client ID**
   ```
   Application type: Web application
   Name: Attendance Tracker Web Client
   ```

4. **Authorized JavaScript Origins**
   - For development:
     ```
     http://localhost:3000
     http://localhost:5173
     ```
   - For production (add later):
     ```
     https://your-app-name.vercel.app
     ```

5. **Authorized Redirect URIs**
   - For development:
     ```
     http://localhost:3000/auth/callback
     ```
   - For production (add later):
     ```
     https://your-app-name.vercel.app/auth/callback
     ```

6. **Create**
   - Click "CREATE"
   - **IMPORTANT**: Copy your credentials:
     * Client ID: `xxxxx.apps.googleusercontent.com`
     * Client Secret: `GOCSPX-xxxxx`
   - **Save these securely!**

### Step 5: Update OAuth Consent for Production

**After deploying to Vercel**, go back to:

1. **OAuth Consent Screen** → Edit App
   - Add your Vercel domain to "Authorized domains"
   - Example: `your-app.vercel.app`

2. **Credentials** → Edit OAuth Client
   - Add production URLs to:
     * Authorized JavaScript origins: `https://your-app.vercel.app`
     * Authorized redirect URIs: `https://your-app.vercel.app/auth/callback`

---

## 🗂️ PART 2: Project Structure for Vercel

### Step 1: Set Up Project Directory

```bash
# Create project directory
mkdir attendance-tracker-app
cd attendance-tracker-app

# Initialize git
git init

# Initialize npm project
npm init -y
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install next react react-dom

# Authentication
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Google OAuth
npm install @react-oauth/google

# UI/Styling
npm install tailwindcss postcss autoprefixer

# Date utilities
npm install date-fns

# Development dependencies
npm install --save-dev @types/node @types/react @types/react-dom typescript
```

### Step 3: Project Structure

```
attendance-tracker-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts
│   ├── components/
│   │   ├── AuthProvider.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Timetable.tsx
│   │   ├── AttendanceEntry.tsx
│   │   ├── Heatmap.tsx
│   │   └── SubjectStats.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🗄️ PART 3: Backend Setup (Supabase)

### Step 1: Create Supabase Project

1. **Go to Supabase**
   - Navigate to: https://supabase.com/
   - Click "Start your project"
   - Sign in with GitHub

2. **Create New Project**
   - Click "New project"
   - Organization: Select or create
   - Project name: `attendance-tracker`
   - Database password: **Save this securely!**
   - Region: Choose closest to your users
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get API Keys**
   - Go to "Settings" → "API"
   - Copy these values:
     * Project URL: `https://xxxxx.supabase.co`
     * Anon/Public Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     * Service Role Key: (keep secret, only for server-side)

### Step 2: Set Up Database Schema

1. **Go to SQL Editor**
   - Left sidebar: "SQL Editor"
   - Click "New query"

2. **Run This SQL**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Timetable configurations
CREATE TABLE public.timetable_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    working_days INTEGER NOT NULL CHECK (working_days IN (5, 6)),
    slots_per_day INTEGER NOT NULL CHECK (slots_per_day BETWEEN 4 AND 12),
    start_date DATE NOT NULL,
    min_attendance INTEGER DEFAULT 75 CHECK (min_attendance BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Timetable slots
CREATE TABLE public.timetable_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    config_id UUID REFERENCES public.timetable_configs ON DELETE CASCADE NOT NULL,
    day_name TEXT NOT NULL CHECK (day_name IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    slot_number INTEGER NOT NULL,
    subject TEXT NOT NULL,
    slot_type TEXT DEFAULT 'class' CHECK (slot_type IN ('class', 'lunch', 'break')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Attendance records
CREATE TABLE public.attendance_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    config_id UUID REFERENCES public.timetable_configs ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    day_status TEXT CHECK (day_status IN ('normal', 'holiday', 'absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, config_id, date)
);

-- Individual slot attendance
CREATE TABLE public.attendance_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attendance_record_id UUID REFERENCES public.attendance_records ON DELETE CASCADE NOT NULL,
    slot_id UUID REFERENCES public.timetable_slots NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'not-considered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(attendance_record_id, slot_id)
);

-- Attendance logs (archived records)
CREATE TABLE public.attendance_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    log_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    data JSONB NOT NULL, -- Stores complete timetable and attendance data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_timetable_configs_user ON public.timetable_configs(user_id);
CREATE INDEX idx_timetable_configs_active ON public.timetable_configs(user_id, is_active);
CREATE INDEX idx_timetable_slots_config ON public.timetable_slots(config_id);
CREATE INDEX idx_attendance_records_user_date ON public.attendance_records(user_id, date);
CREATE INDEX idx_attendance_records_config ON public.attendance_records(config_id);
CREATE INDEX idx_attendance_slots_record ON public.attendance_slots(attendance_record_id);
CREATE INDEX idx_attendance_logs_user ON public.attendance_logs(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for timetable_configs
CREATE POLICY "Users can view own configs"
    ON public.timetable_configs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configs"
    ON public.timetable_configs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configs"
    ON public.timetable_configs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configs"
    ON public.timetable_configs FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for timetable_slots
CREATE POLICY "Users can view own slots"
    ON public.timetable_slots FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.timetable_configs
        WHERE id = config_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own slots"
    ON public.timetable_slots FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.timetable_configs
        WHERE id = config_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update own slots"
    ON public.timetable_slots FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.timetable_configs
        WHERE id = config_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own slots"
    ON public.timetable_slots FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.timetable_configs
        WHERE id = config_id AND user_id = auth.uid()
    ));

-- RLS Policies for attendance_records
CREATE POLICY "Users can view own attendance"
    ON public.attendance_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance"
    ON public.attendance_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance"
    ON public.attendance_records FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own attendance"
    ON public.attendance_records FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for attendance_slots
CREATE POLICY "Users can view own attendance slots"
    ON public.attendance_slots FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.attendance_records
        WHERE id = attendance_record_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own attendance slots"
    ON public.attendance_slots FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.attendance_records
        WHERE id = attendance_record_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update own attendance slots"
    ON public.attendance_slots FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.attendance_records
        WHERE id = attendance_record_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own attendance slots"
    ON public.attendance_slots FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.attendance_records
        WHERE id = attendance_record_id AND user_id = auth.uid()
    ));

-- RLS Policies for attendance_logs
CREATE POLICY "Users can view own logs"
    ON public.attendance_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
    ON public.attendance_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.timetable_configs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.attendance_slots
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

3. **Click "RUN"**
   - Wait for success message
   - Check "Table Editor" to verify tables were created

### Step 3: Configure Google OAuth in Supabase

1. **Go to Authentication**
   - Left sidebar: "Authentication" → "Providers"

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it ON
   - Enter your Google OAuth credentials:
     * Client ID: (from Google Cloud Console)
     * Client Secret: (from Google Cloud Console)
   - Click "Save"

3. **Configure Redirect URL**
   - Note the Callback URL shown:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
   - Add this to your Google OAuth Authorized Redirect URIs

---

## ⚙️ PART 4: Frontend Configuration

### Step 1: Environment Variables

Create `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Create `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel
```

### Step 3: Next.js Configuration

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile images
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
}

module.exports = nextConfig
```

### Step 4: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 5: Tailwind Configuration

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
}
```

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0a0e17;
  --bg-secondary: #121827;
  --bg-tertiary: #1a2234;
  --accent-primary: #6366f1;
}

body {
  background: var(--bg-primary);
  color: white;
}
```

### Step 6: Supabase Client Setup

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 7: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🚀 PART 5: Vercel Deployment

### Step 1: Prepare for Deployment

1. **Initialize Git Repository**
```bash
git add .
git commit -m "Initial commit: Attendance tracker with Google OAuth"
```

2. **Push to GitHub**
```bash
# Create new repo on GitHub first, then:
git remote add origin https://github.com/yourusername/attendance-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. **Go to Vercel**
   - Navigate to: https://vercel.com/
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
     NEXT_PUBLIC_GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
     NEXT_PUBLIC_SITE_URL = https://your-app.vercel.app
     ```
   - **Important**: Add for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Get your deployment URL: `https://your-app.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? [Your account]
# Link to existing project? No
# Project name? attendance-tracker
# Directory? ./
# Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter value when prompted
# Repeat for all env vars

# Deploy to production
vercel --prod
```

### Step 3: Post-Deployment Configuration

1. **Update Google OAuth**
   - Go to Google Cloud Console → Credentials
   - Edit your OAuth Client
   - Add to Authorized JavaScript origins:
     ```
     https://your-app.vercel.app
     ```
   - Add to Authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     https://your-app.vercel.app/auth/callback
     ```
   - Save

2. **Update Supabase**
   - Go to Supabase → Authentication → URL Configuration
   - Add Site URL: `https://your-app.vercel.app`
   - Add Redirect URLs:
     ```
     https://your-app.vercel.app/**
     ```

3. **Test OAuth Flow**
   - Visit your Vercel URL
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify you're redirected back

### Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update All OAuth URLs**
   - Update Google OAuth with new domain
   - Update Supabase URLs
   - Update environment variables

---

## 🧪 PART 6: Testing & Troubleshooting

### Local Testing

```bash
# Start development server
npm run dev

# Open browser
# Navigate to: http://localhost:3000
```

### Common Issues & Solutions

#### Issue 1: "OAuth Error: redirect_uri_mismatch"

**Solution:**
- Check Google Cloud Console → Credentials
- Ensure ALL redirect URIs are added correctly
- Include both `http://localhost:3000` (dev) and production URL
- Include Supabase callback URL

#### Issue 2: "Invalid API key" in Supabase

**Solution:**
- Verify `.env.local` has correct values
- Check Supabase dashboard for correct keys
- Ensure keys are set in Vercel environment variables
- Redeploy after updating env vars

#### Issue 3: "CORS Error"

**Solution:**
- Add your domain to Supabase allowed origins
- Go to Supabase → Settings → API → CORS
- Add your Vercel URL

#### Issue 4: Build fails on Vercel

**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint

# Fix all errors before deploying
```

#### Issue 5: Google OAuth not working after deployment

**Solution:**
1. Clear browser cache
2. Check browser console for errors
3. Verify all OAuth URLs in Google Console
4. Check Supabase Auth logs for errors
5. Ensure environment variables are set correctly

### Testing Checklist

- [ ] Sign up with Google works
- [ ] Sign in with existing Google account works
- [ ] User profile is created in Supabase
- [ ] Can create timetable
- [ ] Can mark attendance
- [ ] Data persists after refresh
- [ ] Can view all pages
- [ ] Mobile responsive
- [ ] Can end attendance and save log
- [ ] Can view historical logs

---

## 📱 Additional Features to Implement

### Email Notifications (Optional)

1. **Set up SendGrid/Resend**
2. **Create API routes for:**
   - Attendance shortage alerts
   - Weekly summaries
   - End of term reports

### PWA Support (Optional)

Create `public/manifest.json`:
```json
{
  "name": "Attendance Tracker",
  "short_name": "AttendTrack",
  "description": "Track your class attendance",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0e17",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### PDF Export Feature

```bash
npm install jspdf jspdf-autotable
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to Git
2. **Use Row Level Security** (RLS) in Supabase
3. **Validate all user input** on both client and server
4. **Rate limit API routes** to prevent abuse
5. **Keep dependencies updated**: `npm audit fix`
6. **Use HTTPS only** in production
7. **Implement CSRF protection** for forms
8. **Set secure headers** in Next.js

---

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Supabase Logs
- Monitor auth attempts
- Track database queries
- Set up alerts for errors

---

## 🎉 Success!

Your attendance tracker should now be:
- ✅ Live on Vercel
- ✅ Using Google OAuth
- ✅ Connected to Supabase
- ✅ Production-ready
- ✅ Secure and scalable

**Live URL**: `https://your-app.vercel.app`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💬 Support

If you encounter issues:
1. Check browser console for errors
2. Review Vercel deployment logs
3. Check Supabase logs
4. Verify all environment variables
5. Test locally first before deploying

---

**Created**: January 2026  
**Version**: 1.0  
**Status**: Production Ready ✅

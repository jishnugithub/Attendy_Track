# 🎓 Attendance Tracker - Complete Setup Guide

> **Production-Ready Attendance Monitoring System with Google OAuth & Vercel Deployment**

A modern, feature-rich web application for engineering students to track their class attendance with Google authentication and cloud database storage.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Quick Start (5 minutes)](#quick-start)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Supabase Setup](#supabase-setup)
5. [Local Development](#local-development)
6. [Vercel Deployment](#vercel-deployment)
7. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Functionality
- ✅ **Google OAuth Authentication** - Secure sign-in with Google account
- ✅ **Timetable Creation** - Custom grid-based schedule with mergeable slots
- ✅ **Attendance Tracking** - Mark present/absent/not-considered for each class
- ✅ **Subject-wise Analytics** - Individual tracking per subject
- ✅ **Monthly Heatmap** - Visual calendar with attendance percentages
- ✅ **Historical Logs** - Save and view past attendance records
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- 🔐 Secure authentication with Row-Level Security (RLS)
- 📊 Real-time attendance calculations
- 💾 Cloud database with Supabase
- 🎨 Modern UI with Tailwind CSS
- 🚀 Deployed on Vercel edge network
- 📱 Progressive Web App (PWA) ready

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Google account
- GitHub account (for Vercel deployment)

### Step 1: Clone the Project
```bash
# Download the project files
cd attendance-tracker-nextjs

# Install dependencies
npm install
```

### Step 2: Get Google OAuth Credentials

1. Go to **Google Cloud Console**: https://console.cloud.google.com/
2. Create a new project: `attendance-tracker`
3. Enable **Google+ API**
4. Go to **OAuth consent screen** → Create External app
5. Go to **Credentials** → Create OAuth 2.0 Client ID
   - Type: Web application
   - Authorized origins: `http://localhost:3000`
   - Authorized redirects: `http://localhost:3000/auth/callback`
6. **Copy your Client ID** (format: `xxxxx.apps.googleusercontent.com`)

### Step 3: Create Supabase Project

1. Go to **Supabase**: https://supabase.com/
2. Create new project: `attendance-tracker`
3. Wait 2-3 minutes for setup
4. Go to **Settings** → **API**
5. **Copy these values**:
   - Project URL
   - Anon public key

### Step 4: Run Database Setup

1. In Supabase, go to **SQL Editor**
2. Open the file `DEPLOYMENT_GUIDE.md`
3. Copy the entire SQL schema from "Step 2: Set Up Database Schema"
4. Paste and **Run** in SQL Editor

### Step 5: Enable Google Auth in Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Google**
3. Enter your Google Client ID and Secret
4. Note the Callback URL shown
5. Add this callback URL to Google OAuth redirect URIs

### Step 6: Configure Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 7: Run Locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser! 🎉

---

## 🔐 Google OAuth Setup (Detailed)

### Step 1: Create Google Cloud Project

1. Navigate to: https://console.cloud.google.com/
2. Click project dropdown → **NEW PROJECT**
3. Project name: `attendance-tracker`
4. Click **CREATE** and wait 15-30 seconds

### Step 2: Enable Required APIs

1. Go to **APIs & Services** → **Library**
2. Search and enable:
   - Google+ API
   - Google Identity Services

### Step 3: Configure OAuth Consent Screen

1. Go to **OAuth consent screen**
2. User Type: **External**
3. Fill required fields:
   ```
   App name: Attendance Tracker
   User support email: your-email@gmail.com
   Developer contact: your-email@gmail.com
   ```
4. Scopes → Add:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Test users → Add your email
6. Click **SAVE AND CONTINUE**

### Step 4: Create OAuth Credentials

1. Go to **Credentials** → **CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Attendance Tracker Web Client`
4. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:5173
   https://your-app.vercel.app  (add after deployment)
   ```
5. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   https://your-project.supabase.co/auth/v1/callback
   https://your-app.vercel.app/auth/callback  (add after deployment)
   ```
6. Click **CREATE**
7. **SAVE YOUR CREDENTIALS**:
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxx`

---

## 🗄️ Supabase Setup (Detailed)

### Step 1: Create Project

1. Go to: https://supabase.com/
2. Sign in with GitHub
3. Click **New project**
4. Fill details:
   ```
   Name: attendance-tracker
   Database Password: [Create strong password]
   Region: [Choose closest to you]
   ```
5. Click **Create new project**
6. Wait 2-3 minutes

### Step 2: Set Up Database

1. Go to **SQL Editor** → **New query**
2. Copy the entire SQL from `DEPLOYMENT_GUIDE.md` Part 3, Step 2
3. Click **RUN** (or press Ctrl+Enter)
4. Verify: Go to **Table Editor** → You should see 6 tables

### Step 3: Configure Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** → Toggle ON
3. Enter credentials:
   ```
   Client ID: [from Google Cloud]
   Client Secret: [from Google Cloud]
   ```
4. Note the Callback URL:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
5. Add this URL to Google OAuth redirect URIs
6. Click **Save**

### Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Add to `.env.local`

---

## 💻 Local Development

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

### Running the App

```bash
# Development mode (with hot reload)
npm run dev

# Production build (test before deploying)
npm run build
npm start

# Lint check
npm run lint
```

### Project Structure

```
attendance-tracker-nextjs/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   ├── globals.css   # Global styles
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── auth/         # Auth routes
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   │   ├── supabase.ts   # Supabase client
│   │   └── utils.ts      # Helper functions
│   └── types/            # TypeScript types
├── public/               # Static assets
├── .env.local           # Environment variables
├── next.config.js       # Next.js config
├── tailwind.config.js   # Tailwind config
└── package.json         # Dependencies
```

---

## 🚀 Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/attendance-tracker.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Vercel

1. Go to: https://vercel.com/
2. Sign in with GitHub
3. Click **Add New...** → **Project**
4. Select your repository
5. Click **Import**
6. **Configure project**:
   ```
   Framework: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

#### Step 3: Add Environment Variables

In Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_SITE_URL = https://your-app.vercel.app
```

**Important**: Add to all environments (Production, Preview, Development)

#### Step 4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes
3. Get your URL: `https://your-app.vercel.app`

#### Step 5: Update OAuth URLs

**Google Cloud Console**:
1. Go to Credentials → Edit OAuth Client
2. Add to **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```
3. Add to **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```

**Supabase**:
1. Go to Authentication → URL Configuration
2. Add **Site URL**: `https://your-app.vercel.app`
3. Add **Redirect URLs**: `https://your-app.vercel.app/**`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter value when prompted
# Repeat for all env vars

# Deploy to production
vercel --prod
```

---

## 🔧 Troubleshooting

### Issue: "OAuth Error: redirect_uri_mismatch"

**Solution**:
1. Check Google Cloud Console → Credentials
2. Ensure ALL redirect URIs are added:
   - `http://localhost:3000/auth/callback` (dev)
   - `https://your-project.supabase.co/auth/v1/callback`
   - `https://your-app.vercel.app/auth/callback` (prod)
3. Wait 5 minutes for changes to propagate
4. Clear browser cache and try again

### Issue: "Invalid API key"

**Solution**:
1. Verify `.env.local` has correct keys
2. Check Supabase dashboard → Settings → API
3. Ensure keys match exactly (no extra spaces)
4. Restart dev server: `npm run dev`
5. For Vercel: Update env vars and redeploy

### Issue: Build fails on Vercel

**Solution**:
```bash
# Test build locally first
npm run build

# Fix any TypeScript errors
npm run lint

# Check for missing dependencies
npm install

# Try deploying again
vercel --prod
```

### Issue: Google sign-in not working

**Solution**:
1. Open browser console (F12)
2. Check for specific error messages
3. Verify Google OAuth is enabled in Supabase
4. Check that Client ID matches in both places
5. Ensure callback URLs are correct
6. Try incognito/private browsing mode

### Issue: Database connection error

**Solution**:
1. Check Supabase project status (is it paused?)
2. Verify Project URL in `.env.local`
3. Check Row Level Security policies are set
4. Review Supabase logs for specific errors

### Issue: "User already registered" error

**Solution**:
- This means email is already in the system
- Use "Sign In" instead of "Sign Up"
- Or use a different email address

---

## 📱 Testing Checklist

Before going live, test:

- [ ] Google sign-in works
- [ ] User profile created in database
- [ ] Can create timetable
- [ ] Can mark attendance
- [ ] Data persists after page refresh
- [ ] Subject-wise stats calculate correctly
- [ ] Monthly heatmap displays properly
- [ ] Can end attendance and create log
- [ ] Can view historical logs
- [ ] Mobile responsive on phone
- [ ] Works in different browsers
- [ ] Sign out works correctly

---

## 🎯 Next Steps

After deployment, consider adding:

1. **Email Notifications**
   - Attendance shortage alerts
   - Weekly summaries

2. **PWA Support**
   - Install on mobile home screen
   - Offline functionality

3. **Export Features**
   - PDF reports
   - CSV exports
   - Share attendance summary

4. **Analytics**
   - Track usage
   - Monitor performance

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Review Vercel deployment logs
3. Check Supabase logs in dashboard
4. Verify all environment variables
5. Test locally before deploying

---

## 🔒 Security Notes

- Never commit `.env.local` to Git
- Use strong database passwords
- Enable 2FA on Google and GitHub
- Regularly update dependencies
- Monitor Supabase logs for suspicious activity
- Use HTTPS only in production

---

## 📄 License

MIT License - feel free to use for personal or commercial projects

---

## 🎉 Success!

Your attendance tracker should now be:
- ✅ Live on Vercel
- ✅ Using Google OAuth
- ✅ Connected to Supabase
- ✅ Production-ready

**Live URL**: `https://your-app.vercel.app`

---

**Created**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

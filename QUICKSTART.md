# 🚀 Quick Start Guide - Visual Walkthrough

## ⏱️ Total Time: 10-15 Minutes

Follow these steps to get your attendance tracker running!

---

## 📝 Step 1: Google Cloud Console Setup (5 minutes)

### 1.1 Create New Project

```
┌─────────────────────────────────────────────────┐
│  Google Cloud Console                           │
│  https://console.cloud.google.com/             │
│                                                 │
│  [Select a project ▼] [NEW PROJECT]            │
│                                                 │
│  Project name: attendance-tracker              │
│  Organization: [Your org]                      │
│                       [CANCEL]  [CREATE]        │
└─────────────────────────────────────────────────┘
```

**Action**: Click "NEW PROJECT" → Enter name → Click "CREATE"

---

### 1.2 Enable Google+ API

```
┌─────────────────────────────────────────────────┐
│  APIs & Services > Library                      │
│                                                 │
│  [Search for APIs...]  🔍                       │
│  > "Google+ API"                                │
│                                                 │
│  ┌───────────────────────┐                     │
│  │  Google+ API          │                     │
│  │  [ENABLE]             │                     │
│  └───────────────────────┘                     │
└─────────────────────────────────────────────────┘
```

**Action**: Search "Google+ API" → Click "ENABLE"

---

### 1.3 Configure OAuth Consent Screen

```
┌─────────────────────────────────────────────────┐
│  OAuth consent screen                           │
│                                                 │
│  User Type:                                    │
│  ○ Internal    ● External                      │
│                                                 │
│  App information:                              │
│  App name: Attendance Tracker                  │
│  User support email: you@gmail.com             │
│  Developer contact: you@gmail.com              │
│                                                 │
│  Scopes:                                       │
│  ✓ .../auth/userinfo.email                     │
│  ✓ .../auth/userinfo.profile                   │
│                                                 │
│              [SAVE AND CONTINUE]                │
└─────────────────────────────────────────────────┘
```

**Action**: Fill form → Add scopes → Save

---

### 1.4 Create OAuth Client ID

```
┌─────────────────────────────────────────────────┐
│  Create OAuth client ID                         │
│                                                 │
│  Application type: Web application              │
│  Name: Attendance Tracker Web Client            │
│                                                 │
│  Authorized JavaScript origins:                 │
│  + http://localhost:3000                        │
│  + https://your-app.vercel.app                  │
│                                                 │
│  Authorized redirect URIs:                      │
│  + http://localhost:3000/auth/callback          │
│  + https://xxx.supabase.co/auth/v1/callback     │
│  + https://your-app.vercel.app/auth/callback    │
│                                                 │
│                        [CREATE]                 │
└─────────────────────────────────────────────────┘
```

**Result**: You'll get:
```
Client ID: 123456789-abc.apps.googleusercontent.com
Client Secret: GOCSPX-xyz123
```

**⚠️ SAVE THESE - YOU'LL NEED THEM!**

---

## 🗄️ Step 2: Supabase Setup (5 minutes)

### 2.1 Create Supabase Project

```
┌─────────────────────────────────────────────────┐
│  Supabase - New Project                         │
│  https://supabase.com/                          │
│                                                 │
│  Organization: [Select]                         │
│  Name: attendance-tracker                       │
│  Database Password: ••••••••••••                │
│  Region: [Select closest]                       │
│  Pricing Plan: Free                             │
│                                                 │
│                   [Create new project]          │
│                                                 │
│  ⏳ Setting up project... (2-3 minutes)         │
└─────────────────────────────────────────────────┘
```

**Action**: Fill form → Create → Wait for setup

---

### 2.2 Run Database Schema

```
┌─────────────────────────────────────────────────┐
│  Supabase - SQL Editor                          │
│                                                 │
│  [+ New query]                                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ -- Paste SQL from DEPLOYMENT_GUIDE.md    │ │
│  │ CREATE TABLE profiles (                  │ │
│  │   id UUID PRIMARY KEY,                   │ │
│  │   email TEXT UNIQUE NOT NULL,            │ │
│  │   ...                                    │ │
│  │ );                                       │ │
│  │ ...                                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [RUN] (Ctrl+Enter)                             │
│  ✓ Success. 6 tables created.                   │
└─────────────────────────────────────────────────┘
```

**Action**: Copy SQL from guide → Paste → Run

---

### 2.3 Enable Google Auth

```
┌─────────────────────────────────────────────────┐
│  Authentication > Providers                     │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Google                          [Toggle] ●│ │
│  │                                           │ │
│  │ Client ID (from Google):                 │ │
│  │ [123456789-abc.apps.googleusercontent.com]│ │
│  │                                           │ │
│  │ Client Secret (from Google):             │ │
│  │ [GOCSPX-xyz123]                          │ │
│  │                                           │ │
│  │ Callback URL (copy this):                │ │
│  │ https://xxx.supabase.co/auth/v1/callback │ │
│  │                                   [Save] │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Action**: Enable Google → Enter credentials → Copy callback URL

---

### 2.4 Get API Keys

```
┌─────────────────────────────────────────────────┐
│  Settings > API                                 │
│                                                 │
│  Project URL:                                   │
│  https://xxxyyzzz.supabase.co          [Copy]  │
│                                                 │
│  API Keys:                                      │
│  anon public: eyJhbGciOiJIUz...        [Copy]  │
│  service_role: eyJhbGciOiJIUz...       [Copy]  │
│                                                 │
│  ⚠️  Keep service_role secret!                  │
└─────────────────────────────────────────────────┘
```

**⚠️ SAVE THESE - YOU'LL NEED THEM!**

---

## 💻 Step 3: Local Setup (3 minutes)

### 3.1 Install Dependencies

```bash
cd attendance-tracker-nextjs
npm install

# Wait for installation...
# ████████████████████████ 100%
```

---

### 3.2 Create Environment File

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

```env
# .env.local content:
NEXT_PUBLIC_SUPABASE_URL=https://xxxyyzzz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### 3.3 Start Development Server

```bash
npm run dev

# Output:
# - ready started server on 0.0.0.0:3000
# - info Using Typescript
# ✓ Compiled successfully
```

**Open**: http://localhost:3000

---

## 🎉 Step 4: Test Locally

### 4.1 Test Google Login

```
┌─────────────────────────────────────────────────┐
│  Attendance Tracker                             │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  Welcome to AttendTrack                   │ │
│  │  Start tracking your attendance           │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │  [Sign in with Google]              │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Action**: Click "Sign in with Google" → Choose account → Allow permissions

---

### 4.2 Create Timetable

```
┌─────────────────────────────────────────────────┐
│  Create Timetable                               │
│                                                 │
│  Working Days: [6 ▼]  Slots: [8]               │
│  Start Date: [2026-01-28]  Min: [75]%          │
│                                                 │
│  ┌─────┬───────┬───────┬───────┬───────┐      │
│  │     │ Slot1 │ Slot2 │ Slot3 │ Slot4 │      │
│  ├─────┼───────┼───────┼───────┼───────┤      │
│  │ Mon │  Math │ Phy   │       │       │      │
│  │ Tue │       │       │       │       │      │
│  │ Wed │       │       │       │       │      │
│  └─────┴───────┴───────┴───────┴───────┘      │
│                                                 │
│  [Save Timetable]                               │
└─────────────────────────────────────────────────┘
```

**Action**: Configure → Fill slots → Save

---

### 4.3 Mark Attendance

```
┌─────────────────────────────────────────────────┐
│  Enter Attendance                               │
│                                                 │
│  Date: [2026-01-28 ▼]         Monday            │
│                                                 │
│  Click: Present → Absent → Not Considered       │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Math     │ │ Physics  │ │ Chemistry│       │
│  │ Slot 1   │ │ Slot 2   │ │ Slot 3   │       │
│  │ ✓ PRESENT│ │          │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Action**: Click slots to mark attendance

---

## 🚀 Step 5: Deploy to Vercel (5 minutes)

### 5.1 Push to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/attendance-tracker.git
git push -u origin main

# Pushed to GitHub ✓
```

---

### 5.2 Deploy on Vercel

```
┌─────────────────────────────────────────────────┐
│  Vercel - Import Git Repository                 │
│  https://vercel.com/                            │
│                                                 │
│  Select Repository:                             │
│  ● yourusername/attendance-tracker              │
│                                                 │
│  Framework: Next.js                             │
│  Root: ./                                       │
│                                                 │
│  Environment Variables: [Add Variables]         │
│  NEXT_PUBLIC_SUPABASE_URL = ...                 │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY = ...            │
│  NEXT_PUBLIC_GOOGLE_CLIENT_ID = ...             │
│  NEXT_PUBLIC_SITE_URL = https://your-app.vercel │
│                                                 │
│                      [Deploy]                   │
│                                                 │
│  ⏳ Building... (2-3 minutes)                    │
│  ✓ Deployment Ready!                            │
│                                                 │
│  🎉 your-app.vercel.app                         │
└─────────────────────────────────────────────────┘
```

**Action**: Import → Add env vars → Deploy

---

### 5.3 Update OAuth URLs

**Go back to Google Cloud Console**:

```
Credentials > Edit OAuth Client

Add to Authorized origins:
✓ https://your-app.vercel.app

Add to Redirect URIs:
✓ https://your-app.vercel.app/auth/callback

[SAVE]
```

**Go back to Supabase**:

```
Authentication > URL Configuration

Site URL: https://your-app.vercel.app
Redirect URLs: https://your-app.vercel.app/**

[SAVE]
```

---

## ✅ Step 6: Verify Everything Works

### Checklist:

```
Test on Production:
□ Visit https://your-app.vercel.app
□ Click "Sign in with Google"
□ Complete sign-in flow
□ Create timetable
□ Mark attendance
□ View dashboard
□ Check subject-wise stats
□ View heatmap
□ Test on mobile device
□ Try different browsers
□ Sign out and sign back in
```

---

## 🎊 Success!

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         🎉 CONGRATULATIONS! 🎉                  │
│                                                 │
│  Your attendance tracker is now LIVE!           │
│                                                 │
│  ✓ Deployed on Vercel                           │
│  ✓ Google OAuth working                         │
│  ✓ Supabase connected                           │
│  ✓ Production ready                             │
│                                                 │
│  Live URL:                                      │
│  🔗 https://your-app.vercel.app                 │
│                                                 │
│  Share with friends! 🚀                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🆘 Quick Troubleshooting

### Problem: OAuth redirect error

```
Error: redirect_uri_mismatch

Solution:
1. Check Google Console → Credentials
2. Verify ALL redirect URIs are added
3. Wait 5 minutes for changes
4. Clear browser cache
5. Try again
```

---

### Problem: Supabase connection error

```
Error: Invalid API key

Solution:
1. Check .env.local file
2. Verify keys match Supabase dashboard
3. Restart dev server: npm run dev
4. For Vercel: Update env vars and redeploy
```

---

### Problem: Build fails on Vercel

```
Error: Build failed

Solution:
1. Test locally: npm run build
2. Fix any TypeScript errors
3. Check all dependencies installed
4. Verify environment variables
5. Redeploy: vercel --prod
```

---

## 📱 Next Steps

1. **Customize** - Change colors, fonts, logo
2. **Add Features** - Email notifications, exports
3. **Invite Users** - Share your app link
4. **Monitor** - Check Vercel analytics
5. **Update** - Keep dependencies up to date

---

## 🎯 Resources

- **Documentation**: See README.md
- **Detailed Guide**: See DEPLOYMENT_GUIDE.md
- **Google OAuth**: https://console.cloud.google.com/
- **Supabase**: https://supabase.com/
- **Vercel**: https://vercel.com/

---

**Happy Tracking! 📚✅**

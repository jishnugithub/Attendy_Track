# 📋 Deployment Checklist

Use this checklist to ensure everything is set up correctly.

---

## ✅ Pre-Deployment Checklist

### Google Cloud Console

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Enabled Google Identity Services
- [ ] Configured OAuth consent screen (External)
- [ ] Added required scopes (email, profile)
- [ ] Added test users (if in testing mode)
- [ ] Created OAuth 2.0 Client ID
- [ ] Added localhost origins for development
- [ ] Added localhost redirect URIs for development
- [ ] Copied and saved Client ID
- [ ] Copied and saved Client Secret

### Supabase Setup

- [ ] Created Supabase project
- [ ] Saved database password securely
- [ ] Ran database schema SQL successfully
- [ ] Verified 6 tables created in Table Editor
- [ ] Enabled Google OAuth provider
- [ ] Added Google Client ID to Supabase
- [ ] Added Google Client Secret to Supabase
- [ ] Copied Supabase callback URL
- [ ] Added Supabase callback to Google OAuth
- [ ] Copied Project URL
- [ ] Copied Anon public key
- [ ] Verified Row Level Security is enabled

### Local Setup

- [ ] Node.js 18+ installed
- [ ] Git initialized in project
- [ ] npm install completed successfully
- [ ] Created .env.local file
- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Added NEXT_PUBLIC_GOOGLE_CLIENT_ID
- [ ] Added NEXT_PUBLIC_SITE_URL (localhost)
- [ ] .env.local added to .gitignore
- [ ] npm run dev starts successfully
- [ ] App opens at http://localhost:3000

### Local Testing

- [ ] Can access home page
- [ ] "Sign in with Google" button visible
- [ ] Click sign-in redirects to Google
- [ ] Can select Google account
- [ ] OAuth consent screen appears
- [ ] Can grant permissions
- [ ] Redirects back to app after auth
- [ ] User profile created in Supabase
- [ ] Can access dashboard
- [ ] Can create timetable
- [ ] Timetable saves to database
- [ ] Can mark attendance
- [ ] Attendance saves to database
- [ ] Dashboard shows correct percentage
- [ ] Subject-wise stats calculate correctly
- [ ] Heatmap displays properly
- [ ] Can navigate all pages
- [ ] Sign out works correctly
- [ ] Can sign back in with same account

---

## 🚀 Deployment Checklist

### GitHub Setup

- [ ] Created GitHub repository
- [ ] Initialized git locally
- [ ] All files committed
- [ ] Pushed to GitHub main branch
- [ ] Repository is public or connected to Vercel

### Vercel Setup

- [ ] Signed up/in to Vercel
- [ ] Connected GitHub account
- [ ] Imported project from GitHub
- [ ] Selected correct repository
- [ ] Framework detected as Next.js
- [ ] Build settings correct (npm run build)
- [ ] Added all environment variables
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID
  - [ ] NEXT_PUBLIC_SITE_URL (Vercel URL)
- [ ] Environment variables added to Production
- [ ] Environment variables added to Preview
- [ ] Environment variables added to Development
- [ ] Clicked Deploy
- [ ] Build completed successfully
- [ ] Got Vercel deployment URL
- [ ] Can access site at Vercel URL

### Post-Deployment Configuration

- [ ] Updated Google OAuth with Vercel URL
- [ ] Added Vercel URL to Authorized JavaScript origins
- [ ] Added Vercel URL to Authorized redirect URIs
- [ ] Saved Google OAuth changes
- [ ] Updated Supabase Site URL with Vercel URL
- [ ] Added Vercel URL to Supabase Redirect URLs
- [ ] Saved Supabase changes
- [ ] Waited 5 minutes for changes to propagate

---

## ✅ Production Testing Checklist

### Functionality Tests

- [ ] App loads at Vercel URL
- [ ] No console errors on page load
- [ ] "Sign in with Google" button works
- [ ] Google OAuth flow completes
- [ ] User redirected back to app
- [ ] Dashboard loads correctly
- [ ] Can create new timetable
- [ ] Can configure working days
- [ ] Can set slots per day
- [ ] Can select start date
- [ ] Can set minimum attendance
- [ ] Timetable grid renders properly
- [ ] Can select multiple slots
- [ ] Can merge slots
- [ ] Can add subject names
- [ ] Can mark as lunch/break
- [ ] Timetable saves successfully
- [ ] Can enter attendance
- [ ] Can select dates
- [ ] Can mark slots present/absent
- [ ] Can mark entire day as holiday
- [ ] Attendance saves in real-time
- [ ] Dashboard updates immediately
- [ ] Overall percentage calculates correctly
- [ ] Subject-wise stats show correctly
- [ ] Heatmap displays for current month
- [ ] Can navigate previous/next months
- [ ] Calendar cells show correct percentages
- [ ] Can end attendance session
- [ ] Can save attendance log
- [ ] Logs appear in logs section
- [ ] Can view historical logs
- [ ] Can sign out
- [ ] Can sign back in

### Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad)
- [ ] Mobile (iPhone/Android)
- [ ] All layouts responsive
- [ ] Text readable on mobile
- [ ] Buttons clickable on mobile
- [ ] Forms usable on mobile

### Performance

- [ ] Page loads in < 3 seconds
- [ ] No layout shift on load
- [ ] Smooth transitions/animations
- [ ] No memory leaks
- [ ] Database queries fast
- [ ] Images optimized

### Security

- [ ] HTTPS enabled
- [ ] No API keys exposed in code
- [ ] Environment variables secure
- [ ] Row Level Security enabled
- [ ] User data isolated
- [ ] OAuth flow secure
- [ ] No console warnings

---

## 📊 Monitoring Checklist

### Week 1 After Deployment

- [ ] Check Vercel analytics
- [ ] Monitor build success rate
- [ ] Check for runtime errors
- [ ] Review Supabase logs
- [ ] Monitor database usage
- [ ] Check auth success rate
- [ ] Verify no security issues
- [ ] Test from different locations
- [ ] Get user feedback

### Monthly

- [ ] Review analytics trends
- [ ] Check error logs
- [ ] Update dependencies
- [ ] Run security audit (npm audit)
- [ ] Check Vercel bandwidth usage
- [ ] Check Supabase database size
- [ ] Backup important data
- [ ] Review and improve performance

---

## 🔧 Maintenance Checklist

### Regular Updates

- [ ] Update Next.js when available
- [ ] Update React when available
- [ ] Update Supabase client
- [ ] Update other dependencies
- [ ] Test after each update
- [ ] Run npm audit fix
- [ ] Check for breaking changes

### Backups

- [ ] Export Supabase database schema
- [ ] Backup environment variables
- [ ] Document any custom configurations
- [ ] Keep copy of working code

### Documentation

- [ ] Update README if features change
- [ ] Document any issues encountered
- [ ] Keep changelog of updates
- [ ] Share learnings with team

---

## 🆘 Troubleshooting Checklist

### OAuth Issues

- [ ] Verify Client ID matches exactly
- [ ] Check all redirect URIs added
- [ ] Clear browser cache/cookies
- [ ] Try incognito/private mode
- [ ] Check Google OAuth is enabled in Supabase
- [ ] Verify callback URL in both places
- [ ] Wait 5-10 minutes after changes
- [ ] Check browser console for errors

### Database Issues

- [ ] Verify Supabase project is active
- [ ] Check Project URL is correct
- [ ] Verify Anon key is correct
- [ ] Check RLS policies enabled
- [ ] Review Supabase logs
- [ ] Test direct database queries
- [ ] Verify network connectivity

### Deployment Issues

- [ ] Check Vercel build logs
- [ ] Verify all env vars set
- [ ] Test build locally first
- [ ] Check for TypeScript errors
- [ ] Verify dependencies installed
- [ ] Clear Vercel cache and rebuild
- [ ] Check domain configuration

### Performance Issues

- [ ] Check bundle size
- [ ] Optimize images
- [ ] Enable caching
- [ ] Minimize database calls
- [ ] Use React.memo where needed
- [ ] Check network waterfall
- [ ] Profile with DevTools

---

## 📝 Custom Domain Checklist (Optional)

### Domain Setup

- [ ] Purchased custom domain
- [ ] Added domain in Vercel
- [ ] Configured DNS records
- [ ] Verified domain ownership
- [ ] SSL certificate issued
- [ ] Domain redirects to HTTPS
- [ ] Updated Google OAuth origins
- [ ] Updated Google OAuth redirects
- [ ] Updated Supabase Site URL
- [ ] Updated environment variables
- [ ] Redeployed with new URL
- [ ] Tested all functionality
- [ ] Updated documentation

---

## 🎉 Launch Checklist

### Pre-Launch

- [ ] All features tested and working
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] Security verified
- [ ] Documentation complete
- [ ] User guide prepared
- [ ] Support plan in place

### Launch Day

- [ ] Monitor for errors
- [ ] Watch analytics
- [ ] Be available for support
- [ ] Collect initial feedback
- [ ] Document any issues
- [ ] Celebrate! 🎊

### Post-Launch

- [ ] Review first week data
- [ ] Address urgent issues
- [ ] Plan improvements
- [ ] Thank early users
- [ ] Share success story
- [ ] Keep improving

---

## ✅ All Done!

Once all items are checked, you're ready for production! 🚀

**Remember**: Keep this checklist handy for future updates and deployments.

---

**Last Updated**: January 2026  
**Version**: 1.0

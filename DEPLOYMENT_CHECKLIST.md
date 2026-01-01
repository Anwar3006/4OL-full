# 🚀 Vercel Deployment Checklist

## Pre-Deployment (Local Setup)

### 1. Database Setup
- [ ] Created Neon PostgreSQL project
- [ ] Copied `DATABASE_URL` (regular connection)
- [ ] Copied `DATABASE_POOLER_URL` (pooled connection with `-pooler`)
- [ ] Ran migrations: `npm run db:migrate`
- [ ] Tested connection locally

### 2. Authentication
- [ ] Generated BETTER_AUTH_SECRET: `openssl rand -base64 32`
- [ ] Saved secret securely (DO NOT commit to git)

### 3. Object Storage (OCI/S3)
- [ ] Created/have access to bucket
- [ ] Obtained access key ID
- [ ] Obtained secret access key
- [ ] Noted bucket name and endpoint
- [ ] Configured CDN URL (if using)

### 4. Code Preparation
- [ ] Updated `trustedOrigins` in `packages/api/src/auth.ts` to include production domain
- [ ] Verified `next.config.ts` has standalone output
- [ ] Created/verified `vercel.json` exists in `apps/web`
- [ ] All code committed and pushed to GitHub

---

## Vercel Setup

### 1. GitHub Repository
- [ ] Pushed code to GitHub
- [ ] Repository is accessible
- [ ] Main branch is up to date

### 2. Vercel Project Creation
- [ ] Logged into [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Clicked "Add New Project"
- [ ] Imported GitHub repository
- [ ] Configured project:
  - Framework: Next.js
  - Root Directory: `apps/web`
  - Build Command: `npm run build`
  - Output Directory: `.next`

### 3. Environment Variables (CRITICAL)
Set all variables in: Vercel Dashboard → Your Project → Settings → Environment Variables

#### Database
- [ ] `DATABASE_URL` = `postgresql://...` (regular)
- [ ] `DATABASE_POOLER_URL` = `postgresql://...-pooler...` (pooled)

#### Authentication
- [ ] `BETTER_AUTH_SECRET` = your generated secret
- [ ] `BETTER_AUTH_URL` = `https://your-app.vercel.app`

#### Object Storage
- [ ] `OCI_BUCKET_NAME`
- [ ] `OCI_ENDPOINT`
- [ ] `OCI_ACCESS_KEY_ID`
- [ ] `OCI_SECRET_ACCESS_KEY`
- [ ] `OCI_REGION`
- [ ] `IMAGE_BASE_URL`

#### Environment
- [ ] `NODE_ENV` = `production`
- [ ] `NEXT_TELEMETRY_DISABLED` = `1` (optional)

**Important:** Set variables for ALL environments:
- [ ] Production
- [ ] Preview
- [ ] Development

### 4. Deploy
- [ ] Clicked "Deploy"
- [ ] Waited for build to complete (5-10 minutes)
- [ ] Checked deployment logs for errors

---

## Post-Deployment Verification

### 1. Check Deployment
- [ ] Visited production URL: `https://your-app.vercel.app`
- [ ] Homepage loads correctly
- [ ] No console errors in browser DevTools

### 2. Test tRPC API
- [ ] API endpoint accessible: `https://your-app.vercel.app/api/trpc`
- [ ] Test a query in browser console:
  ```javascript
  fetch('https://your-app.vercel.app/api/trpc/userProfiles.allUsers')
    .then(r => r.json())
    .then(console.log)
  ```

### 3. Test Authentication
- [ ] Can access login page
- [ ] Can create account (if enabled)
- [ ] Can log in
- [ ] Session persists on refresh

### 4. Check Vercel Logs
- [ ] Vercel Dashboard → Deployments → Latest → Logs
- [ ] No error messages in Function logs
- [ ] Database connections successful

### 5. Test Database
- [ ] Can fetch data from database
- [ ] Can insert data
- [ ] Migrations applied correctly

### 6. Test File Uploads (if applicable)
- [ ] Can upload images
- [ ] Can retrieve image URLs
- [ ] Images display correctly

---

## Mobile App Connection

### 1. Update Mobile App Environment
```bash
# apps/mobile/.env
API_URL=https://your-app.vercel.app
```

### 2. Update Auth Config
In `packages/api/src/auth.ts`:
```typescript
trustedOrigins: [
  "https://your-app.vercel.app",
  "https://*.vercel.app", // For preview deployments
  "exp://",
  "myapp://",
]
```

### 3. Test Mobile Connection
- [ ] Mobile app can connect to production API
- [ ] Can authenticate from mobile
- [ ] Can fetch data
- [ ] Images load correctly

---

## Production Optimizations

### 1. Performance
- [ ] Enabled edge caching where appropriate
- [ ] Configured CDN for static assets
- [ ] Reviewed and optimized slow API routes

### 2. Monitoring
- [ ] Set up Vercel Analytics (free)
- [ ] Reviewing Function logs regularly
- [ ] Monitoring database performance in Neon

### 3. Security
- [ ] All secrets stored in environment variables
- [ ] No sensitive data committed to git
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] CORS configured correctly for mobile app

### 4. Backup & Recovery
- [ ] Neon automatic backups enabled
- [ ] Know how to rollback deployment in Vercel
- [ ] Documented environment variable values (securely)

---

## Troubleshooting Checklist

If deployment fails:

### Build Errors
- [ ] Check build logs in Vercel Dashboard
- [ ] Verify all dependencies in package.json
- [ ] Test build locally: `npm run build -w @4ol/web`
- [ ] Check for TypeScript errors

### Runtime Errors
- [ ] Verify all environment variables are set
- [ ] Check Function logs for specific errors
- [ ] Test database connection from Vercel
- [ ] Verify API routes are accessible

### Database Connection Issues
- [ ] Confirm Neon project is active
- [ ] Check IP allowlist in Neon (should allow all)
- [ ] Verify connection strings are correct
- [ ] Test with both DATABASE_URL and DATABASE_POOLER_URL

### Authentication Issues
- [ ] BETTER_AUTH_URL matches deployment URL
- [ ] BETTER_AUTH_SECRET is set and secure
- [ ] trustedOrigins includes production domain
- [ ] Cookies are not blocked

---

## Continuous Deployment Setup

### Automatic Deployments
- [ ] Connected GitHub repository to Vercel
- [ ] Main branch deploys to Production automatically
- [ ] Pull requests create Preview deployments

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git push origin feature/new-feature
# Creates preview deployment

# Merge to main
git checkout main
git merge feature/new-feature
git push origin main
# Deploys to production
```

---

## Final Checklist

- [ ] ✅ Application is live and accessible
- [ ] ✅ All features working in production
- [ ] ✅ Mobile app can connect
- [ ] ✅ Database is accessible
- [ ] ✅ File uploads working
- [ ] ✅ Authentication working
- [ ] ✅ No errors in production logs
- [ ] ✅ Performance is acceptable
- [ ] ✅ Monitoring is in place
- [ ] ✅ Team knows how to deploy updates

---

## 🎉 Congratulations!

Your app is now live in production!

**Production URLs:**
- Web App: `https://your-app.vercel.app`
- API: `https://your-app.vercel.app/api/trpc`

**Next Steps:**
1. Share production URL with team
2. Update mobile app API_URL
3. Monitor logs for any issues
4. Set up custom domain (optional)
5. Configure analytics (optional)

---

## Quick Commands Reference

```bash
# Deploy to production
git push origin main

# Redeploy without code changes
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls

# Rollback to previous deployment
# (Do in Vercel Dashboard → Deployments → ... → Promote to Production)

# Test locally before deploying
npm run build -w @4ol/web
npm run start -w @4ol/web
```

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [tRPC Documentation](https://trpc.io)
- [Better Auth Docs](https://www.better-auth.com)

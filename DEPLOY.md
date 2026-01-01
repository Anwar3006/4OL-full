# 🚀 Deployment Guide - TL;DR

Quick reference for deploying to Vercel.

## 1-Minute Setup

### Step 1: Prepare Environment Variables
```bash
# Run setup script
chmod +x deploy-setup.sh
./deploy-setup.sh
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. **Root Directory:** `apps/web`
4. Add environment variables (see below)
5. Click "Deploy"

---

## Critical Environment Variables

Copy to Vercel Dashboard → Settings → Environment Variables:

### Database (Neon)
```bash
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname
DATABASE_POOLER_URL=postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/dbname
```

### Authentication
```bash
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=https://your-app.vercel.app
```

### Object Storage
```bash
OCI_BUCKET_NAME=your-bucket
OCI_ENDPOINT=https://...oraclecloud.com
OCI_ACCESS_KEY_ID=your-key
OCI_SECRET_ACCESS_KEY=your-secret
OCI_REGION=us-phoenix-1
IMAGE_BASE_URL=https://your-cdn.com
```

### Environment
```bash
NODE_ENV=production
```

---

## Build Configuration

**In Vercel Dashboard:**
- Framework: Next.js
- Root Directory: `apps/web`
- Build Command: `npm run build` (uses package.json script)
- Output Directory: `.next` (default)

---

## After Deployment

### 1. Update Mobile App
```bash
# apps/mobile/.env
API_URL=https://your-app.vercel.app
```

### 2. Update Auth Config
```typescript
// packages/api/src/auth.ts
trustedOrigins: [
  "https://your-app.vercel.app",
  // ... other origins
]
```

### 3. Test
```javascript
// Browser console
fetch('https://your-app.vercel.app/api/trpc/userProfiles.allUsers')
  .then(r => r.json())
  .then(console.log)
```

---

## ✅ Your API is Live!

- **Web:** `https://your-app.vercel.app`
- **API:** `https://your-app.vercel.app/api/trpc`
- **tRPC procedures:** Automatically hosted via Next.js API routes

---

## 📚 Full Documentation

- **Complete Guide:** See artifact in previous message
- **Detailed Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Environment Variables:** `.env.production.example`

## 🆘 Quick Fixes

**Build fails?**
```bash
# Test locally
npm run build -w @4ol/web
```

**Environment variables not working?**
- Redeploy after adding variables
- Check variable names match exactly

**Database connection fails?**
- Verify Neon allows all IPs (0.0.0.0/0)
- Use POOLER URL for writes

**CORS errors from mobile?**
- Update trustedOrigins in auth.ts
- Redeploy

---

## Command Reference

```bash
# Local testing
npm run dev:web

# Build test
npm run build -w @4ol/web

# Deploy
git push origin main  # Auto-deploys if connected to Vercel

# Manual deploy
vercel --prod

# View logs
vercel logs
```

---

**Need help?** Check the complete guide in the artifact or `DEPLOYMENT_CHECKLIST.md`

**Success?** 🎉 Your tRPC API is now globally available!

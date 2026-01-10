# Vercel Environment Variables Setup Guide

## Problem
The build was failing with:
```
Error: supabaseUrl is required.
```

This happened because environment variables weren't properly loaded during the build process on Vercel.

## Root Causes

### 1. Build-Time Evaluation
Next.js tries to evaluate module-level code during build time, which happens before runtime environment variables are available. The original code was:

```typescript
// ❌ This runs during build time
export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 2. Environment Variables Exposure
Environment variables were potentially being logged to console, which is a security risk.

## Solution

### 1. Lazy Initialization Pattern
We now use lazy initialization with a Proxy pattern:

```typescript
// ✅ This only runs when actually accessed at runtime
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient];
  }
});
```

### 2. Vercel Environment Variables Setup

You MUST add these environment variables in your Vercel project settings:

1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add the following variables:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://pyzddsvvazfrhohghuki.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_zCZoVHG5OxAgnM5RIBfp7A_mJeyLYYS
SUPABASE_SECRET_KEY=sb_secret_RHeG77gcsHOOZMU1RUPClg_hq5EpNSV
NEXT_PUBLIC_SUPABASE_BUCKET_NAME=bucket4ol
RESEND_API_KEY=re_U2Tpiis3_CceGWEVnTjhQUVUvHk2ktnZh
NEXT_PUBLIC_APP_URL=https://4-ol-full-web-myzx.vercel.app
```

4. Make sure to set them for all environments (Production, Preview, Development)

### 3. Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore` (already done)
- Use `NEXT_PUBLIC_` prefix only for variables that should be exposed to the browser
- Use Vercel's environment variable UI to set secrets
- Never log environment variables in production code

❌ **DON'T:**
- Commit `.env.local` to Git
- Console.log environment variables
- Use admin keys (SUPABASE_SECRET_KEY) on the client-side
- Share your `.env.local` file

### 4. Verify Setup

After deploying to Vercel:

1. Check the build logs - they should not contain any environment variable values
2. Test the application functionality
3. Verify that Supabase connections work properly

### 5. Troubleshooting

If you still see issues:

1. **Clear Vercel cache**: Redeploy with "Clear cache and deploy"
2. **Verify environment variables**: Check they're set correctly in Vercel UI
3. **Check build logs**: Look for any errors during the build process
4. **Check for console.logs**: Remove any that print env variables

## Files Modified

1. `/lib/supabase/index.ts` - Lazy initialization pattern
2. `/lib/supabase/indexAdmin.ts` - Lazy initialization pattern with server-side check
3. This README for documentation

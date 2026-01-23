# 📧 Migration Guide: Resend → Twilio SendGrid

## 📋 Table of Contents
1. [Overview](#overview)
2. [Why Migrate](#why-migrate)
3. [Current Implementation](#current-implementation)
4. [Twilio SendGrid Setup](#twilio-sendgrid-setup)
5. [Step-by-Step Migration](#step-by-step-migration)
6. [Code Changes](#code-changes)
7. [Testing](#testing)
8. [Comparison](#comparison)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Plan](#rollback-plan)

---

## 📖 Overview

This guide helps you migrate from **Resend** to **Twilio SendGrid** for sending admin invitation emails in the 4 Our Life application.

### Current Setup
- **Email Service**: Resend (v6.6.0)
- **Email Template**: React Email components
- **Usage**: Admin invitation emails
- **File**: `apps/web/actions/authenticate.actions.ts`

### Target Setup
- **Email Service**: Twilio SendGrid
- **Email Template**: React Email → HTML conversion
- **API**: SendGrid Node.js SDK
- **Backwards Compatible**: No breaking changes

---

## 🎯 Why Migrate?

### Twilio SendGrid Advantages
- ✅ **Enterprise-grade** - Trusted by major companies
- ✅ **Better analytics** - Detailed email tracking and reports
- ✅ **Higher limits** - More generous free tier (100 emails/day free)
- ✅ **Advanced features** - A/B testing, automation, webhooks
- ✅ **Better deliverability** - Industry-leading inbox placement
- ✅ **Twilio integration** - Seamless integration with SMS/WhatsApp if needed

### Migration Benefits
- Keep existing email templates (React Email)
- No changes to UI components
- Better email tracking and analytics
- More reliable delivery
- Professional sender reputation

---

## 🔍 Current Implementation

### File Structure
```
apps/web/
├── actions/
│   └── authenticate.actions.ts    ← Resend is used here
└── app/(dashboard)/admins/
    └── _components/
        └── add-admin-dialog.tsx    ← Calls the action

packages/email-sender/
└── emails/admins/
    └── invite-admin.tsx            ← Email template (keep as-is)
```

### Current Code (Resend)
```typescript
// apps/web/actions/authenticate.actions.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: isProd ? "4 Our Life <admin@4ourlife.com>" : "onboarding@resend.dev",
  to: [email],
  subject: "Invitation to join 4 Our Life",
  react: InviteAdminEmail({ email, inviteLink }),
});
```

---

## 🚀 Twilio SendGrid Setup

### Step 1: Create SendGrid Account

1. **Sign up** at https://sendgrid.com/
2. **Verify your email** address
3. **Complete sender authentication**:
   - Go to Settings → Sender Authentication
   - Set up single sender verification
   - Use: `admin@4ourlife.com` (or your domain)

### Step 2: Get API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: `4OL_Admin_Invites`
4. Select **Full Access** (or Mail Send only)
5. **Copy the API key** (you won't see it again!)
6. Store it securely

### Step 3: Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Choose **Single Sender Verification**
3. Fill in details:
   - **From Name**: `4 Our Life`
   - **From Email**: `admin@4ourlife.com`
   - **Reply To**: `support@4ourlife.com`
4. Verify the email address via the link sent to you

### Step 4: Domain Authentication (Optional but Recommended)

For production, authenticate your domain:
1. Go to **Settings** → **Sender Authentication** → **Authenticate Your Domain**
2. Follow the DNS setup instructions
3. Add the CNAME records to your domain's DNS
4. Wait for verification (can take 24-48 hours)

---

## 📝 Step-by-Step Migration

### Phase 1: Install SendGrid SDK

```bash
cd /Users/anwarsadat/Desktop/WORK/4OL_full

# Install SendGrid
npm install @sendgrid/mail --workspace=apps/web

# Or if using pnpm
pnpm add @sendgrid/mail --filter @4ol/web
```

### Phase 2: Update Environment Variables

Add to `.env.local`:
```env
# Remove or comment out Resend (keep for rollback)
# RESEND_API_KEY=re_U2Tpiis3_CceGWEVnTjhQUVUvHk2ktnZh

# Add SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=admin@4ourlife.com
SENDGRID_FROM_NAME=4 Our Life
```

### Phase 3: Update Code Files

See [Code Changes](#code-changes) section below.

### Phase 4: Test

See [Testing](#testing) section below.

### Phase 5: Deploy

1. Update production environment variables
2. Deploy to Vercel/production
3. Monitor email delivery
4. Remove Resend dependency (optional)

---

## 💻 Code Changes

### File 1: `apps/web/actions/authenticate.actions.ts`

**Before (Resend)**:
```typescript
"use server";
import { supabase } from "@/lib/supabase";
import {
  TAdminInviteSchema,
  TUserProfile,
} from "@4ol/db/schemas/user-profile.schema";
import { InviteAdminEmail } from "@4ol/email-sender/emails/admins/invite-admin";

import { auth } from "@4ol/api/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ... createAdminInvite function ...

export async function inviteAdminAction(email: string, role: string) {
  try {
    // ... existing code ...

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

    const isProd = process.env.NODE_ENV === "production";
    const result = await resend.emails.send({
      from: isProd
        ? "4 Our Life <admin@4ourlife.com>"
        : "onboarding@resend.dev",
      to: [email],
      subject: "Invitation to join 4 Our Life",
      react: InviteAdminEmail({ email, inviteLink }),
    });

    return result;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}
```

**After (SendGrid)**:
```typescript
"use server";
import { supabase } from "@/lib/supabase";
import {
  TAdminInviteSchema,
  TUserProfile,
} from "@4ol/db/schemas/user-profile.schema";
import { InviteAdminEmail } from "@4ol/email-sender/emails/admins/invite-admin";
import { render } from "@react-email/render";

import { auth } from "@4ol/api/auth";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// ... createAdminInvite function (no changes) ...

export async function inviteAdminAction(email: string, role: string) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: {
        cookie: requestHeaders.get("cookie") as string,
      },
    });

    if (session?.user?.role !== "admin") {
      throw new Error(
        "Unauthorized: You do not have permission to invite admins."
      );
    }

    const token = nanoid(24);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await createAdminInvite({
      email,
      role: role as TUserProfile["role"],
      token,
      expires_at: expiresAt,
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

    // Convert React Email to HTML
    const emailHtml = render(InviteAdminEmail({ email, inviteLink }));

    // Send email via SendGrid
    const isProd = process.env.NODE_ENV === "production";
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "admin@4ourlife.com",
        name: process.env.SENDGRID_FROM_NAME || "4 Our Life",
      },
      subject: "Invitation to join 4 Our Life",
      html: emailHtml,
    };

    const result = await sgMail.send(msg);

    // SendGrid returns an array [response, body]
    return {
      data: {
        id: result[0].headers["x-message-id"],
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Error sending invitation:", error);
    
    // SendGrid error handling
    if (error.response) {
      console.error("SendGrid Error Body:", error.response.body);
    }
    
    return {
      data: null,
      error: error.message || "Failed to send invitation",
    };
  }
}
```

### File 2: Update Package Dependencies (Optional Cleanup)

After verifying SendGrid works, you can optionally remove Resend:

```json
// apps/web/package.json
{
  "dependencies": {
    // Remove this line after migration is complete
    // "resend": "^6.6.0",
    
    // Add this
    "@sendgrid/mail": "^8.1.4"
  }
}
```

---

## 🧪 Testing

### 1. Development Testing

```bash
# Start dev server
npm run dev

# Test the invitation flow:
# 1. Login as admin
# 2. Go to /admins
# 3. Click "Add Admin"
# 4. Enter email and role
# 5. Click "Send Invite"
```

### 2. Check SendGrid Dashboard

1. Go to https://app.sendgrid.com/
2. Navigate to **Activity** → **Email Activity**
3. Verify the email was sent
4. Check delivery status

### 3. Check Email Inbox

1. Check the recipient's inbox
2. Verify email received
3. Test the invitation link
4. Verify styling and formatting

### 4. Error Testing

Test error scenarios:
```typescript
// Test invalid email
inviteAdminAction("invalid-email", "admin");

// Test unauthorized user
// (Login as non-admin and try to send invite)

// Test duplicate invite
inviteAdminAction("same@email.com", "admin");
inviteAdminAction("same@email.com", "admin"); // Should fail
```

### 5. Production Testing

Before going live:
1. Test with your personal email
2. Verify domain authentication works
3. Check spam folder placement
4. Monitor SendGrid analytics

---

## 📊 Comparison: Resend vs SendGrid

| Feature | Resend | SendGrid |
|---------|--------|----------|
| **Free Tier** | 3,000 emails/month | 100 emails/day (3,000/month) |
| **Pricing Start** | $20/month for 50k | $19.95/month for 100k |
| **React Email** | Native support | Manual conversion needed |
| **Analytics** | Basic | Advanced (opens, clicks, etc.) |
| **Deliverability** | Good | Excellent |
| **API Simplicity** | Very simple | Simple |
| **Domain Auth** | Easy | Standard |
| **Support** | Email | Email + Phone (paid) |
| **Webhooks** | Yes | Yes (advanced) |
| **A/B Testing** | No | Yes (advanced plans) |
| **Templates** | Code-based | Code + Visual editor |
| **Setup Time** | 5 minutes | 15-20 minutes |

---

## 🐛 Troubleshooting

### Issue 1: "Unauthorized" Error

**Error**:
```
Error: Unauthorized. You are not authorized to send email.
```

**Solution**:
1. Verify API key is correct
2. Check API key has "Mail Send" permission
3. Regenerate API key if needed

### Issue 2: "From Email Not Verified"

**Error**:
```
Error: The from address does not match a verified Sender Identity.
```

**Solution**:
1. Go to Settings → Sender Authentication
2. Verify the sender email
3. Check your email for verification link
4. Update `SENDGRID_FROM_EMAIL` to match verified email

### Issue 3: Emails Go to Spam

**Solution**:
1. Set up domain authentication (SPF/DKIM)
2. Use a professional email (not @gmail.com)
3. Warm up your sending domain gradually
4. Check SendGrid reputation dashboard

### Issue 4: Rate Limiting

**Error**:
```
Error: Rate limit exceeded
```

**Solution**:
1. Check your SendGrid plan limits
2. Implement delay between sends
3. Upgrade plan if needed

### Issue 5: HTML Not Rendering

**Problem**: Email looks broken or unstyled

**Solution**:
1. Ensure you're using `render()` from `@react-email/render`
2. Check inline styles are applied
3. Test email in multiple clients (Gmail, Outlook, etc.)
4. Use SendGrid's email testing tools

---

## 🔄 Rollback Plan

If you need to revert to Resend:

### Quick Rollback

1. **Revert code changes**:
   ```bash
   git checkout apps/web/actions/authenticate.actions.ts
   ```

2. **Restore environment variable**:
   ```env
   RESEND_API_KEY=re_U2Tpiis3_CceGWEVnTjhQUVUvHk2ktnZh
   ```

3. **Restart server**:
   ```bash
   npm run dev
   ```

### Keep Both (Feature Flag Approach)

You can keep both services and toggle between them:

```typescript
// apps/web/actions/authenticate.actions.ts
const USE_SENDGRID = process.env.USE_SENDGRID === "true";

if (USE_SENDGRID) {
  // SendGrid code
} else {
  // Resend code
}
```

---

## ✅ Migration Checklist

### Pre-Migration
- [ ] Create SendGrid account
- [ ] Get API key
- [ ] Verify sender email
- [ ] Set up domain authentication (optional)
- [ ] Add environment variables
- [ ] Install @sendgrid/mail package

### Code Changes
- [ ] Update authenticate.actions.ts
- [ ] Import @sendgrid/mail
- [ ] Import @react-email/render
- [ ] Initialize SendGrid with API key
- [ ] Convert React email to HTML
- [ ] Update email sending logic
- [ ] Update error handling

### Testing
- [ ] Test in development
- [ ] Check SendGrid dashboard
- [ ] Verify email delivery
- [ ] Test invitation link works
- [ ] Test error scenarios
- [ ] Check spam folder
- [ ] Test on multiple email clients

### Deployment
- [ ] Update production environment variables
- [ ] Deploy to production
- [ ] Monitor first few sends
- [ ] Check SendGrid analytics
- [ ] Update documentation

### Cleanup (Optional)
- [ ] Remove Resend dependency
- [ ] Remove RESEND_API_KEY from env
- [ ] Update package.json
- [ ] Update documentation

---

## 📚 Additional Resources

### SendGrid Documentation
- [Getting Started](https://docs.sendgrid.com/for-developers/sending-email/getting-started-with-sendgrid)
- [Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
- [Email API Reference](https://docs.sendgrid.com/api-reference/mail-send/mail-send)
- [Sender Authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication)

### React Email
- [React Email Docs](https://react.email/docs/introduction)
- [Render Function](https://react.email/docs/utilities/render)
- [Components](https://react.email/docs/components/html)

### Troubleshooting
- [SendGrid Status Page](https://status.sendgrid.com/)
- [Community Forum](https://community.sendgrid.com/)
- [Support Portal](https://support.sendgrid.com/)

---

## 🎯 Quick Start Summary

### Minimal Steps to Migrate

1. **Install SendGrid**:
   ```bash
   npm install @sendgrid/mail --workspace=apps/web
   ```

2. **Add API Key** to `.env.local`:
   ```env
   SENDGRID_API_KEY=your_key_here
   SENDGRID_FROM_EMAIL=admin@4ourlife.com
   ```

3. **Replace code** in `authenticate.actions.ts`:
   ```typescript
   // Old
   import { Resend } from "resend";
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   // New
   import sgMail from "@sendgrid/mail";
   import { render } from "@react-email/render";
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   ```

4. **Update send logic**:
   ```typescript
   // Old
   await resend.emails.send({
     from: "admin@4ourlife.com",
     to: [email],
     subject: "Invitation",
     react: InviteAdminEmail({ email, inviteLink }),
   });
   
   // New
   const html = render(InviteAdminEmail({ email, inviteLink }));
   await sgMail.send({
     to: email,
     from: "admin@4ourlife.com",
     subject: "Invitation",
     html: html,
   });
   ```

5. **Test** and deploy!

---

**Status**: 📖 Ready to Migrate  
**Estimated Time**: 30-45 minutes  
**Difficulty**: Easy  
**Risk Level**: Low (Easy rollback available)

---

*Last Updated: January 2025*

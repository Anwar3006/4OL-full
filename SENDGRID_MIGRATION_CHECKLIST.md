# ✅ SendGrid Migration Checklist

Quick reference for migrating from Resend to Twilio SendGrid.

---

## 🚀 Quick Start (15 Minutes)

### ☑️ Pre-Migration (5 min)
- [ ] Read `MIGRATION_RESEND_TO_SENDGRID.md`
- [ ] Create SendGrid account at https://sendgrid.com
- [ ] Verify email address
- [ ] Get API key from SendGrid dashboard
- [ ] Have `admin@4ourlife.com` ready for sender verification

### ☑️ Setup (5 min)
- [ ] Run setup script: `chmod +x setup-sendgrid.sh && ./setup-sendgrid.sh`
- [ ] Or manually:
  - [ ] Install: `npm install @sendgrid/mail --workspace=apps/web`
  - [ ] Add to `.env.local`:
    ```env
    SENDGRID_API_KEY=your_key_here
    SENDGRID_FROM_EMAIL=admin@4ourlife.com
    SENDGRID_FROM_NAME=4 Our Life
    ```

### ☑️ Code Changes (3 min)
- [ ] Open `apps/web/actions/authenticate.actions.ts`
- [ ] Copy code from `authenticate.actions.sendgrid.ts`
- [ ] Or manually apply changes:
  - [ ] Replace `import { Resend }` with `import sgMail`
  - [ ] Add `import { render } from "@react-email/render"`
  - [ ] Update send logic (see migration guide)

### ☑️ Testing (2 min)
- [ ] Start dev server: `npm run dev`
- [ ] Login as admin
- [ ] Go to `/admins`
- [ ] Send test invitation
- [ ] Check SendGrid dashboard
- [ ] Verify email received

---

## 📋 Detailed Checklist

### Phase 1: Account Setup
- [ ] **Create SendGrid Account**
  - [ ] Sign up at https://sendgrid.com
  - [ ] Verify email address
  - [ ] Complete profile

- [ ] **API Key Creation**
  - [ ] Go to Settings → API Keys
  - [ ] Create new key: "4OL_Admin_Invites"
  - [ ] Select "Full Access" or "Mail Send"
  - [ ] Copy and save API key securely

- [ ] **Sender Verification**
  - [ ] Go to Settings → Sender Authentication
  - [ ] Single Sender Verification
  - [ ] Email: `admin@4ourlife.com`
  - [ ] Name: `4 Our Life`
  - [ ] Verify email via link

- [ ] **Domain Authentication** (Optional but recommended)
  - [ ] Authenticate Your Domain
  - [ ] Add DNS records
  - [ ] Wait for verification

### Phase 2: Installation
- [ ] **Install Package**
  ```bash
  cd /Users/anwarsadat/Desktop/WORK/4OL_full
  npm install @sendgrid/mail --workspace=apps/web
  ```

- [ ] **Verify Installation**
  ```bash
  npm list @sendgrid/mail
  # Should show: @sendgrid/mail@8.x.x
  ```

### Phase 3: Configuration
- [ ] **Environment Variables**
  - [ ] Open `.env.local`
  - [ ] Add:
    ```env
    SENDGRID_API_KEY=SG.your_key_here
    SENDGRID_FROM_EMAIL=admin@4ourlife.com
    SENDGRID_FROM_NAME=4 Our Life
    ```
  - [ ] Save file

- [ ] **Backup Current Code**
  ```bash
  cp apps/web/actions/authenticate.actions.ts \
     apps/web/actions/authenticate.actions.backup.ts
  ```

### Phase 4: Code Changes
- [ ] **Update Imports**
  ```typescript
  // Remove
  import { Resend } from "resend";
  
  // Add
  import sgMail from "@sendgrid/mail";
  import { render } from "@react-email/render";
  ```

- [ ] **Initialize SendGrid**
  ```typescript
  // Remove
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Add
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  ```

- [ ] **Update Send Logic**
  ```typescript
  // Convert React Email to HTML
  const emailHtml = render(InviteAdminEmail({ email, inviteLink }));
  
  // Send via SendGrid
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
  ```

- [ ] **Update Error Handling**
  ```typescript
  if (error.response) {
    console.error("SendGrid Error:", error.response.body);
  }
  ```

### Phase 5: Testing
- [ ] **Development Testing**
  - [ ] Start dev server: `npm run dev`
  - [ ] Login as admin user
  - [ ] Navigate to `/admins`
  - [ ] Click "Add Admin"
  - [ ] Enter test email
  - [ ] Select role
  - [ ] Click "Send Invite"
  - [ ] Check for success message

- [ ] **SendGrid Dashboard**
  - [ ] Go to https://app.sendgrid.com
  - [ ] Navigate to Email Activity
  - [ ] Verify email appears
  - [ ] Check status: "Delivered"

- [ ] **Email Verification**
  - [ ] Check recipient inbox
  - [ ] Verify email received
  - [ ] Check formatting/styling
  - [ ] Test invitation link
  - [ ] Verify link works

- [ ] **Error Testing**
  - [ ] Test invalid email format
  - [ ] Test duplicate invitation
  - [ ] Test unauthorized user
  - [ ] Verify error messages

### Phase 6: Production Deployment
- [ ] **Update Production Env**
  - [ ] Add to Vercel/hosting:
    ```env
    SENDGRID_API_KEY=your_production_key
    SENDGRID_FROM_EMAIL=admin@4ourlife.com
    SENDGRID_FROM_NAME=4 Our Life
    ```

- [ ] **Deploy Code**
  - [ ] Commit changes
  - [ ] Push to repository
  - [ ] Trigger deployment
  - [ ] Wait for build completion

- [ ] **Production Testing**
  - [ ] Send test invitation in production
  - [ ] Verify delivery
  - [ ] Check analytics

- [ ] **Monitoring**
  - [ ] Monitor first 10 emails
  - [ ] Check delivery rates
  - [ ] Verify no errors in logs

### Phase 7: Cleanup (Optional)
- [ ] **Remove Resend** (if migration successful)
  - [ ] Remove from `package.json`
  - [ ] Run `npm install`
  - [ ] Remove `RESEND_API_KEY` from env

- [ ] **Update Documentation**
  - [ ] Update README if needed
  - [ ] Document SendGrid setup
  - [ ] Archive migration docs

---

## 🧪 Test Scenarios

### Must Test
- [x] Happy path: Send invitation to new admin
- [ ] Error: Invalid email format
- [ ] Error: Duplicate invitation
- [ ] Error: Unauthorized user (non-admin)
- [ ] Edge: Multiple rapid invites
- [ ] Edge: Special characters in email
- [ ] Edge: Very long email addresses

### Email Content Tests
- [ ] Email arrives in inbox (not spam)
- [ ] Subject line correct
- [ ] From name/email correct
- [ ] Styling renders correctly
- [ ] Images load (if any)
- [ ] Links work correctly
- [ ] Mobile responsive

### Analytics Tests
- [ ] Email shows in SendGrid dashboard
- [ ] Delivery status tracked
- [ ] Open tracking works (if enabled)
- [ ] Click tracking works (if enabled)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unauthorized" Error
**Solution**: Verify API key is correct and has Mail Send permission

### Issue 2: "From email not verified"
**Solution**: Complete sender verification in SendGrid dashboard

### Issue 3: Emails go to spam
**Solution**: Set up domain authentication (SPF/DKIM)

### Issue 4: Module not found
**Solution**: Run `npm install @sendgrid/mail --workspace=apps/web`

### Issue 5: Environment variables not loaded
**Solution**: Restart dev server after updating .env.local

---

## 📊 Success Criteria

Migration is successful when:
- ✅ Emails send without errors
- ✅ Emails arrive in inbox (not spam)
- ✅ Email content looks correct
- ✅ Invitation links work
- ✅ SendGrid dashboard shows delivery
- ✅ No console errors
- ✅ Production deployment successful

---

## 🔄 Rollback Plan

If something goes wrong:

1. **Revert Code**:
   ```bash
   cp apps/web/actions/authenticate.actions.backup.ts \
      apps/web/actions/authenticate.actions.ts
   ```

2. **Restore Env Var**:
   ```env
   RESEND_API_KEY=re_U2Tpiis3_CceGWEVnTjhQUVUvHk2ktnZh
   ```

3. **Restart Server**:
   ```bash
   npm run dev
   ```

---

## 📞 Support Resources

### SendGrid
- Dashboard: https://app.sendgrid.com
- Docs: https://docs.sendgrid.com
- Status: https://status.sendgrid.com
- Support: https://support.sendgrid.com

### Project
- Migration Guide: `MIGRATION_RESEND_TO_SENDGRID.md`
- Comparison: `RESEND_VS_SENDGRID_COMPARISON.md`
- Code Sample: `authenticate.actions.sendgrid.ts`

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Account Setup | 5 min |
| Package Installation | 1 min |
| Code Changes | 3 min |
| Testing | 2 min |
| Documentation | 2 min |
| **Total** | **~15 min** |

---

## 🎯 Quick Commands

```bash
# 1. Setup (automated)
chmod +x setup-sendgrid.sh
./setup-sendgrid.sh

# 2. Manual install
npm install @sendgrid/mail --workspace=apps/web

# 3. Test
npm run dev

# 4. Backup
cp apps/web/actions/authenticate.actions.ts \
   apps/web/actions/authenticate.actions.backup.ts

# 5. Rollback
cp apps/web/actions/authenticate.actions.backup.ts \
   apps/web/actions/authenticate.actions.ts
```

---

**Status**: Ready to migrate ✅  
**Difficulty**: Easy  
**Time Required**: 15 minutes  
**Risk**: Low

---

*Start migration when ready, and refer to the detailed guide for any questions!*

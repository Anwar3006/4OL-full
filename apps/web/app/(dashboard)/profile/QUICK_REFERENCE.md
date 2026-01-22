# User Profile - Quick Reference

## 🚀 Quick Start

### Access the Profile
1. Login to the application
2. Click on your avatar in the sidebar
3. Select "My Profile"

Or navigate directly to: `http://localhost:3000/profile`

## 📝 Component Overview

```
profile/
├── page.tsx                    # Main profile page
├── loading.tsx                 # Loading skeleton
└── _components/
    ├── profile-header.tsx      # Avatar + user info
    ├── edit-profile-form.tsx   # Edit name/email
    ├── change-password-form.tsx # Password management
    └── account-security.tsx    # Security settings
```

## 🔧 Common Tasks

### Update User Name
```typescript
await authClient.updateUser({
  name: "New Name"
});
```

### Change Email
```typescript
await authClient.changeEmail({
  newEmail: "new@email.com",
  callbackURL: "/profile"
});
```

### Change Password
```typescript
await authClient.changePassword({
  currentPassword: "old_password",
  newPassword: "new_password",
  revokeOtherSessions: false
});
```

### Delete Account
```typescript
await authClient.deleteUser();
```

## 🎨 Styling Classes

### Key Tailwind Classes Used
- `bg-gradient-to-br from-primary/5` - Header gradient
- `shadow-lg` - Card shadows
- `rounded-xl` - Rounded corners
- `animate-in fade-in duration-500` - Page animations
- `grid md:grid-cols-2 gap-6` - Responsive grid

### Color Scheme
- Primary: `bg-primary` (System theme color)
- Success: `bg-green-500` (Verified badges)
- Destructive: `bg-destructive` (Delete actions)
- Muted: `bg-muted/50` (Background sections)

## 🔐 Validation Schemas

### Profile Schema
```typescript
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
});
```

### Password Schema
```typescript
const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default:   Full width, stacked layout
md:        Two-column grid (768px+)
lg:        Optimized spacing (1024px+)
```

## 🎯 Props & Types

### ProfileHeader
```typescript
interface ProfileHeaderProps {
  user: TBetterAuthUser & {
    role?: string;
    createdAt?: string;
  };
}
```

### EditProfileForm
```typescript
interface EditProfileFormProps {
  user: TBetterAuthUser;
}
```

### AccountSecurity
```typescript
interface AccountSecurityProps {
  user: TBetterAuthUser;
}
```

## 🔄 State Management

### Form States
```typescript
const [isEditing, setIsEditing] = useState(false);
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
```

### Session Hook
```typescript
const { data: session, isPending, error } = authClient.useSession();
```

## 🎨 Icons Used

```typescript
import {
  Mail,        // Email indicator
  Phone,       // Phone indicator
  Calendar,    // Date indicator
  Shield,      // Security/verification
  User,        // User icon
  Lock,        // Password/security
  Eye/EyeOff,  // Password visibility
  AlertTriangle, // Warnings
  CheckCircle2,  // Success states
  Loader2,     // Loading spinner
} from "lucide-react";
```

## ⚡ Performance Tips

### Optimizations
- Client-side rendering for interactivity
- Form state managed locally
- Optimistic UI updates
- Debounced form validation
- Lazy loading where possible

## 🐛 Debugging

### Common Console Checks
```javascript
// Check session
console.log(session);

// Check form values
console.log(form.getValues());

// Check errors
console.log(form.formState.errors);
```

### Network Tab
- Check `/api/auth/update-user` requests
- Verify `/api/auth/change-email` calls
- Monitor `/api/auth/change-password` responses

## 📊 Better Auth Methods

### Client Methods
```typescript
authClient.useSession()          // Get current session
authClient.updateUser()          // Update user info
authClient.changeEmail()         // Change email
authClient.changePassword()      // Change password
authClient.deleteUser()          // Delete account
authClient.signOut()            // Logout
```

## 🎁 Features Summary

✅ **Implemented**
- Profile viewing
- Name editing
- Email change (with verification)
- Password change
- Account deletion
- Email verification status
- Responsive design
- Loading states
- Error handling
- Success notifications

❌ **Not Included** (Future)
- Profile picture upload
- Two-factor authentication
- Login history
- Device management
- Privacy settings

## 📦 Dependencies

```json
{
  "better-auth": "^1.4.7",
  "react-hook-form": "^7.69.0",
  "zod": "^4.2.1",
  "date-fns": "^4.1.0",
  "sonner": "^2.0.7",
  "lucide-react": "^0.562.0"
}
```

## 🔗 Important Files

### Read First
1. `IMPLEMENTATION_SUMMARY.md` - Complete overview
2. `README.md` - Detailed documentation
3. `EMAIL_INTEGRATION_GUIDE.md` - Email setup

### Code Files
1. `page.tsx` - Entry point
2. `profile-header.tsx` - User display
3. `edit-profile-form.tsx` - Profile editing
4. `change-password-form.tsx` - Password management
5. `account-security.tsx` - Security features

## 💡 Tips

1. **Testing**: Use a test account for dangerous operations
2. **Email**: Set up email service for production
3. **Security**: Always require current password for changes
4. **UX**: Show loading states for all async operations
5. **Validation**: Client and server-side validation

## 🆘 Need Help?

1. Check `README.md` for detailed docs
2. Review `IMPLEMENTATION_SUMMARY.md`
3. See `EMAIL_INTEGRATION_GUIDE.md` for email setup
4. Check Better Auth docs: https://www.better-auth.com/docs
5. Review component source code with comments

## ✨ Quick Commands

```bash
# Start dev server
npm run dev

# Navigate to profile
open http://localhost:3000/profile

# Check TypeScript errors
npm run lint
```

---

**Last Updated**: 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready

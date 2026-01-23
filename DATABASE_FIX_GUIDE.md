# ========================================
# DATABASE CONFIGURATION FIX
# ========================================
# 
# ISSUE: Password mismatch between pooler and direct URLs
# 
# ACTION REQUIRED:
# 1. Go to Supabase Dashboard → Settings → Database
# 2. Copy the CORRECT connection string
# 3. Replace BOTH URLs below with the correct password
# 4. Ensure both use the SAME password
#
# Current Issue:
# - SUPABASE_DATABASE_URL has password: 4ourlife_4OL5
# - SUPABASE_DIRECT_URL has password: 4ourlife_4OL
#
# ========================================

# CRITICAL: Update with the CORRECT password from Supabase Dashboard
# Both URLs must use the SAME password

# Option 1: If the password is "4ourlife_4OL5" (with 5 at the end)
SUPABASE_DATABASE_URL=postgresql://postgres.rhbbxttxnvcziyqzptqs:4ourlife_4OL5@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_DIRECT_URL=postgresql://postgres.rhbbxttxnvcziyqzptqs:4ourlife_4OL5@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# Option 2: If the password is "4ourlife_4OL" (without 5)
# SUPABASE_DATABASE_URL=postgresql://postgres.rhbbxttxnvcziyqzptqs:4ourlife_4OL@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
# SUPABASE_DIRECT_URL=postgresql://postgres.rhbbxttxnvcziyqzptqs:4ourlife_4OL@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# ========================================
# HOW TO FIND THE CORRECT PASSWORD:
# ========================================
# 1. Login to https://supabase.com/dashboard
# 2. Select your project: rhbbxttxnvcziyqzptqs
# 3. Go to: Settings → Database
# 4. Look for "Connection string"
# 5. Click "Connection pooling" or "Session mode"
# 6. Copy the password from there
# 7. Update both URLs above with that password
# ========================================

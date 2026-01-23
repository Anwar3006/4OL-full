#!/bin/bash

# Database Connection Fix Script
# This script helps you verify and fix the database connection

echo "🔍 Checking database connection configuration..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local file in the root directory"
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Extract database URLs
echo "📋 Current Database Configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep "SUPABASE_DATABASE_URL" .env.local | head -1
grep "SUPABASE_DIRECT_URL" .env.local | head -1
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⚠️  ISSUE DETECTED:"
echo "The passwords in SUPABASE_DATABASE_URL and SUPABASE_DIRECT_URL don't match!"
echo ""

echo "🔧 TO FIX:"
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your project: rhbbxttxnvcziyqzptqs"
echo "3. Navigate to: Settings → Database"
echo "4. Copy the connection string with the CORRECT password"
echo "5. Update BOTH URLs in .env.local with the same password"
echo ""

echo "📝 EXAMPLE:"
echo "If your password is '4ourlife_4OL5', both URLs should have:"
echo "  ...postgres.rhbbxttxnvcziyqzptqs:4ourlife_4OL5@..."
echo ""

echo "❓ Need Help?"
echo "Read: DATABASE_FIX_GUIDE.md for detailed instructions"
echo ""

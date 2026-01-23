#!/bin/bash

# ===================================================================
# SendGrid Migration Setup Script
# ===================================================================
# This script helps you set up Twilio SendGrid to replace Resend
# for sending admin invitation emails
# ===================================================================

set -e  # Exit on error

echo ""
echo "🚀 Twilio SendGrid Migration Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ===================================================================
# Step 1: Check Prerequisites
# ===================================================================
echo "📋 Step 1: Checking prerequisites..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "✅ In project root directory"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

echo "✅ Node.js is installed ($(node --version))"

# Check for npm/pnpm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm add"
    WORKSPACE_FLAG="--filter @4ol/web"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install"
    WORKSPACE_FLAG="--workspace=apps/web"
else
    echo "❌ Error: Neither npm nor pnpm found"
    exit 1
fi

echo "✅ Package manager: $PKG_MANAGER"
echo ""

# ===================================================================
# Step 2: Install SendGrid Package
# ===================================================================
echo "📦 Step 2: Installing @sendgrid/mail..."
echo ""

read -p "Install SendGrid package? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing @sendgrid/mail..."
    $INSTALL_CMD @sendgrid/mail $WORKSPACE_FLAG
    echo "✅ SendGrid package installed"
else
    echo "⏭️  Skipping package installation"
fi

echo ""

# ===================================================================
# Step 3: Environment Variables
# ===================================================================
echo "🔧 Step 3: Setting up environment variables..."
echo ""

if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    read -p "Create .env.local file? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        touch .env.local
        echo "✅ Created .env.local"
    else
        echo "❌ Cancelled: Please create .env.local manually"
        exit 1
    fi
fi

echo ""
echo "📝 Please provide your SendGrid credentials:"
echo ""

# Get SendGrid API Key
read -p "SendGrid API Key: " SENDGRID_API_KEY

# Get From Email
read -p "From Email (e.g., admin@4ourlife.com): " SENDGRID_FROM_EMAIL

# Get From Name
read -p "From Name (e.g., 4 Our Life): " SENDGRID_FROM_NAME

# Validate inputs
if [ -z "$SENDGRID_API_KEY" ]; then
    echo "❌ Error: SendGrid API Key is required"
    exit 1
fi

if [ -z "$SENDGRID_FROM_EMAIL" ]; then
    echo "❌ Error: From Email is required"
    exit 1
fi

if [ -z "$SENDGRID_FROM_NAME" ]; then
    SENDGRID_FROM_NAME="4 Our Life"
fi

# Add to .env.local
echo "" >> .env.local
echo "# ================================================" >> .env.local
echo "# SendGrid Configuration (Added by migration script)" >> .env.local
echo "# Date: $(date '+%Y-%m-%d %H:%M:%S')" >> .env.local
echo "# ================================================" >> .env.local
echo "SENDGRID_API_KEY=$SENDGRID_API_KEY" >> .env.local
echo "SENDGRID_FROM_EMAIL=$SENDGRID_FROM_EMAIL" >> .env.local
echo "SENDGRID_FROM_NAME=$SENDGRID_FROM_NAME" >> .env.local
echo "" >> .env.local

echo "✅ Environment variables added to .env.local"
echo ""

# ===================================================================
# Step 4: Backup Current Code
# ===================================================================
echo "💾 Step 4: Creating backup..."
echo ""

BACKUP_FILE="apps/web/actions/authenticate.actions.backup.$(date +%Y%m%d_%H%M%S).ts"

if [ -f "apps/web/actions/authenticate.actions.ts" ]; then
    cp apps/web/actions/authenticate.actions.ts "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
else
    echo "⚠️  Warning: authenticate.actions.ts not found"
fi

echo ""

# ===================================================================
# Step 5: Show Next Steps
# ===================================================================
echo "✅ Setup Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 📖 Read the migration guide:"
echo "   cat MIGRATION_RESEND_TO_SENDGRID.md"
echo ""
echo "2. 📝 Update authenticate.actions.ts:"
echo "   Use the code from: authenticate.actions.sendgrid.ts"
echo "   Or manually apply changes from the guide"
echo ""
echo "3. 🧪 Test the migration:"
echo "   npm run dev"
echo "   Navigate to /admins and send a test invite"
echo ""
echo "4. 📊 Verify in SendGrid Dashboard:"
echo "   https://app.sendgrid.com/email_activity"
echo ""
echo "5. 🚀 Deploy to production:"
echo "   Update production env vars"
echo "   Deploy your changes"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   Migration Guide: MIGRATION_RESEND_TO_SENDGRID.md"
echo "   Updated Code: authenticate.actions.sendgrid.ts"
echo "   Backup: $BACKUP_FILE"
echo ""
echo "❓ Need Help?"
echo "   • Check the troubleshooting section in the migration guide"
echo "   • SendGrid Docs: https://docs.sendgrid.com/"
echo "   • SendGrid Status: https://status.sendgrid.com/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Happy migrating!"
echo ""

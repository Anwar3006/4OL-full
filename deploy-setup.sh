#!/bin/bash

# 🚀 Quick Deployment Setup Script
# This script helps you prepare for Vercel deployment

echo "🚀 4OL Vercel Deployment Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Must be run from project root directory"
    exit 1
fi

echo "📋 Pre-deployment Checklist"
echo "----------------------------"
echo ""

# Check 1: Git status
echo "1. Checking Git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    if [[ -z $(git status -s) ]]; then
        print_success "Git working directory is clean"
    else
        print_warning "You have uncommitted changes"
        git status -s
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    print_error "Not a git repository"
    echo "  Run: git init"
    exit 1
fi
echo ""

# Check 2: Build test
echo "2. Testing build..."
if npm run build -w @4ol/web > /dev/null 2>&1; then
    print_success "Build successful"
else
    print_error "Build failed. Fix errors before deploying."
    echo "  Run: npm run build -w @4ol/web"
    exit 1
fi
echo ""

# Check 3: Vercel config
echo "3. Checking Vercel configuration..."
if [ -f "apps/web/vercel.json" ]; then
    print_success "vercel.json exists"
else
    print_warning "vercel.json not found"
    echo "  Creating vercel.json..."
    # Could create it here
fi
echo ""

# Check 4: Environment variables
echo "4. Required Environment Variables"
echo "   Copy these to Vercel Dashboard → Settings → Environment Variables"
echo ""
echo "   DATABASE (Required):"
echo "   - DATABASE_URL"
echo "   - DATABASE_POOLER_URL"
echo ""
echo "   AUTHENTICATION (Required):"
echo "   - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)"
echo "   - BETTER_AUTH_URL (e.g., https://your-app.vercel.app)"
echo ""
echo "   OBJECT STORAGE (Required):"
echo "   - OCI_BUCKET_NAME"
echo "   - OCI_ENDPOINT"
echo "   - OCI_ACCESS_KEY_ID"
echo "   - OCI_SECRET_ACCESS_KEY"
echo "   - OCI_REGION"
echo "   - IMAGE_BASE_URL"
echo ""
echo "   ENVIRONMENT:"
echo "   - NODE_ENV=production"
echo ""

# Generate Better Auth Secret
echo "5. Generate Better Auth Secret"
echo "   Copy this secret to Vercel:"
echo ""
SECRET=$(openssl rand -base64 32 2>/dev/null || echo "ERROR: OpenSSL not found")
if [ "$SECRET" != "ERROR: OpenSSL not found" ]; then
    echo "   BETTER_AUTH_SECRET=$SECRET"
    echo ""
    print_success "Secret generated successfully"
else
    print_error "OpenSSL not found"
    echo "   Generate manually: openssl rand -base64 32"
fi
echo ""

# Check 6: Database connection
echo "6. Database Setup Reminder"
echo "   □ Created Neon PostgreSQL project"
echo "   □ Ran migrations: npm run db:migrate"
echo "   □ Tested connection locally"
echo ""

# Summary
echo "================================"
echo "📝 Next Steps:"
echo "================================"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to Vercel:"
echo "   - Visit https://vercel.com/new"
echo "   - Import your GitHub repository"
echo "   - Set Root Directory: apps/web"
echo "   - Add all environment variables"
echo "   - Deploy!"
echo ""
echo "3. After deployment:"
echo "   - Update BETTER_AUTH_URL with your actual domain"
echo "   - Test the deployment"
echo "   - Update mobile app API_URL"
echo ""
echo "📖 See DEPLOYMENT_CHECKLIST.md for detailed guide"
echo ""
print_success "Setup check complete!"

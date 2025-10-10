#!/bin/bash

# Deployment script for bharmaspace.com
echo "🚀 Starting deployment for bharmaspace.com..."

# Set production environment
export NODE_ENV=production
export NEXT_PUBLIC_SITE_URL=https://bharmaspace.com
export NEXT_PUBLIC_API_URL=https://api.bharmaspace.com

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Your application is ready for deployment to bharmaspace.com"
    echo ""
    echo "📋 Next steps:"
    echo "1. Upload the .next folder to your hosting provider"
    echo "2. Configure your domain bharmaspace.com to point to your server"
    echo "3. Set up SSL certificate for HTTPS"
    echo "4. Configure your backend API at https://api.bharmaspace.com"
    echo ""
    echo "🔧 Environment variables to set on your hosting provider:"
    echo "NODE_ENV=production"
    echo "NEXT_PUBLIC_SITE_URL=https://bharmaspace.com"
    echo "NEXT_PUBLIC_API_URL=https://api.bharmaspace.com"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

@echo off
echo 🚀 Starting deployment for bharmaspace.com...

REM Set production environment
set NODE_ENV=production
set NEXT_PUBLIC_SITE_URL=https://bharmaspace.com
set NEXT_PUBLIC_API_URL=http://43.205.120.197:8000

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm ci

REM Build the application
echo 🔨 Building application...
npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🌐 Your application is ready for deployment to bharmaspace.com
    echo.
    echo 📋 Next steps:
    echo 1. Upload the .next folder to your hosting provider
    echo 2. Configure your domain bharmaspace.com to point to your server
    echo 3. Set up SSL certificate for HTTPS
    echo 4. Configure your backend API at http://43.205.120.197:8000
    echo.
    echo 🔧 Environment variables to set on your hosting provider:
    echo NODE_ENV=production
    echo NEXT_PUBLIC_SITE_URL=https://bharmaspace.com
    echo NEXT_PUBLIC_API_URL=http://43.205.120.197:8000
) else (
    echo ❌ Build failed! Please check the errors above.
    exit /b 1
)

@echo off
REM Vercel Build Script for PMArchitect.ai (Windows)
REM This script ensures Prisma Client is generated correctly during Vercel deployment

echo 🚀 Starting Vercel build process...

REM Check if we're in a Vercel environment
if defined VERCEL (
    echo ✅ Detected Vercel environment
    
    REM Ensure Prisma Client is generated
    echo 📦 Generating Prisma Client...
    call npx prisma generate
    
    REM Verify Prisma Client was generated
    if exist "node_modules\.prisma" (
        echo ✅ Prisma Client generated successfully
    ) else (
        echo ❌ Prisma Client generation failed
        exit /b 1
    )
) else (
    echo ℹ️  Local environment detected
)

REM Build the Next.js application
echo 🔨 Building Next.js application...
call npm run build

echo ✅ Vercel build completed successfully!

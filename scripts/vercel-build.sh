#!/bin/bash

# Vercel Build Script for PMArchitect.ai
# This script ensures Prisma Client is generated correctly during Vercel deployment

set -e

echo "🚀 Starting Vercel build process..."

# Check if we're in a Vercel environment
if [ -n "$VERCEL" ]; then
    echo "✅ Detected Vercel environment"
    
    # Ensure Prisma Client is generated
    echo "📦 Generating Prisma Client..."
    npx prisma generate
    
    # Verify Prisma Client was generated
    if [ -d "node_modules/.prisma" ]; then
        echo "✅ Prisma Client generated successfully"
    else
        echo "❌ Prisma Client generation failed"
        exit 1
    fi
else
    echo "ℹ️  Local environment detected"
fi

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Vercel build completed successfully!"

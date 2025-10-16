#!/bin/bash

# Production Database Setup Script
# This script sets up the production database and runs migrations

set -e

echo "🚀 Setting up production database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Verify database connection
echo "🔍 Verifying database connection..."
npx prisma db execute --stdin <<< "SELECT 1;"

echo "✅ Production database setup completed successfully!"
echo "🌐 Your PMArchitect.ai application is ready to serve!"

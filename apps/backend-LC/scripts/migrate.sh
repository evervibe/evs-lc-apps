#!/bin/bash

# LC Backend Database Migration Script
# Run this to apply database migrations

set -e

echo "🔄 Starting database migration..."

cd "$(dirname "$0")/../apps/lc_api/backend"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Check if Prisma CLI is available
if ! command -v prisma &> /dev/null; then
    echo "📦 Installing Prisma CLI..."
    npm install -g prisma
fi

# Run migrations
echo "📋 Applying migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "✅ Database migration completed successfully!"

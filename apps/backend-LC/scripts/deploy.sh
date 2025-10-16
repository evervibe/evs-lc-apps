#!/bin/bash

# LC Backend Deployment Script
# Complete deployment: pull, build, migrate, and restart

set -e

echo "🚀 Starting LC Backend deployment..."

# Configuration
APP_DIR="$(dirname "$0")/.."
BACKEND_DIR="$APP_DIR/apps/lc_api/backend"
BACKUP_DIR="/var/backups/lc-api"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Navigate to app directory
cd "$APP_DIR"

# 1. Backup current version
echo "📦 Creating backup..."
if [ -d "$BACKEND_DIR/dist" ]; then
    tar -czf "$BACKUP_DIR/lc-api-backup-$DATE.tar.gz" -C "$BACKEND_DIR" dist node_modules
    echo "✅ Backup created: $BACKUP_DIR/lc-api-backup-$DATE.tar.gz"
fi

# 2. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 3. Install dependencies
echo "📦 Installing dependencies..."
cd "$BACKEND_DIR"
npm install --production=false

# 4. Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy
npx prisma generate

# 5. Build application
echo "🔨 Building application..."
npm run build

# 6. Restart application
echo "🔄 Restarting application..."

if command -v pm2 &> /dev/null; then
    # Using PM2
    echo "Using PM2..."
    pm2 restart lc-api || pm2 start dist/main.js --name lc-api
    pm2 save
elif command -v systemctl &> /dev/null; then
    # Using systemd
    echo "Using systemd..."
    sudo systemctl restart lc-api
else
    echo "⚠️  No process manager found. Please restart manually."
fi

# 7. Health check
echo "🏥 Running health check..."
sleep 5

HEALTH_URL="${API_URL:-http://localhost:4000}/health"
HEALTH_RESPONSE=$(curl -s "$HEALTH_URL" || echo '{"status":"error"}')

if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Deployment successful!"
    echo "📊 Health check passed"
    echo "🌐 API is running at: ${API_URL:-http://localhost:4000}"
    echo "📚 Documentation: ${API_URL:-http://localhost:4000}/api/docs"
else
    echo "❌ Deployment may have failed!"
    echo "Health check response: $HEALTH_RESPONSE"
    echo "Please check application logs"
    exit 1
fi

# 8. Cleanup old backups (keep last 7)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "lc-api-backup-*.tar.gz" -mtime +7 -delete

echo "✅ Deployment completed successfully!"
echo ""
echo "📝 Deployment Summary:"
echo "   - Backup: $BACKUP_DIR/lc-api-backup-$DATE.tar.gz"
echo "   - Version: $(cat $APP_DIR/VERSION)"
echo "   - Time: $(date)"

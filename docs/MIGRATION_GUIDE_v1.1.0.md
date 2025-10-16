# Migration Guide: v1.0.2 → v1.1.0

**Release Date:** 2025-10-16  
**Migration Complexity:** Medium  
**Estimated Time:** 2-3 hours

---

## Overview

Version 1.1.0 introduces significant enhancements to the portal database, implements the Game Bridge Worker foundation, and upgrades authentication features. This guide will help you migrate from v1.0.2 to v1.1.0 safely.

---

## 🎯 What's New in v1.1.0

### Major Features

1. **Portal Database Enhancements**
   - Extended user profiles with social features
   - Portal-specific roles and permissions system
   - Game synchronization status tracking

2. **Game Bridge Worker (Foundation)**
   - NestJS-based worker for MySQL→PostgreSQL sync
   - Redis-powered job queue system
   - Character, inventory, and guild sync workers

3. **Auth Improvements**
   - Backup codes for 2FA
   - Enhanced session management
   - Rate limiting for 2FA attempts

4. **Infrastructure Updates**
   - CI/CD pipeline for Game Bridge Worker
   - Updated documentation structure
   - Enhanced environment validation

---

## 📋 Pre-Migration Checklist

Before starting the migration, ensure you have:

- [ ] **Backup all databases** (PostgreSQL portal + MySQL game DBs)
- [ ] **Backup .env files** from all applications
- [ ] **Review current VERSION** (should be v1.0.2)
- [ ] **Stop all running services**
- [ ] **Note current system state** (active users, pending transactions)
- [ ] **Read this guide completely** before starting

---

## 🔧 Migration Steps

### Step 1: Pull Latest Code

```bash
cd /path/to/evs-lc-apps

# Stash any local changes
git stash

# Pull latest code
git fetch origin
git checkout v1.1.0

# Or for latest main branch
git pull origin main
```

### Step 2: Update Dependencies

```bash
# Install/update all dependencies
pnpm install

# Update Prisma client
cd apps/lc_api/api-server
npx prisma generate
```

### Step 3: Update Environment Variables

**New variables required for v1.1.0:**

#### Backend API (.env in apps/lc_api/api-server/)

```env
# Game Bridge Configuration
GAME_BRIDGE_ENABLED=true
GAME_BRIDGE_SYNC_INTERVAL=300000  # 5 minutes in ms

# Redis Configuration (required for Game Bridge)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Enhanced Auth
TOTP_BACKUP_CODES_COUNT=10
SESSION_MAX_AGE=86400000  # 24 hours in ms
```

#### Game Bridge Worker (.env in apps/lc_game_bridge/)

Create new `.env` file:

```env
# Node Environment
NODE_ENV=production
PORT=5000

# PostgreSQL Portal Database
PORTAL_DATABASE_URL=postgresql://lcuser:lcpass@localhost:5432/lc_portal

# MySQL Game Databases
GAME_DB_HOST=localhost
GAME_DB_PORT=3306
GAME_DB_USER=lcgame
GAME_DB_PASSWORD=lcgamepass
GAME_DB_AUTH=lc_auth
GAME_DB_DATA=lc_data
GAME_DB_LOGS=lc_logs

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Sync Configuration
SYNC_INTERVAL_CHARACTER=300000  # 5 minutes
SYNC_INTERVAL_INVENTORY=600000  # 10 minutes
SYNC_INTERVAL_GUILD=900000      # 15 minutes
SYNC_BATCH_SIZE=100

# Logging
LOG_LEVEL=info
```

**See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete reference.**

### Step 4: Database Migrations

**⚠️ IMPORTANT: Backup your database before running migrations!**

```bash
cd apps/lc_api/api-server

# Create database backup
pg_dump lc_portal > backup_v1.0.2_$(date +%Y%m%d_%H%M%S).sql

# Run migrations
npx prisma migrate deploy

# Verify migration
npx prisma migrate status
```

**Expected migrations:**
- `20250116_portal_user_profiles` - Adds UserProfile table
- `20250116_portal_roles_permissions` - Adds PortalRole and PortalPermission tables
- `20250116_game_sync_status` - Adds GameSyncStatus table

### Step 5: Build All Applications

```bash
# From repository root
cd /path/to/evs-lc-apps

# Build all applications
pnpm build

# Verify builds completed successfully
ls -la apps/lc_api/api-server/dist
ls -la apps/lc_apps/web-portal/.next
ls -la apps/lc_apps/web-admin/.next
ls -la apps/lc_game_bridge/dist  # New in v1.1.0
```

### Step 6: Run Tests

```bash
# Run all tests to ensure compatibility
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

### Step 7: Start Services

**With Docker Compose (Recommended):**

```bash
# Update docker-compose.prod.yml with new services
docker compose -f docker-compose.prod.yml up -d

# Check service status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

**Manual Start:**

```bash
# Terminal 1: API Server
cd apps/lc_api/api-server
npm run start:prod

# Terminal 2: Game Bridge Worker (NEW)
cd apps/lc_game_bridge
npm run start:prod

# Terminal 3: Web Portal
cd apps/lc_apps/web-portal
pnpm start

# Terminal 4: Web Admin
cd apps/lc_apps/web-admin
pnpm start
```

### Step 8: Verify Migration

**Health Checks:**

```bash
# API Server
curl http://localhost:4000/health
curl http://localhost:4000/health/version

# Game Bridge Worker
curl http://localhost:5000/health

# Web Portal
curl http://localhost:3000

# Web Admin
curl http://localhost:3001
```

**Expected Response (API /health/version):**
```json
{
  "version": "1.1.0",
  "environment": "production",
  "uptime": 123.45
}
```

---

## 🔄 Database Schema Changes

### New Tables

#### 1. portal_user_profiles

Extended user profile information:

```sql
CREATE TABLE "portal_user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "bannerUrl" TEXT,
    "location" TEXT,
    "website" TEXT,
    "showOnline" BOOLEAN NOT NULL DEFAULT true,
    "allowFriends" BOOLEAN NOT NULL DEFAULT true,
    "allowMessages" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginIp" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "totalLogins" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "portal_user_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "portal_user_profiles_userId_key" ON "portal_user_profiles"("userId");
```

#### 2. portal_roles

Portal-specific role management:

```sql
CREATE TABLE "portal_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "portal_roles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "portal_roles_name_key" ON "portal_roles"("name");
CREATE INDEX "portal_roles_priority_idx" ON "portal_roles"("priority");
```

#### 3. portal_permissions

Fine-grained permissions:

```sql
CREATE TABLE "portal_permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "portal_permissions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "portal_permissions_name_key" ON "portal_permissions"("name");
CREATE INDEX "portal_permissions_resource_action_idx" ON "portal_permissions"("resource", "action");
```

#### 4. game_sync_status

Game synchronization tracking:

```sql
CREATE TABLE "game_sync_status" (
    "id" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "gameServerId" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "game_sync_status_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "game_sync_status_syncType_gameServerId_idx" ON "game_sync_status"("syncType", "gameServerId");
CREATE INDEX "game_sync_status_lastSyncAt_idx" ON "game_sync_status"("lastSyncAt");
```

### Modified Tables

**portal_users** - No changes to existing schema, new UserProfile relation added

---

## 🆕 New Features & Usage

### 1. Extended User Profiles

**Creating/Updating User Profile:**

```typescript
// API endpoint: POST /api/users/profile
const profile = await api.post('/users/profile', {
  displayName: 'MyGameName',
  bio: 'Experienced player since 2020',
  avatarUrl: 'https://example.com/avatar.jpg',
  showOnline: true,
  allowFriends: true
});
```

**Frontend Usage:**

```tsx
import { useUserProfile } from '@/hooks/useUserProfile';

function ProfilePage() {
  const { profile, updateProfile } = useUserProfile();
  
  return (
    <ProfileForm
      initialData={profile}
      onSubmit={updateProfile}
    />
  );
}
```

### 2. Game Bridge Worker

**Starting the Worker:**

```bash
cd apps/lc_game_bridge
npm run start:prod
```

**Monitoring Sync Status:**

```bash
# Check sync status
curl http://localhost:5000/api/sync/status

# Expected response:
{
  "character": {
    "lastSyncAt": "2025-10-16T19:00:00Z",
    "status": "success",
    "recordsProcessed": 1234
  },
  "inventory": {
    "lastSyncAt": "2025-10-16T19:05:00Z",
    "status": "success",
    "recordsProcessed": 5678
  }
}
```

**Manual Sync Trigger:**

```bash
# Trigger character sync
curl -X POST http://localhost:5000/api/sync/character

# Trigger inventory sync
curl -X POST http://localhost:5000/api/sync/inventory
```

### 3. Backup Codes for 2FA

**Generating Backup Codes:**

```typescript
// API endpoint: POST /api/auth/2fa/backup-codes
const { codes } = await api.post('/auth/2fa/backup-codes');

// codes: ['ABC123DE', 'FGH456IJ', ...]
// Store these securely! They can only be viewed once.
```

**Using Backup Code:**

```typescript
// Login with backup code instead of TOTP
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password',
  backupCode: 'ABC123DE'
});
```

---

## ⚠️ Breaking Changes

### None in v1.1.0

This release is **fully backward compatible** with v1.0.2. No breaking changes to existing APIs or features.

**What's Safe:**
- All v1.0.2 API endpoints work unchanged
- Existing database data is preserved
- Frontend applications require no code changes
- Environment variables from v1.0.2 still work (new ones are optional)

**Recommended Updates:**
- Add new environment variables for optimal performance
- Enable Game Bridge Worker for real-time sync
- Update to use new user profile features

---

## 🐛 Known Issues & Workarounds

### Issue 1: Redis Connection on First Start

**Symptom:** Game Bridge Worker fails to connect to Redis on first deployment.

**Workaround:**
```bash
# Ensure Redis is running
redis-cli ping  # Should return "PONG"

# If Redis is not installed:
docker run -d -p 6379:6379 redis:7-alpine

# Or install locally:
# Ubuntu/Debian: sudo apt-get install redis-server
# macOS: brew install redis
```

### Issue 2: Prisma Client Not Generated

**Symptom:** Build fails with "Cannot find module '@prisma/client'"

**Workaround:**
```bash
cd apps/lc_api/api-server
npx prisma generate
cd ../../lc_game_bridge
npx prisma generate
```

---

## 🔙 Rollback Procedure

If you encounter critical issues, you can rollback to v1.0.2:

### Step 1: Stop All Services

```bash
# Docker
docker compose -f docker-compose.prod.yml down

# Or manually
# Stop all Node processes
```

### Step 2: Restore Database

```bash
# Restore from backup
psql lc_portal < backup_v1.0.2_YYYYMMDD_HHMMSS.sql
```

### Step 3: Checkout Previous Version

```bash
git checkout v1.0.2
pnpm install
pnpm build
```

### Step 4: Restore Environment

```bash
# Restore .env files from backup
cp .env.backup.v1.0.2 .env
```

### Step 5: Restart Services

```bash
# Start v1.0.2 services
docker compose -f docker-compose.prod.yml up -d
```

---

## 📊 Performance Considerations

### Expected Resource Usage

**Game Bridge Worker:**
- **Memory:** ~150-200 MB base, +50 MB per concurrent sync job
- **CPU:** Low (< 5% idle, ~20-30% during sync)
- **Network:** Depends on game DB size (typically < 10 Mbps)

**Redis:**
- **Memory:** ~50-100 MB for job queue
- **Recommended:** 512 MB minimum allocation

### Scaling Recommendations

For large deployments (> 10,000 active players):
- Increase sync intervals to reduce database load
- Use Redis Cluster for job queue
- Consider horizontal scaling of Game Bridge Worker
- Monitor database connection pools

---

## 🧪 Testing After Migration

### Smoke Tests

Run these tests after migration to verify everything works:

```bash
# 1. Health checks
curl http://localhost:4000/health
curl http://localhost:5000/health

# 2. User login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 3. Create user profile
# (requires auth token from step 2)
curl -X POST http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Test User"}'

# 4. Check sync status
curl http://localhost:5000/api/sync/status
```

### Integration Tests

```bash
# Run automated test suite
cd apps/lc_api/api-server
npm test

# Run Game Bridge tests
cd ../../../apps/lc_game_bridge
npm test
```

---

## 📚 Additional Resources

### Documentation

- [PORTAL_DB_SCHEMA.md](./PORTAL_DB_SCHEMA.md) - Complete portal database schema
- [GAME_BRIDGE_GUIDE.md](./GAME_BRIDGE_GUIDE.md) - Game Bridge Worker setup
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment variables reference
- [AUTH_ADVANCED.md](./AUTH_ADVANCED.md) - Advanced authentication features

### API Documentation

- **Swagger UI:** http://localhost:4000/api/docs
- **API Guide:** [docs/API_GUIDE.md](./API_GUIDE.md)

### Support

- **GitHub Issues:** https://github.com/evervibe/evs-lc-apps/issues
- **Documentation:** [docs/](./README.md)

---

## ✅ Post-Migration Checklist

After successful migration, verify:

- [ ] All services running and healthy
- [ ] Database migrations applied successfully
- [ ] User profiles can be created/updated
- [ ] Game Bridge Worker is syncing data
- [ ] 2FA backup codes can be generated
- [ ] No errors in application logs
- [ ] Frontend applications load correctly
- [ ] API endpoints responding normally
- [ ] Monitoring/metrics collecting data
- [ ] Backups configured for new data

---

## 🎉 Success!

Congratulations! You've successfully migrated to v1.1.0.

**Next Steps:**
- Configure Game Bridge Worker sync intervals
- Enable user profile features in frontend
- Set up monitoring for sync jobs
- Review new permissions system
- Plan for v1.2.0 migration (OAuth + Enhanced RBAC)

---

**Version:** 1.1.0  
**Last Updated:** 2025-10-16  
**Maintained by:** EverVibe Studios

For questions or issues, please open a GitHub issue or consult the documentation.

# Portal Database Schema Documentation

**Version:** 1.1.0  
**Database:** PostgreSQL 16+  
**ORM:** Prisma 5.10+  
**Last Updated:** 2025-10-16

---

## Overview

The Portal Database is the central PostgreSQL database that powers the EVS-LC-APPS portal system. It stores all user data, authentication information, transactions, support tickets, and synchronization state with game databases.

This document provides a comprehensive reference for all tables, relationships, and usage patterns.

---

## Database Architecture

### Core Principles

1. **Separation of Concerns** - Portal data (PostgreSQL) separate from game data (MySQL)
2. **Referential Integrity** - Foreign keys enforce data consistency
3. **Audit Trail** - All modifications tracked with timestamps
4. **Scalability** - Indexed columns for performant queries
5. **Security** - Sensitive data properly hashed/encrypted

### Database Diagram

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ passwordHash    │
│ role            │
│ ...             │
└────────┬────────┘
         │
         ├─────────┬──────────┬──────────┬─────────────┐
         │         │          │          │             │
         ▼         ▼          ▼          ▼             ▼
  ┌───────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
  │  Profile  │ │ Tickets │ │ Votes  │ │ Purchases│ │ Sessions │
  └───────────┘ └─────────┘ └────────┘ └──────────┘ └──────────┘
```

---

## Table Definitions

### 1. portal_users (Core User Table)

**Purpose:** Stores core user account information and authentication data.

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  username        String    @unique
  passwordHash    String
  role            UserRole  @default(USER)
  
  // 2FA
  totpSecret      String?
  totpEnabled     Boolean   @default(false)
  backupCodes     String[]  // Hashed backup codes (v1.1.0)
  
  // Status
  isActive        Boolean   @default(true)
  isVerified      Boolean   @default(false)
  verifiedAt      DateTime?
  
  // Tracking
  lastLoginAt     DateTime?
  lastLoginIp     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  profile         UserProfile?
  tickets         SupportTicket[]
  votes           Vote[]
  purchases       Purchase[]
  sessions        Session[]
  auditLogs       AuditLog[]
  
  @@map("portal_users")
  @@index([email])
  @@index([username])
  @@index([role])
  @@index([isActive])
}
```

**Fields:**
- `id` - UUID primary key
- `email` - Unique email address (used for login)
- `username` - Unique display username
- `passwordHash` - Argon2id hashed password
- `role` - User role (USER, MODERATOR, ADMIN, SUPER_ADMIN)
- `totpSecret` - Base32 TOTP secret for 2FA
- `totpEnabled` - Whether 2FA is enabled
- `backupCodes` - Array of hashed backup codes for 2FA recovery **(NEW in v1.1.0)**
- `isActive` - Account active status
- `isVerified` - Email verification status
- `lastLoginAt` - Last successful login timestamp
- `lastLoginIp` - Last login IP address

**Indexes:**
- `email` - For login queries
- `username` - For username lookups
- `role` - For admin queries
- `isActive` - For filtering active users

### 2. portal_user_profiles (Extended User Information)

**Purpose:** Extended user profile information and social settings. **(NEW in v1.1.0)**

```prisma
model UserProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Profile Info
  displayName     String?
  bio             String?   @db.Text
  avatarUrl       String?
  bannerUrl       String?
  location        String?
  website         String?
  
  // Social Settings
  showOnline      Boolean   @default(true)
  allowFriends    Boolean   @default(true)
  allowMessages   Boolean   @default(true)
  
  // Statistics
  lastLoginIp     String?
  lastLoginAt     DateTime?
  totalLogins     Int       @default(0)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@map("portal_user_profiles")
}
```

**Fields:**
- `displayName` - Custom display name (different from username)
- `bio` - User biography/description (TEXT field)
- `avatarUrl` - Profile picture URL
- `bannerUrl` - Profile banner image URL
- `location` - User location (optional)
- `website` - Personal website/social link
- `showOnline` - Show online status to others
- `allowFriends` - Accept friend requests
- `allowMessages` - Accept direct messages
- `totalLogins` - Count of total logins

**Usage Example:**
```typescript
// Get user with profile
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { profile: true }
});

// Update profile
await prisma.userProfile.update({
  where: { userId },
  data: {
    displayName: 'New Name',
    bio: 'Updated bio',
    showOnline: false
  }
});
```

### 3. portal_roles (Role Management)

**Purpose:** Portal-specific roles for enhanced RBAC. **(NEW in v1.1.0)**

```prisma
model PortalRole {
  id              String            @id @default(uuid())
  name            String            @unique
  description     String?
  priority        Int               @default(0)
  
  permissions     PortalPermission[]
  users           User[]
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  @@map("portal_roles")
  @@index([priority])
}
```

**Fields:**
- `name` - Unique role name (e.g., "SUPPORT_AGENT", "CONTENT_MANAGER")
- `description` - Role description
- `priority` - Role priority/hierarchy (higher = more powerful)
- `permissions` - Associated permissions (many-to-many)

**Default Roles:**
- `SUPER_ADMIN` (priority: 100) - Full system access
- `ADMIN` (priority: 90) - Administrative access
- `MODERATOR` (priority: 50) - Moderation tools
- `SUPPORT` (priority: 30) - Support ticket access
- `USER` (priority: 10) - Standard user

### 4. portal_permissions (Permission System)

**Purpose:** Fine-grained permissions for RBAC. **(NEW in v1.1.0)**

```prisma
model PortalPermission {
  id              String      @id @default(uuid())
  name            String      @unique
  resource        String      // e.g., 'users', 'tickets', 'shop'
  action          String      // e.g., 'read', 'write', 'delete'
  description     String?
  
  roles           PortalRole[]
  
  createdAt       DateTime    @default(now())
  
  @@map("portal_permissions")
  @@index([resource, action])
}
```

**Fields:**
- `name` - Unique permission name (e.g., "users.read", "tickets.write")
- `resource` - Resource type this permission applies to
- `action` - Action allowed (read, write, delete, admin)
- `description` - Human-readable description

**Permission Format:**
```
{resource}.{action}

Examples:
- users.read        # Can view users
- users.write       # Can modify users
- tickets.read      # Can view support tickets
- tickets.write     # Can respond to tickets
- shop.admin        # Full shop management
```

### 5. game_sync_status (Game Synchronization Tracking)

**Purpose:** Track synchronization status between game databases and portal. **(NEW in v1.1.0)**

```prisma
model GameSyncStatus {
  id                String    @id @default(uuid())
  syncType          String    // 'character', 'inventory', 'guild', etc.
  gameServerId      String
  lastSyncAt        DateTime
  status            String    // 'success', 'failed', 'pending'
  recordsProcessed  Int       @default(0)
  errors            Json?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@map("game_sync_status")
  @@index([syncType, gameServerId])
  @@index([lastSyncAt])
}
```

**Fields:**
- `syncType` - Type of sync (character, inventory, guild, etc.)
- `gameServerId` - Identifier for game server
- `lastSyncAt` - Last successful sync timestamp
- `status` - Current sync status
- `recordsProcessed` - Number of records processed in last sync
- `errors` - JSON object containing error details if failed

**Sync Types:**
- `character` - Character data synchronization
- `inventory` - Inventory/items sync
- `guild` - Guild information sync
- `stats` - Statistics sync
- `events` - Game events sync

### 6. portal_support_tickets

**Purpose:** User support ticket system.

```prisma
model SupportTicket {
  id              String            @id @default(uuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id])
  
  subject         String
  category        TicketCategory
  priority        TicketPriority    @default(NORMAL)
  status          TicketStatus      @default(OPEN)
  
  messages        TicketMessage[]
  
  closedAt        DateTime?
  closedBy        String?
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  @@map("portal_support_tickets")
  @@index([userId])
  @@index([status])
  @@index([category])
  @@index([createdAt])
}
```

**Categories:**
- `GENERAL` - General inquiries
- `TECHNICAL` - Technical issues
- `ACCOUNT` - Account-related
- `BILLING` - Payment/billing issues
- `REPORT` - Report abuse/bugs

**Statuses:**
- `OPEN` - Newly created, awaiting response
- `IN_PROGRESS` - Being worked on
- `WAITING_USER` - Waiting for user response
- `RESOLVED` - Resolved, awaiting confirmation
- `CLOSED` - Closed/completed

### 7. portal_sessions

**Purpose:** User session management for JWT refresh tokens.

```prisma
model Session {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  refreshToken    String    @unique
  userAgent       String?
  ipAddress       String?
  
  expiresAt       DateTime
  createdAt       DateTime  @default(now())
  
  @@map("portal_sessions")
  @@index([userId])
  @@index([refreshToken])
  @@index([expiresAt])
}
```

**Fields:**
- `refreshToken` - Hashed refresh token
- `userAgent` - Browser/client user agent
- `ipAddress` - Client IP address
- `expiresAt` - Token expiration time

**Session Management:**
```typescript
// Create session on login
const session = await prisma.session.create({
  data: {
    userId: user.id,
    refreshToken: hashedToken,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
});

// Cleanup expired sessions (cron job)
await prisma.session.deleteMany({
  where: {
    expiresAt: { lt: new Date() }
  }
});
```

### 8. portal_audit_logs

**Purpose:** Comprehensive audit trail for security and compliance.

```prisma
model AuditLog {
  id              String    @id @default(uuid())
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  
  action          String    // e.g., 'user.login', 'ticket.create'
  resource        String?   // Resource type
  resourceId      String?   // Resource ID
  
  metadata        Json?     // Additional context
  ipAddress       String?
  userAgent       String?
  
  createdAt       DateTime  @default(now())
  
  @@map("portal_audit_logs")
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

**Common Actions:**
- `user.login` - User logged in
- `user.logout` - User logged out
- `user.register` - New user registration
- `user.update` - User information updated
- `ticket.create` - Ticket created
- `purchase.complete` - Purchase completed
- `admin.action` - Administrative action

---

## Relationships

### User-Centric Relationships

```
User (1) ─── (1) UserProfile      # One-to-one
User (1) ─── (n) SupportTicket    # One-to-many
User (1) ─── (n) Vote             # One-to-many
User (1) ─── (n) Purchase         # One-to-many
User (1) ─── (n) Session          # One-to-many
User (1) ─── (n) AuditLog         # One-to-many
```

### Role-Permission Relationships

```
PortalRole (n) ─── (n) PortalPermission  # Many-to-many
User (n) ─── (n) PortalRole              # Many-to-many
```

---

## Indexes and Performance

### Index Strategy

1. **Primary Keys** - All tables use UUID primary keys
2. **Foreign Keys** - Automatically indexed
3. **Frequently Queried Columns** - email, username, status fields
4. **Timestamp Columns** - For date range queries
5. **Composite Indexes** - For complex queries (resource + action)

### Query Optimization Tips

```typescript
// ❌ Bad: N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  });
}

// ✅ Good: Use include/select
const users = await prisma.user.findMany({
  include: {
    profile: true,
    _count: {
      select: { tickets: true }
    }
  }
});

// ✅ Good: Paginate large datasets
const users = await prisma.user.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
});
```

---

## Data Migration

### Running Migrations

```bash
cd apps/lc_api/api-server

# Create migration
npx prisma migrate dev --name add_new_feature

# Apply to production
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
```

### Seeding Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default roles
  await prisma.portalRole.createMany({
    data: [
      { name: 'SUPER_ADMIN', priority: 100, description: 'Full system access' },
      { name: 'ADMIN', priority: 90, description: 'Administrative access' },
      { name: 'MODERATOR', priority: 50, description: 'Moderation tools' },
      { name: 'SUPPORT', priority: 30, description: 'Support access' },
      { name: 'USER', priority: 10, description: 'Standard user' }
    ],
    skipDuplicates: true
  });
  
  // Create default permissions
  // ...
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Security Considerations

### Sensitive Data

**Never log or expose:**
- `passwordHash` - User passwords (Argon2id)
- `totpSecret` - 2FA secrets
- `backupCodes` - 2FA backup codes
- `refreshToken` - Session tokens

**Encryption:**
- Passwords: Argon2id with 64MB memory, 3 iterations
- TOTP secrets: Base32 encoded, stored encrypted
- Backup codes: Hashed like passwords before storage

### Row-Level Security

Consider implementing RLS for multi-tenant scenarios:

```sql
-- Example RLS policy (PostgreSQL)
ALTER TABLE portal_support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_tickets_policy ON portal_support_tickets
  FOR SELECT
  USING (userId = current_setting('app.current_user_id')::uuid);
```

---

## Backup and Recovery

### Backup Strategy

```bash
# Daily backup
pg_dump lc_portal > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump lc_portal | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore from backup
psql lc_portal < backup_20251016.sql
```

### Point-in-Time Recovery

Enable WAL archiving for production:

```postgresql
# postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

---

## Monitoring

### Important Metrics

1. **Table Sizes**
```sql
SELECT
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

2. **Index Usage**
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

3. **Connection Count**
```sql
SELECT count(*) FROM pg_stat_activity;
```

---

## Appendix

### Complete Schema File Location

**File:** `apps/lc_api/api-server/prisma/schema.prisma`

### Version History

- **v1.1.0** (2025-10-16) - Added UserProfile, PortalRole, PortalPermission, GameSyncStatus
- **v1.0.2** (2025-10-16) - Initial stable schema
- **v1.0.0** (2025-10-15) - Initial release

---

**Maintained by:** EverVibe Studios  
**Last Updated:** 2025-10-16  
**Version:** 1.1.0

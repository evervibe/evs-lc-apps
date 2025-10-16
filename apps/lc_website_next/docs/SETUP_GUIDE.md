# Identity Bridge - Setup Guide

**Version:** 0.4.0  
**Last Updated:** 2025-10-03

---

## Quick Start

### Prerequisites
- Node.js 20+ 
- pnpm 9.12.3+
- MySQL 8.0+
- Legacy game database (read-only access)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Environment Configuration

### Required Variables

```env
# Portal Database (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/portal_db"

# Admin Protection Token
ADMIN_TOKEN="your-secure-admin-token-here"
```

### Optional: Legacy Database Fallback

If not using the GameServer table, configure up to 5 legacy databases:

```env
# Server 1
GAME_DB1_HOST="legacy-db.example.com"
GAME_DB1_PORT="3306"
GAME_DB1_DATABASE="db_auth"
GAME_DB1_USER="readonly_user"
GAME_DB1_PASSWORD="readonly_password"

# Server 2 (optional)
GAME_DB2_HOST="legacy-db2.example.com"
# ... repeat for DB2-DB5
```

---

## Testing the API

### 1. Register a Portal User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "role": "user",
    "createdAt": "2025-10-03T..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'
```

### 3. Add Game Server (Admin)

```bash
curl -X POST http://localhost:3000/api/servers \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Server",
    "region": "EU",
    "host": "legacy-db.example.com",
    "port": 3306,
    "database": "db_auth",
    "roUser": "readonly",
    "roPassEncrypted": "password"
  }'
```

### 4. List Servers

```bash
curl http://localhost:3000/api/servers
```

### 5. Link Game Account

```bash
curl -X POST http://localhost:3000/api/game/link \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-cookie" \
  -d '{
    "serverId": "server-uuid",
    "gameUsername": "MyOldCharacter",
    "password": "OldPassword123"
  }'
```

**Note:** Session management requires Auth.js integration (Phase 2)

### 6. Query Rankings

```bash
curl "http://localhost:3000/api/rankings/summary?serverId=server-uuid&limit=10"
```

---

## Database Schema

### Portal Database Tables

```
users
├── id (UUID, PK)
├── email (String, Unique)
├── passwordHash (String - Argon2id)
├── role (String)
└── timestamps

sessions (Auth.js compatible)
├── id (UUID, PK)
├── userId (UUID, FK)
└── expiresAt (DateTime)

oauth_accounts
├── id (UUID, PK)
├── userId (UUID, FK)
├── provider (String)
├── providerAccountId (String)
└── tokens...

mfa_totp
├── id (UUID, PK)
├── userId (UUID, FK, Unique)
├── secretEncrypted (String)
└── enabledAt (DateTime?)

mfa_backup_codes
├── id (UUID, PK)
├── userId (UUID, FK)
├── codeHash (String)
└── usedAt (DateTime?)

game_servers
├── id (UUID, PK)
├── name (String)
├── host, port, database (Connection)
└── roUser, roPassEncrypted (Credentials)

game_account_links
├── id (UUID, PK)
├── userId (UUID, FK)
├── serverId (UUID, FK)
├── gameUsername (String)
├── verifiedAt (DateTime?)
└── legacyAlgo (String?)

audit_logs
├── id (UUID, PK)
├── actorUserId (UUID?, FK)
├── action (String)
├── target (String)
├── metaJson (Text?)
└── createdAt (DateTime)
```

### Relationships
- User → Sessions (1:many)
- User → OAuthAccounts (1:many)
- User → MfaTotp (1:1)
- User → MfaBackupCodes (1:many)
- User → GameAccountLinks (1:many)
- GameServer → GameAccountLinks (1:many)
- User → AuditLogs (1:many)

---

## Security Configuration

### Password Requirements

**Portal Accounts (New):**
- Minimum 8 characters
- Maximum 128 characters
- Hashed with Argon2id
- Memory-hard parameters

**Legacy Accounts (Verification Only):**
- Supports MD5, SHA256-salt, plaintext
- Read-only verification
- No password migration
- Algorithm auto-detection

### Rate Limiting

```typescript
// Authentication endpoints
POST /api/auth/register → 5 attempts per 15 minutes
POST /api/auth/login    → 5 attempts per 15 minutes

// Game linking
POST /api/game/link     → 3 attempts per 10 minutes

// Default
All other endpoints     → 60 requests per minute
```

### Security Headers

All API responses include:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

---

## Troubleshooting

### Prisma Client Not Found

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
```

### Database Connection Failed

**Error:** `Can't reach database server`

**Check:**
1. MySQL is running: `systemctl status mysql`
2. Database exists: `mysql -u user -p -e "SHOW DATABASES;"`
3. Credentials in `.env` are correct
4. Port 3306 is accessible

### Legacy Database Connection Issues

**Error:** `No connection found for server`

**Check:**
1. GameServer entry exists in database
2. Read-only credentials are correct
3. Network access to legacy database
4. Database name is correct

### Rate Limit Hit

**Error:** `Too many attempts`

**Wait:** Rate limits reset automatically
- Auth: 15 minutes
- Game link: 10 minutes
- Default: 1 minute

### Admin Token Invalid

**Error:** `Unauthorized`

**Check:**
1. `ADMIN_TOKEN` is set in `.env`
2. Header format: `Authorization: Bearer YOUR_TOKEN`
3. Token matches exactly (no extra spaces)

---

## Monitoring

### Audit Logs

Query security events:

```typescript
import { queryAuditLogs } from '@/lib/audit-log';

// Get user's recent actions
const logs = await queryAuditLogs({
  actorUserId: 'user-uuid',
  limit: 50
});

// Get all login attempts
const logins = await queryAuditLogs({
  action: 'user.login',
  limit: 100
});
```

### Health Checks

Check legacy database connections:

```typescript
import { healthCheckAll } from '@/lib/legacy-db';

const health = await healthCheckAll();
console.log(health);
// {
//   "server-1": { healthy: true },
//   "server-2": { healthy: false, error: "..." }
// }
```

---

## Production Deployment

### Checklist

- [ ] Set strong `ADMIN_TOKEN`
- [ ] Use production database
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up Redis for rate limiting
- [ ] Encrypt GameServer passwords
- [ ] Configure backup strategy
- [ ] Set up monitoring/logging
- [ ] Enable audit log retention
- [ ] Configure session expiration
- [ ] Set up automated migrations
- [ ] Test disaster recovery

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL="mysql://prod_user:prod_pass@prod-db:3306/portal_db?sslmode=require"
ADMIN_TOKEN="use-a-strong-random-token-here"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### Recommended Stack

- **Hosting:** Vercel / Railway / AWS
- **Database:** PlanetScale / AWS RDS / Digital Ocean
- **Caching:** Upstash Redis / Redis Cloud
- **Monitoring:** Sentry / LogRocket
- **Analytics:** Plausible / PostHog

---

## Support & Documentation

- **Implementation Summary:** `docs/IMPLEMENTATION_SUMMARY.md`
- **Schema Documentation:** `docs/portal_schema.md`
- **Changelog:** `docs/CHANGELOG.md`
- **Agent Log:** `docs/agent_logs/2025-10-03/004_identity_bridge.md`

For issues or questions, refer to the documentation or create an issue in the repository.

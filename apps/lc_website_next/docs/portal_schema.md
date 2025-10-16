# Portal Database Schema

**Version:** 0.5.0  
**Date:** 2025-10-03  
**Database:** MySQL via Prisma  
**Phase:** 3 - Security & MFA

---

## Overview

The Portal Database is a separate, modern MySQL database that manages:
- Portal user accounts with Argon2id password hashing
- Session management (Auth.js compatible)
- OAuth integrations
- Multi-factor authentication (TOTP + backup codes)
- Game account links to legacy databases
- Game server configurations
- Audit logs for security events

---

## Tables

### `users`

Portal user accounts with modern security.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique user identifier |
| `email` | String (Unique) | User email address |
| `passwordHash` | String | Argon2id hashed password |
| `role` | String | User role (default: "user") |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Indexes:**
- `email` (unique)

---

### `sessions`

Session management for authentication (Auth.js compatible).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Session identifier |
| `userId` | UUID (FK) | Reference to user |
| `expiresAt` | DateTime | Session expiration |

**Relations:**
- `user` → `users.id` (Cascade delete)

**Indexes:**
- `userId`

---

### `oauth_accounts`

OAuth provider integrations (Discord, Google, etc.).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Account identifier |
| `userId` | UUID (FK) | Reference to user |
| `provider` | String | OAuth provider name |
| `providerAccountId` | String | Provider's user ID |
| `accessToken` | Text (Optional) | OAuth access token |
| `refreshToken` | Text (Optional) | OAuth refresh token |
| `expiresAt` | DateTime (Optional) | Token expiration |

**Relations:**
- `user` → `users.id` (Cascade delete)

**Indexes:**
- `userId`
- Unique: (`provider`, `providerAccountId`)

---

### `mfa_totp`

TOTP-based multi-factor authentication.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | TOTP config identifier |
| `userId` | UUID (FK, Unique) | Reference to user |
| `secretEncrypted` | String | Encrypted TOTP secret |
| `enabledAt` | DateTime (Optional) | When MFA was enabled |

**Relations:**
- `user` → `users.id` (Cascade delete)

---

### `mfa_backup_codes`

Backup codes for MFA recovery.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Backup code identifier |
| `userId` | UUID (FK) | Reference to user |
| `codeHash` | String | Hashed backup code |
| `usedAt` | DateTime (Optional) | When code was used |

**Relations:**
- `user` → `users.id` (Cascade delete)

**Indexes:**
- `userId`

---

### `password_reset_tokens`

Time-limited tokens for password reset flow.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Token identifier |
| `userId` | UUID (FK) | Reference to user |
| `token` | String (Unique) | Cryptographically secure token |
| `expiresAt` | DateTime | Token expiration (1 hour) |
| `usedAt` | DateTime (Optional) | When token was used |
| `createdAt` | DateTime | Token creation timestamp |

**Relations:**
- `user` → `users.id` (Cascade delete)

**Indexes:**
- `userId`
- `token` (unique)

**Security:**
- Tokens are single-use (marked with `usedAt`)
- 1-hour expiration enforced
- 32-byte cryptographically secure random tokens

---

### `game_servers`

Configuration for legacy game database connections (read-only).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Server identifier |
| `name` | String | Server display name |
| `region` | String (Optional) | Server region/location |
| `driver` | String | Database driver (default: "mysql") |
| `host` | String | Database host |
| `port` | Integer | Database port (default: 3306) |
| `database` | String | Database name |
| `roUser` | String | Read-only username |
| `roPassEncrypted` | String | Encrypted read-only password |
| `createdAt` | DateTime | Server added timestamp |

**Security Notes:**
- Only read-only credentials are stored
- Passwords should be encrypted at rest
- No write operations allowed

---

### `game_account_links`

Links between portal users and legacy game accounts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Link identifier |
| `userId` | UUID (FK) | Reference to portal user |
| `serverId` | UUID (FK) | Reference to game server |
| `gameUsername` | String | Legacy game username |
| `verifiedAt` | DateTime (Optional) | When link was verified |
| `legacyAlgo` | String (Optional) | Detected legacy hash algorithm |
| `lastCheckAt` | DateTime (Optional) | Last verification check |

**Relations:**
- `user` → `users.id` (Cascade delete)
- `server` → `game_servers.id` (Cascade delete)

**Indexes:**
- `userId`
- Unique: (`serverId`, `gameUsername`)

**Legacy Hash Algorithms:**
- `md5` - Simple MD5 hash
- `sha256-salt` - SHA256 with fixed salt
- `plaintext` - Unencrypted (legacy only)

---

### `audit_logs`

Security and compliance audit trail.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Log entry identifier |
| `actorUserId` | UUID (FK, Optional) | User who performed action |
| `action` | String | Action type |
| `target` | String | Target of action |
| `metaJson` | Text (Optional) | Additional metadata (JSON) |
| `createdAt` | DateTime | Timestamp of action |

**Relations:**
- `actor` → `users.id` (Set null on delete)

**Indexes:**
- `actorUserId`
- `createdAt`

**Action Types:**
- `user.register`, `user.login`, `user.logout`
- `user.password_change`
- `game.link_account`, `game.unlink_account`
- `server.add`, `server.remove`
- `admin.action`
- `security.rate_limit`, `security.invalid_attempt`

---

## Security Features

### Password Hashing
- **Portal:** Argon2id with memory-hard parameters
- **Legacy:** MD5, SHA256-fixed-salt (read-only verification)

### Rate Limiting
- Auth endpoints: 5 attempts per 15 minutes
- Game link: 3 attempts per 10 minutes
- Default: 60 requests per minute

### Audit Logging
- All security-relevant actions logged
- Sensitive data automatically redacted
- Timestamped with actor information

### Read-Only Guards
- Legacy database connections are read-only
- Runtime validation prevents write operations
- Connection pooling with limited concurrency

---

## Migration Notes

### From Legacy to Portal
1. Legacy users must register new portal accounts
2. Link existing game accounts via password verification
3. Legacy passwords verified but not migrated
4. Users encouraged to use new Argon2id passwords

### Multi-Server Support
- One portal account can link to multiple game servers
- Each game server has separate read-only connection
- Server configurations stored in `game_servers` table
- Fallback to ENV variables if database not configured

---

## Future Enhancements

### Planned Features
- [ ] Full Auth.js integration
- [ ] OAuth providers (Discord, Google, Steam)
- [ ] TOTP MFA implementation
- [ ] Password encryption at rest for game servers
- [ ] Role-based access control (RBAC)
- [ ] Two-way game account linking verification
- [ ] Automatic re-verification of game links

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new portal user
- `POST /api/auth/login` - Login (skeleton for Auth.js)

### Game Server Management
- `GET /api/servers` - List servers (public info only)
- `POST /api/servers` - Add server (admin only, requires ADMIN_TOKEN)

### Game Account Linking
- `POST /api/game/link` - Link game account
- `GET /api/game/links` - List user's linked accounts

### Rankings (Example)
- `GET /api/rankings/summary?serverId={id}` - Top characters

---

## Environment Variables

```env
# Portal Database
DATABASE_URL="mysql://user:pass@localhost:3306/portal_db"

# Admin Protection
ADMIN_TOKEN="secret-admin-token"

# Optional: Legacy DB Fallback
GAME_DB1_HOST="localhost"
GAME_DB1_PORT="3306"
GAME_DB1_DATABASE="db_auth"
GAME_DB1_USER="readonly_user"
GAME_DB1_PASSWORD="readonly_pass"
```

See `.env.example` for complete configuration.

# Security Features Documentation

**Version:** 1.0.0  
**Date:** 2025-10-03  
**Phase:** 3 - Security & MFA

---

## Overview

The LC Portal implements comprehensive security features including:
- **Global Security Headers** - CSP, HSTS, Referrer-Policy, Permissions-Policy
- **Multi-Factor Authentication (MFA)** - TOTP and backup codes
- **Secure Password Reset** - Time-limited tokens with email delivery
- **Audit Logging** - All security-relevant actions tracked
- **Redis Rate Limiting** - Distributed rate limiting with memory fallback
- **SMTP Email Delivery** - Production-ready email transport
- **Security Event Notifications** - Real-time alerts for security events

---

## Global Security Headers

### Content Security Policy (CSP)

The portal implements a strict Content Security Policy to prevent XSS and other injection attacks:

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https:;
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests; (production only)
```

### HTTP Strict Transport Security (HSTS)

In production, HSTS is enabled to enforce HTTPS:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Additional Security Headers

- **Referrer-Policy**: `no-referrer` - Prevents leaking referrer information
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=()` - Disables unnecessary browser features
- **X-Content-Type-Options**: `nosniff` - Prevents MIME-sniffing
- **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - Enables browser XSS protection

### Configuration

Security headers are configured in `next.config.ts` and applied globally to all pages and API routes.

---

## Multi-Factor Authentication (MFA)

### TOTP (Time-based One-Time Password)

MFA adds an extra layer of security to user accounts by requiring a second form of authentication in addition to passwords.

#### Features
- **Standard TOTP**: Compatible with Google Authenticator, Authy, 1Password, etc.
- **QR Code Setup**: Easy enrollment via QR code scanning
- **Manual Entry**: Secret key provided for manual configuration
- **Backup Codes**: 8 one-time backup codes for account recovery

#### Setup Flow

1. **User Initiates Setup**
   - Navigate to `/account` → Enable MFA
   - `POST /api/mfa/setup` generates a secret and QR code

2. **Scan QR Code**
   - User scans QR code with authenticator app
   - App generates 6-digit codes every 30 seconds

3. **Verify Setup**
   - User enters current 6-digit code
   - `POST /api/mfa/verify` validates the code
   - MFA is enabled on successful verification

4. **Generate Backup Codes**
   - `POST /api/mfa/backup-codes` generates 8 backup codes
   - Codes are hashed with Argon2id before storage
   - Display codes once for user to save securely

#### Security Considerations

- **Secret Storage**: TOTP secrets are stored encrypted in the database
- **Backup Code Hashing**: Backup codes are hashed (not encrypted) - once used, they're marked
- **Time Window**: 30-second window for code validity (standard TOTP)
- **No Code Reuse**: Used backup codes cannot be reused

#### Disabling MFA

- User must provide their password to disable MFA
- All backup codes are deleted when MFA is disabled
- Audit log entry created for security tracking

---

## Password Reset Flow

### Overview

Secure password reset implementation that prevents:
- Email enumeration attacks
- Token reuse
- Expired token usage

### Flow

1. **Request Reset**
   ```
   POST /api/auth/request-reset
   {
     "email": "user@example.com"
   }
   ```
   - Generates cryptographically secure 32-byte token
   - Token expires after 1 hour
   - Email sent with reset link
   - **Security**: Always returns success (prevents email enumeration)

2. **Reset Password**
   ```
   POST /api/auth/reset
   {
     "token": "abc123...",
     "newPassword": "NewSecurePass123!"
   }
   ```
   - Validates token exists and hasn't expired
   - Checks token hasn't been used
   - Updates password hash (Argon2id)
   - Marks token as used

### Email Handling

#### Development Mode
- Emails logged to console
- Emails saved to `logs/emails.log`
- No actual SMTP connection required

#### Production Mode
The portal uses **Nodemailer** with SMTP transport for production email delivery.

**Required Configuration** (`.env`):
```env
SMTP_HOST=smtp.mailgun.org        # Your SMTP server
SMTP_PORT=587                     # 587 for TLS, 465 for SSL
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

**Supported SMTP Providers**:
- Mailgun
- SendGrid
- Amazon SES
- Postmark
- Any standard SMTP server

**Features**:
- Automatic HTML and plain text email generation
- Connection pooling for performance
- Secure TLS/SSL support
- Error handling with fallback to console logging

### Email Templates

**Password Reset Email**:
- Subject: "Password Reset Request - LC Portal"
- Contains: Reset link with token, expiration notice
- HTML formatted with inline styles

---

## Audit Logging

### Purpose

Audit logs track all security-relevant actions for:
- Security monitoring
- Compliance
- Incident investigation
- User activity tracking

### Logged Actions

#### User Actions
- `user.register` - New account registration
- `user.login` - Successful login
- `user.logout` - User logout
- `user.password_change` - Password updated
- `user.password_reset_request` - Reset email sent
- `user.password_reset_complete` - Password reset completed

#### MFA Actions
- `mfa.enabled` - MFA activated
- `mfa.disabled` - MFA deactivated
- `mfa.verify_success` - TOTP code verified
- `mfa.verify_failed` - Invalid TOTP code
- `mfa.backup_code_used` - Backup code consumed

#### Game Account Actions
- `game.link_account` - Game account linked
- `game.unlink_account` - Game account unlinked

#### Security Events
- `security.rate_limit` - Rate limit triggered
- `security.invalid_attempt` - Failed authentication

#### Admin Actions
- `admin.action` - Administrative action
- `server.add` - Game server added
- `server.remove` - Game server removed

### Log Structure

```typescript
{
  id: string;              // UUID
  actorUserId: string?;    // User who performed action (null for anonymous)
  action: AuditAction;     // Action type (see above)
  target: string;          // Target of action (email, server name, etc.)
  metaJson: string?;       // Additional metadata (sanitized)
  createdAt: DateTime;     // Timestamp
}
```

### Metadata Sanitization

Sensitive fields are automatically redacted:
- `password`
- `passwordHash`
- `token`
- `secret`
- `accessToken`
- `refreshToken`
- `apiKey`

### Querying Audit Logs

```typescript
// Get user's recent security events
GET /api/account/security-history

// Admin query (via queryAuditLogs function)
queryAuditLogs({
  actorUserId: 'user-id',
  action: 'user.login',
  limit: 50,
  offset: 0
})
```

---

## Rate Limiting

### Redis-Based Rate Limiting

The portal uses Redis for distributed rate limiting in production, with automatic fallback to in-memory storage for development.

### Configuration

```typescript
RATE_LIMIT_CONFIGS = {
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000  // 15 minutes
  },
  gameLink: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000  // 10 minutes
  },
  default: {
    maxRequests: 60,
    windowMs: 60 * 1000       // 1 minute
  }
}
```

### Protected Endpoints

- `/api/auth/login` - 5 attempts per 15 minutes
- `/api/auth/register` - 5 attempts per 15 minutes
- `/api/auth/request-reset` - 5 attempts per 15 minutes
- `/api/game/link` - 3 attempts per 10 minutes
- All other endpoints - 60 requests per minute

### Redis Setup

**Production (Recommended)**:
```env
REDIS_URL="redis://localhost:6379"
# or with authentication:
REDIS_URL="redis://:password@localhost:6379"
```

**Development (Fallback)**:
- If `REDIS_URL` is not set, the system automatically falls back to in-memory rate limiting
- No configuration needed for development

### Implementation Details

- **Redis Mode**: Uses atomic `INCR` and `EXPIRE` commands for accurate rate limiting
- **Memory Fallback**: In-memory Map-based storage when Redis is unavailable
- **Automatic Recovery**: Switches to memory if Redis connection fails
- **Key Format**: `ratelimit:{action}:{identifier}` in Redis
- **Response**: Returns 429 status with `resetAt` timestamp when limit exceeded

---

## Admin Dashboard

### Access Control

- Only users with `role=admin` can access
- Protected at API level (`GET /api/admin/stats`)
- UI route guard for `/admin/dashboard`

### Statistics

**User Metrics**:
- Total registered users
- MFA adoption rate
- Recent registrations (last 7 days)

**Security Metrics**:
- Failed login attempts (last 24 hours)
- Total game account links

**Visualizations**:
- User registration trend chart (Chart.js)
- Failed login timeline

### API Endpoint

```typescript
GET /api/admin/stats

Response:
{
  success: true,
  stats: {
    totalUsers: 150,
    totalGameLinks: 45,
    failedLoginsLast24h: 3,
    mfaEnabled: 20,
    mfaAdoptionRate: "13.3",
    registrationsChart: [
      { date: "2025-10-01", count: 5 },
      { date: "2025-10-02", count: 8 }
    ]
  }
}
```

---

## Security Best Practices

### For Users

1. **Enable MFA** - Strongly recommended for all accounts
2. **Use Strong Passwords** - Minimum 8 characters, mix of types
3. **Save Backup Codes** - Store securely (password manager, printed copy)
4. **Monitor Security History** - Check `/account` for suspicious activity
5. **Log Out on Shared Devices** - Always log out when done

### For Administrators

1. **Monitor Failed Logins** - Check admin dashboard regularly
2. **Review Audit Logs** - Investigate unusual patterns
3. **Rotate Admin Tokens** - Change `ADMIN_TOKEN` periodically
4. **Enable SMTP in Production** - Configure real email delivery
5. **Backup Database** - Regular backups of portal database

### For Developers

1. **Never Log Secrets** - Audit logs automatically sanitize sensitive data
2. **Use HTTPS** - Always use TLS in production
3. **Update Dependencies** - Keep security libraries up to date
4. **Test Rate Limits** - Verify rate limiting works correctly
5. **Review Audit Logs** - Check logs are created for all security actions

---

## API Reference

### MFA Endpoints

```
POST /api/mfa/setup
  → Returns: { secret, qrCode, message }

POST /api/mfa/verify
  Body: { code: string }
  → Returns: { success, message }

POST /api/mfa/disable
  Body: { password: string }
  → Returns: { success, message }

POST /api/mfa/backup-codes
  → Returns: { codes: string[], message }
```

### Password Reset Endpoints

```
POST /api/auth/request-reset
  Body: { email: string }
  → Returns: { success, message }

POST /api/auth/reset
  Body: { token: string, newPassword: string }
  → Returns: { success, message }
```

### Security Endpoints

```
GET /api/account/security-history
  → Returns: { success, logs: AuditLog[] }

GET /api/admin/stats (admin only)
  → Returns: { success, stats: AdminStats }
```

---

## Database Schema

### MFA Tables

```sql
-- TOTP Configuration
CREATE TABLE mfa_totp (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) UNIQUE NOT NULL,
  secretEncrypted TEXT NOT NULL,
  enabledAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Backup Codes
CREATE TABLE mfa_backup_codes (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  codeHash VARCHAR(255) NOT NULL,
  usedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (userId)
);

-- Password Reset Tokens
CREATE TABLE password_reset_tokens (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  token VARCHAR(64) UNIQUE NOT NULL,
  expiresAt DATETIME NOT NULL,
  usedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (userId),
  INDEX (token)
);
```

---

## Testing

### Unit Tests

```bash
pnpm test
```

Tests cover:
- Email utility functions
- Crypto functions (existing)
- Audit log creation

### E2E Tests

```bash
pnpm test:e2e
```

E2E tests cover:
- Registration flow
- Login flow
- MFA setup (with running database)
- Password reset flow
- Account page access

---

## Troubleshooting

### MFA Issues

**Problem**: QR code not scanning
- **Solution**: Use manual secret entry instead
- **Tip**: Ensure no spaces in secret when entering manually

**Problem**: TOTP codes not working
- **Solution**: Check device time is synchronized (NTP)
- **Tip**: TOTP requires accurate system time

**Problem**: Lost backup codes
- **Solution**: Generate new codes (requires MFA code or password to authenticate)

### Password Reset Issues

**Problem**: Reset email not received (dev mode)
- **Solution**: Check console output and `logs/emails.log`

**Problem**: Reset token expired
- **Solution**: Request new reset link (tokens expire after 1 hour)

**Problem**: Reset link already used
- **Solution**: Each token is single-use; request new link

### Audit Log Issues

**Problem**: Logs not appearing
- **Solution**: Check database connection and Prisma client
- **Note**: Audit log failures are non-blocking (won't break functionality)

---

## Future Enhancements

- [ ] Hardware security key support (WebAuthn/FIDO2)
- [ ] SMS-based MFA (backup option)
- [ ] Trusted device management
- [ ] Login notification emails
- [ ] IP-based anomaly detection
- [ ] Advanced admin analytics dashboard
- [ ] Export audit logs (CSV/JSON)
- [ ] Automated security reports

---

**Last Updated:** 2025-10-03  
**Maintained By:** LC Portal Development Team

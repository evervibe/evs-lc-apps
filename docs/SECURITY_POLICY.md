# Security Policy - EVS-LC Apps

**Version:** 1.0.0  
**Last Updated:** 2025-10-16  
**Classification:** Internal Use Only

## Table of Contents

1. [Overview](#overview)
2. [Security Architecture](#security-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Protection](#data-protection)
5. [Application Security](#application-security)
6. [Infrastructure Security](#infrastructure-security)
7. [Incident Response](#incident-response)
8. [Security Best Practices](#security-best-practices)

## Overview

This document outlines the security policies, measures, and best practices implemented in EVS-LC Apps.

### Security Principles

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Users and services have minimum necessary permissions
3. **Zero Trust**: Never trust, always verify
4. **Security by Design**: Security built into every component
5. **Continuous Monitoring**: Ongoing security assessment and improvement

## Security Architecture

### Multi-Layer Security Model

```
┌─────────────────────────────────────┐
│     User Access (Authentication)    │
├─────────────────────────────────────┤
│     Application Layer (RBAC)        │
├─────────────────────────────────────┤
│     API Layer (Rate Limiting)       │
├─────────────────────────────────────┤
│     Business Logic (Validation)     │
├─────────────────────────────────────┤
│     Data Layer (Encryption)         │
├─────────────────────────────────────┤
│     Database (Access Control)       │
├─────────────────────────────────────┤
│     Infrastructure (Firewall)       │
└─────────────────────────────────────┘
```

### Security Components

1. **Frontend Security**
   - XSS protection
   - CSRF tokens
   - Content Security Policy (CSP)
   - Input sanitization
   - Secure storage (HTTP-only cookies)

2. **Backend Security**
   - JWT authentication
   - RBAC authorization
   - Rate limiting
   - SQL injection prevention
   - Input validation
   - Output encoding

3. **Database Security**
   - Encrypted connections
   - Parameterized queries
   - Read-only users for game DB
   - Audit logging
   - Regular backups

4. **Infrastructure Security**
   - Firewall configuration
   - SSL/TLS encryption
   - DDoS protection
   - Network segmentation
   - Regular security updates

## Authentication & Authorization

### Password Security

#### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### Password Hashing
- **Algorithm**: Argon2id
- **Memory Cost**: 64MB
- **Time Cost**: 3 iterations
- **Parallelism**: 1
- **Salt**: Unique per password, automatically generated

```typescript
// Implementation
import * as argon2 from 'argon2'

const hashedPassword = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64MB
  timeCost: 3,
  parallelism: 1
})
```

### JWT Token Security

#### Access Tokens
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 15 minutes
- **Payload**: User ID, username, role
- **Storage**: Memory (not localStorage)

#### Refresh Tokens
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Storage**: HTTP-only cookies (recommended)
- **Rotation**: New refresh token on each use

#### Token Best Practices
- Use strong, unique secrets (minimum 32 characters)
- Rotate secrets every 90 days
- Implement token blacklisting for logout
- Monitor for suspicious token usage

### Two-Factor Authentication (2FA)

#### TOTP Implementation
- **Algorithm**: SHA-1 (standard for TOTP)
- **Time Step**: 30 seconds
- **Code Length**: 6 digits
- **Backup Codes**: 10 codes generated, single-use

#### 2FA Flow
1. User enables 2FA
2. System generates TOTP secret
3. QR code displayed to user
4. User scans with authenticator app
5. User verifies code to enable
6. Future logins require TOTP code

### Role-Based Access Control (RBAC)

#### Roles

**Player** (Default)
- Read own profile
- Manage own tickets
- View news
- Use shop
- Vote and redeem codes

**Moderator**
- All player permissions
- Read all tickets
- Update ticket status
- View user list (limited)

**Admin**
- All moderator permissions
- Full user management
- Grant cash
- Create game accounts
- Access admin dashboard
- View audit logs

#### Permission System

```typescript
// Permission format: <action>:<resource>
const permissions = [
  'read:own_profile',
  'write:own_profile',
  'read:tickets',
  'write:tickets',
  'read:users',
  'write:users',
  'grant:cash',
  'create:game_account'
]
```

### Failed Login Protection

- **Threshold**: 5 failed attempts
- **Lockout Duration**: 15 minutes
- **Tracking**: By username and IP address
- **Notification**: Email alert on lockout
- **Reset**: Manual reset by admin or auto after duration

## Data Protection

### Encryption

#### Data at Rest
- Database encryption enabled
- File system encryption for sensitive data
- Encrypted backups

#### Data in Transit
- TLS 1.2 minimum (TLS 1.3 preferred)
- HTTPS enforced for all connections
- Secure WebSocket (WSS) for real-time features

### Sensitive Data Handling

#### Personally Identifiable Information (PII)
- Email addresses: Stored encrypted
- IP addresses: Hashed in logs after 30 days
- Payment information: PCI DSS compliant storage

#### Secrets Management
- Environment variables for configuration
- Secrets stored in secure vault (AWS Secrets Manager, HashiCorp Vault)
- No secrets in source code
- Regular secret rotation

### Data Retention

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|----------------|
| User accounts | Active + 2 years inactive | Hard delete |
| Activity logs | 90 days | Automatic purge |
| Payment records | 7 years | Archived |
| Tickets | 1 year after closure | Soft delete |
| Session tokens | Until expiration | Auto cleanup |

## Application Security

### Input Validation

#### Server-Side Validation
- All inputs validated on backend
- Type checking with TypeScript
- Schema validation with Zod/Joi
- Sanitization of user inputs

```typescript
// Example validation
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
})
```

### SQL Injection Prevention

#### Prisma ORM (PostgreSQL)
- Parameterized queries by default
- Type-safe database access
- No raw SQL unless necessary

```typescript
// Safe query
const user = await prisma.user.findUnique({
  where: { email: userEmail }
})
```

#### MySQL Queries
- Prepared statements
- Input escaping
- Read-only user for most operations

```typescript
// Safe query
const [rows] = await connection.execute(
  'SELECT * FROM characters WHERE name = ?',
  [characterName]
)
```

### XSS Protection

#### Frontend
- React's automatic escaping
- DOMPurify for rich text sanitization
- Content Security Policy (CSP) headers

```typescript
// CSP Headers
'Content-Security-Policy': 
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
  "connect-src 'self' https://api.yourdomain.com"
```

#### Backend
- Output encoding
- HTML entity encoding for emails
- JSON escaping for API responses

### CSRF Protection

- CSRF tokens for state-changing operations
- SameSite cookies
- Origin validation
- Double-submit cookie pattern

### Rate Limiting

#### API Endpoints
- **Default**: 100 requests per minute per IP
- **Authentication**: 10 login attempts per 15 minutes
- **Sensitive operations**: 5 requests per minute

```typescript
// Implementation
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests per 60 seconds
@Post('login')
async login(@Body() dto: LoginDto) {
  // ...
}
```

## Infrastructure Security

### Firewall Rules

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (with rate limiting)
sudo ufw limit 22/tcp

# Block all other incoming
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Enable firewall
sudo ufw enable
```

### SSH Hardening

```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 20
```

### Fail2ban Configuration

```ini
# /etc/fail2ban/jail.local
[sshd]
enabled = true
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 60
bantime = 3600
```

### SSL/TLS Configuration

```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Incident Response

### Security Incident Categories

1. **Critical**: Data breach, system compromise
2. **High**: Unauthorized access, DDoS attack
3. **Medium**: Failed intrusion attempt, suspicious activity
4. **Low**: Policy violation, minor vulnerability

### Response Procedure

#### 1. Detection
- Monitor logs and alerts
- User reports
- Security scanning tools

#### 2. Containment
- Isolate affected systems
- Revoke compromised credentials
- Block malicious IPs

#### 3. Investigation
- Analyze logs and evidence
- Determine scope and impact
- Identify root cause

#### 4. Eradication
- Remove malware/backdoors
- Patch vulnerabilities
- Update security controls

#### 5. Recovery
- Restore from backups
- Verify system integrity
- Monitor for recurrence

#### 6. Post-Incident
- Document incident
- Update procedures
- Conduct lessons learned
- Notify affected parties if required

### Contact Information

**Security Team**
- Email: security@yourdomain.com
- Emergency: +1-XXX-XXX-XXXX
- PGP Key: [Key fingerprint]

## Security Best Practices

### For Developers

1. **Never commit secrets** to version control
2. **Always validate input** on both client and server
3. **Use parameterized queries** for database access
4. **Implement proper error handling** (no sensitive info in errors)
5. **Keep dependencies updated** (run `npm audit` regularly)
6. **Follow least privilege** principle
7. **Log security-relevant events**
8. **Code review** all security-related changes

### For Administrators

1. **Keep systems updated** (security patches)
2. **Use strong passwords** and 2FA
3. **Regular security audits**
4. **Monitor logs** for suspicious activity
5. **Backup regularly** and test restores
6. **Limit access** to production systems
7. **Use VPN** for remote access
8. **Document everything**

### For Users

1. **Use strong, unique passwords**
2. **Enable 2FA** on your account
3. **Be cautious** of phishing attempts
4. **Report suspicious activity**
5. **Keep software updated**
6. **Don't share credentials**

## Security Auditing

### Regular Activities

- **Weekly**: Review security logs
- **Monthly**: Dependency vulnerability scan
- **Quarterly**: Security configuration review
- **Annually**: Third-party security audit

### Audit Logging

All security-relevant events are logged:
- Authentication attempts (success/failure)
- Authorization failures
- Sensitive data access
- Configuration changes
- Administrative actions

```typescript
// Example audit log entry
{
  timestamp: '2025-10-16T14:45:27.867Z',
  level: 'security',
  action: 'login_success',
  userId: 'uuid',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  details: { method: '2fa' }
}
```

## Vulnerability Disclosure

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** publicly disclose the issue
2. Email details to: security@yourdomain.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours
- **Fix Development**: Varies by severity
- **Public Disclosure**: After fix is deployed

## Compliance

### Standards & Frameworks

- **OWASP Top 10**: Addressed in design
- **CWE/SANS Top 25**: Mitigated
- **GDPR**: Data protection measures
- **PCI DSS**: Payment card data handling

### Regular Reviews

- Security policy reviewed quarterly
- Procedures updated as needed
- Training provided to team members
- Compliance audits conducted annually

---

**This is a living document. Last reviewed: 2025-10-16**

**For security questions or concerns, contact: security@yourdomain.com**

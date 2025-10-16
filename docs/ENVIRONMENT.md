# Environment Configuration Guide

This document provides a comprehensive reference for all environment variables used across the EVS-LC-APPS monorepo.

## Table of Contents

- [Backend API Configuration](#backend-api-configuration)
- [Frontend Portal Configuration](#frontend-portal-configuration)
- [Frontend Admin Configuration](#frontend-admin-configuration)
- [Docker Configuration](#docker-configuration)

---

## Backend API Configuration

Location: `apps/lc_api/api-server/.env`

Copy from template:
```bash
cp apps/lc_api/api-server/.env.example apps/lc_api/api-server/.env
```

### Server Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `API_PORT` | number | `4000` | Port for the API server |
| `NODE_ENV` | string | `development` | Environment mode (development, production, test) |

### PostgreSQL Portal Database

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORTAL_DB_HOST` | string | `127.0.0.1` | PostgreSQL host |
| `PORTAL_DB_PORT` | number | `5432` | PostgreSQL port |
| `PORTAL_DB_USER` | string | `lc_portal` | Database user |
| `PORTAL_DB_PASS` | string | `change_me` | Database password |
| `PORTAL_DB_NAME` | string | `lc_portal_db` | Database name |
| `PORTAL_DB_SSL` | boolean | `false` | Enable SSL connection |
| `DATABASE_URL` | string | - | Full PostgreSQL connection string |

**Example DATABASE_URL:**
```
postgresql://lc_portal:change_me@127.0.0.1:5432/lc_portal_db?schema=public
```

### Redis Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REDIS_URL` | string | `redis://127.0.0.1:6379` | Redis connection URL for cache, sessions, rate limiting |

### JWT Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `JWT_ACCESS_TTL` | string | `15m` | Access token lifetime |
| `JWT_REFRESH_TTL` | string | `7d` | Refresh token lifetime |
| `JWT_SECRET` | string | - | Secret key for JWT signing (min 32 chars) |
| `JWT_ISSUER` | string | `lc-api` | JWT issuer claim |
| `JWT_AUDIENCE` | string | `lc-clients` | JWT audience claim |

### TOTP/2FA Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `TOTP_ISSUER` | string | `LastChaos` | TOTP issuer name |
| `TOTP_WINDOW` | number | `1` | Time window for TOTP validation |

### CORS Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `CORS_ORIGINS` | string | - | Comma-separated list of allowed origins |

**Example:**
```
CORS_ORIGINS=https://portal.example.com,https://admin.example.com
```

### MySQL Game Databases

#### AUTH Database
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MYSQL_AUTH_HOST` | string | `127.0.0.1` | MySQL AUTH host |
| `MYSQL_AUTH_PORT` | number | `3306` | MySQL AUTH port |
| `MYSQL_AUTH_USER` | string | `lc_ro` | Read-only user |
| `MYSQL_AUTH_PASS` | string | `read_only` | User password |
| `MYSQL_AUTH_DB` | string | `db_auth` | Database name |

#### GAME Database
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MYSQL_GAME_HOST` | string | `127.0.0.1` | MySQL GAME host |
| `MYSQL_GAME_PORT` | number | `3306` | MySQL GAME port |
| `MYSQL_GAME_USER` | string | `lc_ro` | Read-only user |
| `MYSQL_GAME_PASS` | string | `read_only` | User password |
| `MYSQL_GAME_DB` | string | `db_db` | Database name |

#### DATA Database
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MYSQL_DATA_HOST` | string | `127.0.0.1` | MySQL DATA host |
| `MYSQL_DATA_PORT` | number | `3306` | MySQL DATA port |
| `MYSQL_DATA_USER` | string | `lc_ro` | Read-only user |
| `MYSQL_DATA_PASS` | string | `read_only` | User password |
| `MYSQL_DATA_DB` | string | `db_data` | Database name |

#### LOGS Database
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MYSQL_LOGS_HOST` | string | `127.0.0.1` | MySQL LOGS host |
| `MYSQL_LOGS_PORT` | number | `3306` | MySQL LOGS port |
| `MYSQL_LOGS_USER` | string | `lc_ro` | Read-only user |
| `MYSQL_LOGS_PASS` | string | `read_only` | User password |
| `MYSQL_LOGS_DB` | string | `db_logs` | Database name |

#### Write User (for Stored Procedures)
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MYSQL_EXEC_USER` | string | `lc_rw` | Read-write user for stored procedures |
| `MYSQL_EXEC_PASS` | string | `only_exec_sp` | User password |

---

## Frontend Portal Configuration

Location: `apps/lc_apps/web-portal/.env`

Copy from template:
```bash
cp apps/lc_apps/web-portal/.env.example apps/lc_apps/web-portal/.env
```

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_APP_ENV` | string | `development` | Application environment |
| `NEXT_PUBLIC_API_BASE_URL` | string | `http://localhost:4000` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | string | `LastChaos Portal` | Application name |
| `NEXT_PUBLIC_APP_URL` | string | `http://localhost:3000` | Portal URL |
| `NEXT_PUBLIC_ENABLE_2FA` | boolean | `true` | Enable two-factor authentication |
| `NEXT_PUBLIC_ENABLE_VOTE` | boolean | `true` | Enable vote rewards system |
| `NEXT_PUBLIC_ENABLE_SHOP` | boolean | `true` | Enable item shop |

---

## Frontend Admin Configuration

Location: `apps/lc_apps/web-admin/.env`

Copy from template:
```bash
cp apps/lc_apps/web-admin/.env.example apps/lc_apps/web-admin/.env
```

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_APP_ENV` | string | `development` | Application environment |
| `NEXT_PUBLIC_API_BASE_URL` | string | `http://localhost:4000` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | string | `LastChaos Admin` | Application name |
| `NEXT_PUBLIC_APP_URL` | string | `http://localhost:3001` | Admin panel URL |
| `NEXT_PUBLIC_ADMIN_ROLE` | string | `admin` | Required admin role |

---

## Docker Configuration

When using Docker Compose, environment variables can be configured in `docker-compose.prod.yml` or via a `.env` file in the root directory.

### Docker Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `POSTGRES_HOST` | string | PostgreSQL container hostname |
| `POSTGRES_PORT` | number | PostgreSQL exposed port |
| `POSTGRES_USER` | string | PostgreSQL user |
| `POSTGRES_PASSWORD` | string | PostgreSQL password |
| `POSTGRES_DB` | string | PostgreSQL database name |
| `REDIS_HOST` | string | Redis container hostname |
| `REDIS_PORT` | number | Redis exposed port |

---

## Security Best Practices

### Production Configuration

1. **JWT Secret**: Use a strong random secret (min 32 characters)
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```

2. **Database Passwords**: Use strong, unique passwords for all databases

3. **CORS Origins**: Whitelist only trusted domains
   ```
   CORS_ORIGINS=https://portal.yourdomain.com,https://admin.yourdomain.com
   ```

4. **API URL**: Use HTTPS in production
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   ```

5. **Redis**: Use password protection in production
   ```
   REDIS_URL=redis://:your-password@127.0.0.1:6379
   ```

### Environment File Security

- **Never commit** `.env` files to version control
- Use `.env.example` as templates only
- Store production secrets in secure vault services (AWS Secrets Manager, HashiCorp Vault, etc.)
- Use different credentials for each environment (dev, staging, prod)
- Rotate credentials regularly

---

## Environment Validation

The backend API includes runtime environment validation to ensure all required variables are properly configured.

If a required variable is missing or invalid, the application will fail to start with a descriptive error message.

---

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL
```
Error: Connection refused
```

**Solution:** Verify:
- Database is running
- Host and port are correct
- User has proper permissions
- Firewall allows connections

### JWT Errors

**Problem:** Invalid token errors
```
Error: jwt malformed
```

**Solution:** Verify:
- `JWT_SECRET` is set and consistent
- Token hasn't expired
- Token format is correct

### CORS Errors

**Problem:** CORS policy blocking requests
```
Error: CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:** Verify:
- Frontend URL is in `CORS_ORIGINS`
- Protocol (http/https) matches
- Port number is included if non-standard

---

## Quick Start

### Local Development Setup

1. Copy all environment templates:
   ```bash
   # Backend API
   cp apps/lc_api/api-server/.env.example apps/lc_api/api-server/.env
   
   # Frontend Portal
   cp apps/lc_apps/web-portal/.env.example apps/lc_apps/web-portal/.env
   
   # Frontend Admin
   cp apps/lc_apps/web-admin/.env.example apps/lc_apps/web-admin/.env
   ```

2. Update database credentials in `apps/lc_api/api-server/.env`

3. Update API URLs in frontend `.env` files if needed

4. Start services:
   ```bash
   pnpm install
   pnpm dev
   ```

### Production Setup

See [DEPLOY_DOCKER_PROD.md](./DEPLOY_DOCKER_PROD.md) for complete production deployment instructions.

---

**Last Updated:** 2025-10-16  
**Version:** 1.0.1

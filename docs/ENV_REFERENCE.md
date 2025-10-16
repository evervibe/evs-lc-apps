# Environment Variables Reference - EVS-LC Apps

**Version:** 1.0.0  
**Last Updated:** 2025-10-16

This document provides a comprehensive reference for all environment variables used across the EVS-LC Apps monorepo.

## Backend API (apps/lc_api/api-server)

### Server Configuration

#### `NODE_ENV`
- **Type**: string
- **Required**: Yes
- **Default**: `development`
- **Values**: `development`, `production`, `test`
- **Description**: Application environment

#### `PORT`
- **Type**: number
- **Required**: No
- **Default**: `4000`
- **Description**: API server port

#### `API_PREFIX`
- **Type**: string
- **Required**: No
- **Default**: `api`
- **Description**: API route prefix (e.g., /api/users)

### Database - PostgreSQL (Portal)

#### `DATABASE_URL`
- **Type**: string (connection URL)
- **Required**: Yes
- **Format**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`
- **Example**: `postgresql://lcuser:lcpass@localhost:5432/lc_portal?schema=public`
- **Description**: PostgreSQL connection string for portal database

### Database - MySQL (Game)

#### `GAME_DB_HOST`
- **Type**: string
- **Required**: Yes
- **Default**: `localhost`
- **Description**: MySQL game database host

#### `GAME_DB_PORT`
- **Type**: number
- **Required**: Yes
- **Default**: `3306`
- **Description**: MySQL game database port

#### `GAME_DB_USER`
- **Type**: string
- **Required**: Yes
- **Description**: MySQL game database username

#### `GAME_DB_PASSWORD`
- **Type**: string
- **Required**: Yes
- **Description**: MySQL game database password

#### `GAME_DB_NAME`
- **Type**: string
- **Required**: Yes
- **Default**: `lc_game`
- **Description**: MySQL game database name

### JWT Configuration

#### `JWT_SECRET`
- **Type**: string
- **Required**: Yes
- **Minimum**: 32 characters recommended
- **Description**: Secret key for signing JWT access tokens
- **Security**: Must be strong and kept secret

#### `JWT_EXPIRES_IN`
- **Type**: string (time format)
- **Required**: No
- **Default**: `15m`
- **Description**: Access token expiration time
- **Examples**: `15m`, `1h`, `7d`

#### `JWT_REFRESH_SECRET`
- **Type**: string
- **Required**: Yes
- **Minimum**: 32 characters recommended
- **Description**: Secret key for signing JWT refresh tokens
- **Security**: Must be different from JWT_SECRET

#### `JWT_REFRESH_EXPIRES_IN`
- **Type**: string (time format)
- **Required**: No
- **Default**: `7d`
- **Description**: Refresh token expiration time

### TOTP/2FA Configuration

#### `TOTP_ISSUER`
- **Type**: string
- **Required**: No
- **Default**: `LastChaos`
- **Description**: Issuer name shown in authenticator apps

#### `TOTP_APP_NAME`
- **Type**: string
- **Required**: No
- **Default**: `LC Portal`
- **Description**: App name shown in authenticator apps

### CORS Configuration

#### `CORS_ORIGIN`
- **Type**: string (comma-separated URLs)
- **Required**: Yes
- **Example**: `http://localhost:3000,http://localhost:3001,https://portal.yourdomain.com`
- **Description**: Allowed origins for CORS

### Rate Limiting

#### `RATE_LIMIT_TTL`
- **Type**: number (seconds)
- **Required**: No
- **Default**: `60`
- **Description**: Time window for rate limiting

#### `RATE_LIMIT_MAX`
- **Type**: number
- **Required**: No
- **Default**: `100`
- **Description**: Maximum requests per TTL window

### Redis (Optional)

#### `REDIS_HOST`
- **Type**: string
- **Required**: No
- **Default**: `localhost`
- **Description**: Redis server host for caching

#### `REDIS_PORT`
- **Type**: number
- **Required**: No
- **Default**: `6379`
- **Description**: Redis server port

#### `REDIS_PASSWORD`
- **Type**: string
- **Required**: No
- **Description**: Redis server password (if required)

## Frontend - Web Portal (apps/lc_apps/web-portal)

### API Configuration

#### `NEXT_PUBLIC_API_URL`
- **Type**: string (URL)
- **Required**: Yes
- **Default**: `http://localhost:4000`
- **Description**: Backend API base URL
- **Example**: `https://api.yourdomain.com`

#### `NEXT_PUBLIC_API_TIMEOUT`
- **Type**: number (milliseconds)
- **Required**: No
- **Default**: `30000`
- **Description**: API request timeout

### App Configuration

#### `NEXT_PUBLIC_APP_NAME`
- **Type**: string
- **Required**: Yes
- **Default**: `LastChaos Portal`
- **Description**: Application name displayed in UI

#### `NEXT_PUBLIC_APP_URL`
- **Type**: string (URL)
- **Required**: No
- **Default**: `http://localhost:3000`
- **Description**: Application URL (for canonical links, etc.)

### Feature Flags

#### `NEXT_PUBLIC_ENABLE_2FA`
- **Type**: boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable two-factor authentication

#### `NEXT_PUBLIC_ENABLE_VOTE`
- **Type**: boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable vote system

#### `NEXT_PUBLIC_ENABLE_SHOP`
- **Type**: boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable item shop

## Frontend - Web Admin (apps/lc_apps/web-admin)

### API Configuration

#### `NEXT_PUBLIC_API_URL`
- **Type**: string (URL)
- **Required**: Yes
- **Default**: `http://localhost:4000`
- **Description**: Backend API base URL

#### `NEXT_PUBLIC_API_TIMEOUT`
- **Type**: number (milliseconds)
- **Required**: No
- **Default**: `30000`
- **Description**: API request timeout

### App Configuration

#### `NEXT_PUBLIC_APP_NAME`
- **Type**: string
- **Required**: Yes
- **Default**: `LastChaos Admin`
- **Description**: Application name displayed in UI

#### `NEXT_PUBLIC_APP_URL`
- **Type**: string (URL)
- **Required**: No
- **Default**: `http://localhost:3001`
- **Description**: Application URL

#### `NEXT_PUBLIC_ADMIN_ROLE`
- **Type**: string
- **Required**: No
- **Default**: `admin`
- **Description**: Required role for admin access

## Environment File Templates

### Development (.env.development)

```env
# Backend API
NODE_ENV=development
PORT=4000
API_PREFIX=api

# Database - PostgreSQL
DATABASE_URL=postgresql://lcuser:lcpass@localhost:5432/lc_portal?schema=public

# Database - MySQL
GAME_DB_HOST=localhost
GAME_DB_PORT=3306
GAME_DB_USER=lcgame
GAME_DB_PASSWORD=lcgamepass
GAME_DB_NAME=lc_game

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# TOTP
TOTP_ISSUER=LastChaos
TOTP_APP_NAME=LC Portal

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend - Portal
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_2FA=true
NEXT_PUBLIC_ENABLE_VOTE=true
NEXT_PUBLIC_ENABLE_SHOP=true

# Frontend - Admin
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=LastChaos Admin
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_ROLE=admin
```

### Production (.env.production)

```env
# Backend API
NODE_ENV=production
PORT=4000
API_PREFIX=api

# Database - PostgreSQL
DATABASE_URL=postgresql://production_user:strong_password@db.production.com:5432/lc_portal_prod?schema=public

# Database - MySQL
GAME_DB_HOST=game-db.production.com
GAME_DB_PORT=3306
GAME_DB_USER=readonly_user
GAME_DB_PASSWORD=strong_readonly_password
GAME_DB_NAME=lc_game_prod

# JWT (Use strong, unique values)
JWT_SECRET=use-a-very-strong-secret-key-here-at-least-64-chars-recommended
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=use-a-different-very-strong-secret-key-here-for-refresh
JWT_REFRESH_EXPIRES_IN=7d

# TOTP
TOTP_ISSUER=LastChaos
TOTP_APP_NAME=LC Portal

# CORS
CORS_ORIGIN=https://portal.yourdomain.com,https://admin.yourdomain.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Redis
REDIS_HOST=redis.production.com
REDIS_PORT=6379
REDIS_PASSWORD=strong_redis_password

# Frontend - Portal
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_APP_URL=https://portal.yourdomain.com
NEXT_PUBLIC_ENABLE_2FA=true
NEXT_PUBLIC_ENABLE_VOTE=true
NEXT_PUBLIC_ENABLE_SHOP=true

# Frontend - Admin
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=LastChaos Admin
NEXT_PUBLIC_APP_URL=https://admin.yourdomain.com
NEXT_PUBLIC_ADMIN_ROLE=admin
```

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong secrets** (minimum 32 characters for JWT secrets)
3. **Rotate secrets regularly** (every 90 days recommended)
4. **Use different secrets** for development/production
5. **Store production secrets** in secure vaults (AWS Secrets Manager, Azure Key Vault, etc.)
6. **Limit CORS origins** to only trusted domains
7. **Use HTTPS** in production for all URLs
8. **Enable 2FA** for admin accounts

## Validation

Create environment validation in your applications:

```typescript
// Backend: src/config/env.validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  // ...
})

export const env = envSchema.parse(process.env)
```

```typescript
// Frontend: src/lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_APP_NAME',
] as const

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  // ...
}
```

---

**For more configuration details, see:**
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Security Policy](./SECURITY_POLICY.md)

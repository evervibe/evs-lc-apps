# Environment Variables Reference

This document describes all environment variables used in the LC Apps project.

## Portal Web

### Required Variables

#### `NEXT_PUBLIC_API_URL`
- **Type**: String (URL)
- **Required**: Yes
- **Default**: `http://localhost:4000`
- **Description**: Base URL for the backend API
- **Example**: `https://api.lastchaos.com`

```env
NEXT_PUBLIC_API_URL=https://api.lastchaos.com
```

#### `NEXT_PUBLIC_APP_NAME`
- **Type**: String
- **Required**: Yes
- **Default**: `LastChaos Portal`
- **Description**: Application name displayed in the UI
- **Example**: `LastChaos - MMORPG Portal`

```env
NEXT_PUBLIC_APP_NAME=LastChaos Portal
```

#### `NEXT_PUBLIC_ENV`
- **Type**: String
- **Required**: Yes
- **Default**: `development`
- **Options**: `development`, `staging`, `production`
- **Description**: Current environment
- **Example**: `production`

```env
NEXT_PUBLIC_ENV=production
```

### Optional Variables

#### `NEXT_PUBLIC_DISCORD_CLIENT_ID`
- **Type**: String
- **Required**: No
- **Default**: (empty)
- **Description**: Discord OAuth client ID for social login
- **Example**: `123456789012345678`

```env
NEXT_PUBLIC_DISCORD_CLIENT_ID=123456789012345678
```

#### `NEXT_PUBLIC_RECAPTCHA_KEY`
- **Type**: String
- **Required**: No
- **Default**: (empty)
- **Description**: Google ReCaptcha v3 site key for form protection
- **Example**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`

```env
NEXT_PUBLIC_RECAPTCHA_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

### Feature Flags

#### `NEXT_PUBLIC_ENABLE_VOTING`
- **Type**: Boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable/disable vote system
- **Example**: `true`

```env
NEXT_PUBLIC_ENABLE_VOTING=true
```

#### `NEXT_PUBLIC_ENABLE_MARKET`
- **Type**: Boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable/disable item shop
- **Example**: `true`

```env
NEXT_PUBLIC_ENABLE_MARKET=true
```

#### `NEXT_PUBLIC_ENABLE_RANKINGS`
- **Type**: Boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable/disable rankings page
- **Example**: `true`

```env
NEXT_PUBLIC_ENABLE_RANKINGS=true
```

## Admin UI

### Required Variables

#### `NEXT_PUBLIC_API_URL`
- **Type**: String (URL)
- **Required**: Yes
- **Default**: `http://localhost:4000`
- **Description**: Base URL for the backend API
- **Example**: `https://api.lastchaos.com`

```env
NEXT_PUBLIC_API_URL=https://api.lastchaos.com
```

#### `NEXT_PUBLIC_APP_NAME`
- **Type**: String
- **Required**: Yes
- **Default**: `LastChaos Admin`
- **Description**: Application name displayed in the UI
- **Example**: `LastChaos - Admin Dashboard`

```env
NEXT_PUBLIC_APP_NAME=LastChaos Admin
```

#### `NEXT_PUBLIC_ENV`
- **Type**: String
- **Required**: Yes
- **Default**: `development`
- **Options**: `development`, `staging`, `production`
- **Description**: Current environment
- **Example**: `production`

```env
NEXT_PUBLIC_ENV=production
```

## Server-Side Variables (Optional)

These variables are not exposed to the client (no `NEXT_PUBLIC_` prefix).

### Database (If using direct DB connection)

#### `DATABASE_URL`
- **Type**: String (Connection String)
- **Required**: Only if bypassing API
- **Description**: Direct database connection string
- **Example**: `mysql://user:pass@localhost:3306/lastchaos`

```env
DATABASE_URL=mysql://user:pass@localhost:3306/lastchaos
```

### Email Service (If handling emails)

#### `SMTP_HOST`
- **Type**: String
- **Required**: Only if sending emails
- **Description**: SMTP server hostname

```env
SMTP_HOST=smtp.gmail.com
```

#### `SMTP_PORT`
- **Type**: Number
- **Required**: Only if sending emails
- **Description**: SMTP server port
- **Default**: `587`

```env
SMTP_PORT=587
```

#### `SMTP_USER`
- **Type**: String
- **Required**: Only if sending emails
- **Description**: SMTP username

```env
SMTP_USER=noreply@lastchaos.com
```

#### `SMTP_PASSWORD`
- **Type**: String
- **Required**: Only if sending emails
- **Description**: SMTP password (use secrets management)

```env
SMTP_PASSWORD=your_smtp_password
```

### Analytics (Optional)

#### `NEXT_PUBLIC_GA_ID`
- **Type**: String
- **Required**: No
- **Description**: Google Analytics tracking ID

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### `SENTRY_DSN`
- **Type**: String
- **Required**: No
- **Description**: Sentry error tracking DSN

```env
SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Environment Files

### Development

Create `.env.local` (git-ignored):

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# App
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_ENV=development

# External Services (optional)
NEXT_PUBLIC_DISCORD_CLIENT_ID=
NEXT_PUBLIC_RECAPTCHA_KEY=

# Feature Flags
NEXT_PUBLIC_ENABLE_VOTING=true
NEXT_PUBLIC_ENABLE_MARKET=true
NEXT_PUBLIC_ENABLE_RANKINGS=true
```

### Staging

Create `.env.staging`:

```env
# API
NEXT_PUBLIC_API_URL=https://staging-api.lastchaos.com

# App
NEXT_PUBLIC_APP_NAME=LastChaos Portal (Staging)
NEXT_PUBLIC_ENV=staging

# External Services
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_staging_client_id
NEXT_PUBLIC_RECAPTCHA_KEY=your_staging_recaptcha_key

# Feature Flags
NEXT_PUBLIC_ENABLE_VOTING=true
NEXT_PUBLIC_ENABLE_MARKET=true
NEXT_PUBLIC_ENABLE_RANKINGS=true
```

### Production

Create `.env.production`:

```env
# API
NEXT_PUBLIC_API_URL=https://api.lastchaos.com

# App
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_ENV=production

# External Services
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_RECAPTCHA_KEY=your_production_recaptcha_key

# Feature Flags
NEXT_PUBLIC_ENABLE_VOTING=true
NEXT_PUBLIC_ENABLE_MARKET=true
NEXT_PUBLIC_ENABLE_RANKINGS=true
```

## Usage in Code

### Client-Side (Browser)

Only `NEXT_PUBLIC_*` variables are available:

```tsx
// ✅ Available in browser
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appName = process.env.NEXT_PUBLIC_APP_NAME;

// ❌ Not available in browser (undefined)
const databaseUrl = process.env.DATABASE_URL;
```

### Server-Side (API Routes, Server Components)

All variables are available:

```tsx
// app/api/users/route.ts
export async function GET() {
  // ✅ Both available on server
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const dbUrl = process.env.DATABASE_URL;
  
  // ...
}
```

### Type Safety

Create `env.d.ts` for TypeScript:

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    // Required
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_ENV: "development" | "staging" | "production";
    
    // Optional
    NEXT_PUBLIC_DISCORD_CLIENT_ID?: string;
    NEXT_PUBLIC_RECAPTCHA_KEY?: string;
    NEXT_PUBLIC_ENABLE_VOTING?: string;
    NEXT_PUBLIC_ENABLE_MARKET?: string;
    NEXT_PUBLIC_ENABLE_RANKINGS?: string;
    
    // Server-only
    DATABASE_URL?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
  }
}
```

### Environment Validation

Create `lib/env.ts`:

```typescript
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "LastChaos Portal",
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  
  // Optional
  discordClientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
  recaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
  
  // Feature flags
  features: {
    voting: process.env.NEXT_PUBLIC_ENABLE_VOTING !== "false",
    market: process.env.NEXT_PUBLIC_ENABLE_MARKET !== "false",
    rankings: process.env.NEXT_PUBLIC_ENABLE_RANKINGS !== "false",
  },
  
  // Helpers
  isDevelopment: process.env.NEXT_PUBLIC_ENV === "development",
  isProduction: process.env.NEXT_PUBLIC_ENV === "production",
  isStaging: process.env.NEXT_PUBLIC_ENV === "staging",
};

// Validate required variables
if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}
```

Usage:

```tsx
import { env } from "@/lib/env";

// Use typed environment
console.log(env.apiUrl);
console.log(env.features.voting);

if (env.isDevelopment) {
  console.log("Running in development mode");
}
```

## Security Best Practices

### 1. Never Commit Secrets

```gitignore
# .gitignore
.env
.env.local
.env.*.local
.env.production
```

### 2. Use Secrets Management

For production, use platform-specific secrets:

- **Vercel**: Environment Variables in dashboard
- **AWS**: Secrets Manager or Parameter Store
- **Docker**: Docker secrets or Kubernetes secrets

### 3. Rotate Credentials

- Regularly rotate API keys
- Use different keys per environment
- Monitor for unauthorized access

### 4. Validate Input

```typescript
// Validate URLs
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
if (apiUrl.protocol !== "https:" && env.isProduction) {
  throw new Error("API must use HTTPS in production");
}
```

## Troubleshooting

### Environment Variable Not Found

1. Check spelling (case-sensitive)
2. Restart dev server after changes
3. Ensure `NEXT_PUBLIC_` prefix for client-side
4. Verify `.env` file location (root of app)

### Variable Value is Undefined

```tsx
// Debug
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("All env:", process.env);
```

### Different Values in Browser vs Server

- Remember: Only `NEXT_PUBLIC_*` available in browser
- Server components can access all variables
- Client components only see `NEXT_PUBLIC_*`

## References

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [12-Factor App Config](https://12factor.net/config)

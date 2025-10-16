# Workspace Setup - LC Apps Monorepo

This document describes the monorepo workspace setup for the LC Apps frontend system.

## Overview

The LC Apps project is now configured as a pnpm workspace with Turbo for build orchestration. This setup enables:
- Centralized dependency management
- Shared code between applications
- Parallel builds and development
- Consistent tooling across all packages

## Architecture

### Workspace Structure

```
lc_apps/                          # Monorepo root
├── portal-web/                   # Next.js app (port 3000)
├── admin-ui/                     # Next.js app (port 3001)
├── shared/                       # Shared library (@lc-apps/shared)
├── docs/                         # Documentation
├── package.json                  # Root workspace configuration
├── pnpm-workspace.yaml           # Workspace package definition
└── turbo.json                    # Build orchestration config
```

### Workspaces

1. **portal-web** - Public player portal
   - Next.js 15 with App Router
   - Pages: Home, News, Market, Rankings, Vote, Redeem, Downloads, Support, Dashboard, Auth
   - Port: 3000

2. **admin-ui** - Administrative dashboard
   - Next.js 15 with App Router
   - Pages: Dashboard, Users, Tickets, Redeem, News, Events, Logs
   - Port: 3001

3. **@lc-apps/shared** - Shared library
   - UI components (Button, Input, Card, Dialog, Toast)
   - React hooks (useAuth, useFetch, usePagination)
   - Utilities (API client with JWT refresh, cn, formatters)
   - TypeScript types (User, News, Market, etc.)

## Package Manager: pnpm

The project uses pnpm for several advantages:
- **Disk efficiency**: Shared dependencies via hard links
- **Strict**: Prevents phantom dependencies
- **Fast**: Parallel installations
- **Workspace support**: First-class monorepo support

### Installation

```bash
npm install -g pnpm
```

### Workspace Commands

```bash
# Install all workspace dependencies
pnpm install

# Run command in all workspaces
pnpm -r <command>

# Run command in specific workspace
pnpm --filter portal-web <command>
```

## Build Tool: Turbo

Turbo provides intelligent build orchestration:
- **Caching**: Remote and local caching
- **Parallelization**: Run tasks in parallel
- **Pipeline**: Define task dependencies
- **Incremental**: Only rebuild what changed

### Configuration (turbo.json)

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {},
    "test": {}
  }
}
```

### Turbo Commands

```bash
# Run task in all packages
pnpm dev          # turbo run dev
pnpm build        # turbo run build
pnpm lint         # turbo run lint
pnpm type-check   # turbo run type-check
```

## Development Workflow

### 1. Initial Setup

```bash
# Clone repository
git clone https://github.com/evervibe/lc_apps.git
cd lc_apps

# Install dependencies
pnpm install

# Setup environment
cp portal-web/.env.example portal-web/.env
cp admin-ui/.env.example admin-ui/.env
```

### 2. Development

```bash
# Start all apps (recommended)
pnpm dev

# Or start individually
cd portal-web && pnpm dev
cd admin-ui && pnpm dev
```

### 3. Building

```bash
# Build all apps
pnpm build

# Build specific app
cd portal-web && pnpm build
```

### 4. Quality Checks

```bash
# Run all checks
pnpm lint
pnpm type-check

# Format code
pnpm format
```

## Shared Library Usage

The shared library is consumed by both apps using workspace dependencies.

### Package.json Reference

```json
{
  "dependencies": {
    "@lc-apps/shared": "workspace:*"
  }
}
```

### Import Examples

```typescript
// Import UI components
import { Button } from "@lc-apps/shared/ui/button";
import { Card } from "@lc-apps/shared/ui/card";

// Import hooks
import { useAuth } from "@lc-apps/shared/hooks/useAuth";
import { useFetch } from "@lc-apps/shared/hooks/useFetch";

// Import utilities
import apiClient from "@lc-apps/shared/lib/api";
import { cn } from "@lc-apps/shared/lib/utils";

// Import types
import type { User, News } from "@lc-apps/shared/types";
```

## Environment Variables

Both apps use environment variables for configuration.

### Portal Web (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_DISCORD_CLIENT_ID=
NEXT_PUBLIC_RECAPTCHA_KEY=
```

### Admin UI (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=LastChaos Admin
NEXT_PUBLIC_ENV=development
```

## Scripts Reference

### Root Level (package.json)

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all workspaces
- `pnpm type-check` - Type check all workspaces
- `pnpm test` - Run tests (when implemented)
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean build artifacts

### App Level (portal-web, admin-ui)

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check
- `pnpm clean` - Clean .next and .turbo

### Shared Library

- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check

## Tooling

### ESLint

All workspaces have ESLint configured with TypeScript support.

**Config**: `eslint.config.mjs` (Flat config format)

```bash
# Lint all workspaces
pnpm lint

# Lint specific workspace
cd portal-web && pnpm lint
```

### Prettier

Code formatting is configured at the root level.

**Config**: `.prettierrc`

```bash
# Format all files
pnpm format

# Format specific files
prettier --write "apps/**/*.{ts,tsx}"
```

### TypeScript

All packages use TypeScript with strict mode enabled.

```bash
# Type check all workspaces
pnpm type-check

# Type check specific workspace
cd admin-ui && pnpm type-check
```

## Adding New Dependencies

### To a Specific App

```bash
# Add to portal-web
pnpm --filter portal-web add <package>

# Add dev dependency
pnpm --filter portal-web add -D <package>
```

### To Shared Library

```bash
pnpm --filter @lc-apps/shared add <package>
```

### To All Workspaces

```bash
# Add to root (affects all)
pnpm add -w <package>

# Add to all workspace packages
pnpm -r add <package>
```

## CI/CD Considerations

### Build Caching

Turbo supports remote caching for CI/CD pipelines:

```bash
# Enable remote caching
turbo login
turbo link
```

### Docker

Multi-stage builds can leverage workspace structure:

```dockerfile
# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/portal-web/.next ./portal-web/.next
COPY --from=builder /app/portal-web/public ./portal-web/public
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "portal-web/.next/standalone/server.js"]
```

## Troubleshooting

### pnpm-lock.yaml conflicts

```bash
# Resolve lockfile conflicts
pnpm install --no-frozen-lockfile
```

### Turbo cache issues

```bash
# Clear turbo cache
rm -rf .turbo
pnpm clean
```

### Phantom dependencies

```bash
# Check for phantom dependencies
pnpm audit
```

### Port conflicts

```bash
# Change port for admin-ui
cd admin-ui
pnpm dev -- -p 3002
```

## Performance

### Build Times

- **Initial build**: ~25-30 seconds (both apps)
- **Incremental build**: ~3-5 seconds (with cache)
- **Development startup**: ~5-8 seconds (both apps)

### Bundle Sizes

- **portal-web**: 130-143 KB First Load JS
- **admin-ui**: 116-119 KB First Load JS

## Best Practices

1. **Always use workspace commands** from root when possible
2. **Keep shared library generic** - avoid app-specific code
3. **Use TypeScript strictly** - enable strict mode
4. **Leverage Turbo caching** - structure tasks properly
5. **Version shared library** - use semantic versioning
6. **Document changes** - update CHANGELOG.md
7. **Test before commit** - run build, lint, type-check

## Migration Notes

### From Individual Apps to Workspace

The migration involved:
1. Created root package.json with workspace scripts
2. Added pnpm-workspace.yaml defining packages
3. Added turbo.json for orchestration
4. Created shared library package
5. Updated app package.json to reference shared
6. Added consistent tooling (ESLint, Prettier)
7. Updated documentation

### Breaking Changes

- Commands now run from root (e.g., `pnpm dev` instead of `cd app && pnpm dev`)
- Shared components must be imported from `@lc-apps/shared`
- ESLint config changed to flat format
- Port assignments are fixed (3000, 3001)

## Resources

- [pnpm Workspace Documentation](https://pnpm.io/workspaces)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
- GitHub Issues: [evervibe/lc_apps/issues](https://github.com/evervibe/lc_apps/issues)
- Documentation: [/docs/](./docs/)

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-16

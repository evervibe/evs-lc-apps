# Workspace Guide - EVS-LC Apps Monorepo

**Version:** 1.0.0  
**Last Updated:** 2025-10-16

## Overview

EVS-LC Apps uses a **pnpm workspace** with **Turbo** for efficient monorepo management. This guide explains how to work within the workspace structure.

## Workspace Structure

```
evs-lc-apps/                    # Root
├── apps/
│   ├── lc_api/                 # Backend workspace
│   │   ├── api-server/         # NestJS API app
│   │   ├── docs/              # API docs
│   │   ├── scripts/           # Deployment scripts
│   │   └── package.json
│   └── lc_apps/               # Frontend workspace
│       ├── web-portal/        # Next.js portal app
│       ├── web-admin/         # Next.js admin app
│       ├── shared/            # Shared library
│       └── package.json
├── docs/                      # Central documentation
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace definition
└── turbo.json                 # Build orchestration
```

## Prerequisites

### Required Tools

```bash
# Node.js 20+
node --version  # v20.19.5

# pnpm 10+
npm install -g pnpm
pnpm --version  # 10.18.3
```

### Optional Tools

```bash
# Turbo CLI (installed as dev dependency)
npx turbo --version

# PM2 (for production)
npm install -g pm2
```

## Getting Started

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/evervibe/evs-lc-apps.git
cd evs-lc-apps

# Install all dependencies
pnpm install

# This installs dependencies for:
# - Root workspace
# - apps/lc_api
# - apps/lc_api/api-server
# - apps/lc_apps
# - apps/lc_apps/web-portal
# - apps/lc_apps/web-admin
# - apps/lc_apps/shared
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Or setup individual apps
cp apps/lc_api/api-server/.env.example apps/lc_api/api-server/.env
cp apps/lc_apps/web-portal/.env.example apps/lc_apps/web-portal/.env
cp apps/lc_apps/web-admin/.env.example apps/lc_apps/web-admin/.env

# Edit with your values
nano .env
```

### 3. Start Development

```bash
# Start all apps (recommended)
pnpm dev

# Starts:
# - API server (localhost:4000)
# - Web portal (localhost:3000)
# - Web admin (localhost:3001)
```

## Working with Workspaces

### Running Commands

#### Root Level (All Workspaces)

```bash
# Install dependencies for all workspaces
pnpm install

# Run script in all workspaces
pnpm -r <script>

# Build all workspaces
pnpm build

# Lint all workspaces
pnpm lint

# Type check all workspaces
pnpm type-check

# Clean all workspaces
pnpm clean
```

#### Specific Workspace

```bash
# Run script in specific workspace
pnpm --filter lc_api <script>
pnpm --filter lc_apps <script>
pnpm --filter web-portal <script>
pnpm --filter web-admin <script>

# Examples:
pnpm --filter lc_api dev
pnpm --filter web-portal build
pnpm --filter web-admin lint
```

#### Navigate to Workspace

```bash
# Backend API
cd apps/lc_api
pnpm dev

# Or API server directly
cd apps/lc_api/api-server
npm run start:dev

# Frontend
cd apps/lc_apps
pnpm dev

# Specific frontend app
cd apps/lc_apps/web-portal
pnpm dev
```

### Adding Dependencies

#### To Root (Affects All)

```bash
# Add development tool to root
pnpm add -w -D prettier

# This makes it available to all workspaces
```

#### To Specific Workspace

```bash
# Add to backend API
pnpm --filter lc_api add @nestjs/config

# Add to API server
cd apps/lc_api/api-server
npm install axios

# Add to frontend workspace
pnpm --filter lc_apps add -D tailwindcss

# Add to specific frontend app
pnpm --filter web-portal add zustand

# Add to shared library
pnpm --filter shared add lucide-react
```

#### Workspace Dependencies

To reference another workspace:

```json
{
  "dependencies": {
    "@lc-apps/shared": "workspace:*"
  }
}
```

### Removing Dependencies

```bash
# Remove from specific workspace
pnpm --filter web-portal remove axios

# Remove from all workspaces
pnpm -r remove lodash
```

## Turbo Build System

### How Turbo Works

Turbo understands task dependencies and runs them efficiently:

1. **Caching**: Caches build outputs
2. **Parallelization**: Runs independent tasks in parallel
3. **Incremental**: Only rebuilds what changed
4. **Pipeline**: Respects task dependencies

### Turbo Configuration

File: `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

### Turbo Commands

```bash
# Run task across all workspaces
turbo run build
turbo run lint
turbo run test

# Run with options
turbo run build --filter=web-portal
turbo run dev --parallel
turbo run lint --continue

# Clear cache
turbo run build --force
rm -rf .turbo

# Generate task graph
turbo run build --graph=graph.png
```

## Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
pnpm install

# 3. Start development servers
pnpm dev

# 4. Make changes in your editor
# ...

# 5. Check your work
pnpm lint
pnpm type-check

# 6. Commit
git add .
git commit -m "feat: add new feature"
git push
```

### Building

```bash
# Build all workspaces
pnpm build

# Build specific workspace
pnpm --filter lc_api build
pnpm --filter web-portal build

# Build with cache cleared
turbo run build --force
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific workspace
pnpm --filter lc_api test
pnpm --filter web-portal test

# Run tests in watch mode
pnpm --filter lc_api test:watch

# Run tests with coverage
pnpm --filter lc_api test:cov
```

### Linting and Formatting

```bash
# Lint all code
pnpm lint

# Lint specific workspace
pnpm --filter lc_api lint

# Format all code
pnpm format

# Format specific files
prettier --write "apps/lc_apps/**/*.{ts,tsx}"
```

## Workspace Scripts Reference

### Root (package.json)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

### Backend API (apps/lc_api/package.json)

```json
{
  "scripts": {
    "dev": "cd api-server && npm run start:dev",
    "build": "cd api-server && npm run build",
    "start": "cd api-server && npm run start:prod",
    "lint": "cd api-server && npm run lint",
    "test": "cd api-server && npm test",
    "prisma:generate": "cd api-server && npm run prisma:generate",
    "prisma:migrate": "cd api-server && npm run prisma:migrate",
    "install:all": "cd api-server && npm install"
  }
}
```

### Frontend (apps/lc_apps/package.json)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check"
  }
}
```

## Troubleshooting

### pnpm Issues

#### Lock File Conflicts

```bash
# Regenerate lock file
rm pnpm-lock.yaml
pnpm install
```

#### Phantom Dependencies

```bash
# Check for issues
pnpm audit

# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Turbo Issues

#### Cache Problems

```bash
# Clear Turbo cache
rm -rf .turbo

# Or run with --force
turbo run build --force
```

#### Task Not Running

```bash
# Check task exists in turbo.json
cat turbo.json

# Run with verbose logging
turbo run build --verbose
```

### Workspace Issues

#### Can't Import from Workspace

```bash
# Check workspace is listed in pnpm-workspace.yaml
cat pnpm-workspace.yaml

# Reinstall dependencies
pnpm install

# Check package.json has correct reference
# "dependencies": { "@lc-apps/shared": "workspace:*" }
```

#### Port Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# Or use different ports
cd apps/lc_apps/web-admin
pnpm dev -- -p 3002
```

## Best Practices

### 1. Always Work from Root

```bash
# ✅ Good
cd evs-lc-apps
pnpm dev

# ❌ Avoid (unless necessary)
cd apps/lc_apps/web-portal
pnpm dev
```

### 2. Use Workspace Commands

```bash
# ✅ Good
pnpm --filter web-portal add axios

# ❌ Avoid
cd apps/lc_apps/web-portal
pnpm add axios
cd ../../../
```

### 3. Keep Lock File in Sync

```bash
# Always commit pnpm-lock.yaml
git add pnpm-lock.yaml
git commit -m "chore: update dependencies"
```

### 4. Use Turbo for Tasks

```bash
# ✅ Good - uses caching
pnpm build

# ❌ Avoid - no caching
cd apps/lc_api && pnpm build
cd apps/lc_apps && pnpm build
```

### 5. Clean Before Major Changes

```bash
# Before switching branches or major updates
pnpm clean
pnpm install
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
      
      - name: Lint
        run: pnpm lint
      
      - name: Test
        run: pnpm test
```

## Performance Tips

### Speed Up Installs

```bash
# Use frozen lockfile (faster, safer)
pnpm install --frozen-lockfile

# Skip optional dependencies
pnpm install --no-optional
```

### Optimize Turbo

```bash
# Enable remote caching
turbo login
turbo link

# Use .turboignore for files that don't affect builds
echo "*.md" >> .turboignore
echo "docs/**" >> .turboignore
```

### Parallel Development

```bash
# Run multiple terminals
Terminal 1: cd apps/lc_api/api-server && npm run start:dev
Terminal 2: cd apps/lc_apps/web-portal && pnpm dev
Terminal 3: cd apps/lc_apps/web-admin && pnpm dev

# Or use tmux/screen for multiplexing
```

## Resources

- [pnpm Documentation](https://pnpm.io/)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**Need help? See:**
- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions

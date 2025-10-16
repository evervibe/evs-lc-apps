# Structure Map - EVS-LC Apps v1.0.0

**Version:** 1.0.0  
**Date:** 2025-10-16  
**Purpose:** Complete directory structure map of the EVS-LC Apps monorepo

## Overview

This document provides a comprehensive map of the entire repository structure, including all directories, key files, and their purposes.

## Root Level

```
evs-lc-apps/                         # Root directory
├── .git/                            # Git repository data
├── .gitignore                       # Git ignore rules
├── .env.example                     # Environment template
├── LICENSE-CUSTOM                   # Commercial license
├── VERSION                          # Current version (v1.0.0)
├── README.md                        # Main project documentation
├── package.json                     # Root workspace configuration
├── pnpm-workspace.yaml              # Workspace package definitions
├── turbo.json                       # Turbo build orchestration
├── tsconfig.base.json               # Base TypeScript configuration
├── apps/                            # Application workspaces
└── docs/                            # Central documentation
```

## Applications (apps/)

###apps/lc_api/ - Backend API Workspace

```
apps/lc_api/
├── api-server/                      # NestJS API Application
│   ├── src/                         # Source code
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/                # Authentication module
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── decorators/      # Custom decorators
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   ├── guards/          # Auth guards
│   │   │   │   └── strategies/      # Passport strategies
│   │   │   ├── users/               # User management
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.module.ts
│   │   │   ├── tickets/             # Support tickets
│   │   │   ├── payments/            # Payment tracking
│   │   │   ├── redeem/              # Redeem codes
│   │   │   ├── news/                # News articles
│   │   │   ├── votes/               # Vote rewards
│   │   │   ├── game/                # Game integration
│   │   │   ├── health/              # Health checks
│   │   │   └── prisma/              # Prisma client
│   │   ├── connectors/              # External connections
│   │   │   └── mysql.connector.ts   # MySQL game DB connector
│   │   ├── app.module.ts            # Root application module
│   │   └── main.ts                  # Application entry point
│   ├── prisma/                      # Prisma ORM
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Database migrations
│   ├── .env.example                 # Environment template
│   ├── .eslintrc.js                 # ESLint configuration
│   ├── docker-compose.yml           # Docker services setup
│   ├── nest-cli.json                # NestJS CLI config
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   └── README.md                    # API server documentation
├── docs/                            # API-specific documentation
│   ├── PROJECT_OVERVIEW.md          # Project summary
│   └── IMPLEMENTATION_SUMMARY.md    # Implementation details
├── scripts/                         # Deployment scripts
│   ├── deploy.sh                    # Full deployment
│   ├── migrate.sh                   # Database migration
│   └── seed.sh                      # Database seeding
├── LICENSE-PROPRIETARY              # Legacy license
├── VERSION                          # Legacy version
├── package.json                     # Workspace scripts
├── tsconfig.json                    # TypeScript config
└── README.md                        # Backend documentation
```

**Key Files:**
- `api-server/src/main.ts`: Application bootstrap
- `api-server/prisma/schema.prisma`: Database schema (17 tables)
- `api-server/docker-compose.yml`: Services (PostgreSQL, MySQL, Redis)
- `scripts/*.sh`: Deployment automation

### apps/lc_apps/ - Frontend Workspace

```
apps/lc_apps/
├── web-portal/                      # Public Portal (Next.js)
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css              # Global styles
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/               # User dashboard
│   │   │   └── page.tsx
│   │   ├── news/                    # News pages
│   │   │   ├── page.tsx             # News list
│   │   │   └── [id]/
│   │   │       └── page.tsx         # News detail
│   │   ├── market/                  # Item shop
│   │   ├── rankings/                # Leaderboards
│   │   ├── vote/                    # Vote system
│   │   ├── redeem/                  # Code redemption
│   │   ├── support/                 # Support tickets
│   │   └── downloads/               # Client downloads
│   ├── components/                  # React components
│   │   ├── ui/                      # UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── toast.tsx
│   │   └── layout/                  # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # API client
│   │   └── utils.ts                 # Helper functions
│   ├── public/                      # Static assets
│   │   ├── favicon.ico
│   │   └── *.svg
│   ├── .gitignore
│   ├── .env.example                 # Environment template
│   ├── eslint.config.mjs            # ESLint config
│   ├── next.config.ts               # Next.js configuration
│   ├── package.json                 # Dependencies
│   ├── postcss.config.mjs           # PostCSS config
│   ├── tsconfig.json                # TypeScript config
│   └── README.md                    # Portal documentation
├── web-admin/                       # Admin Dashboard (Next.js)
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/               # Overview
│   │   ├── users/                   # User management
│   │   ├── tickets/                 # Ticket management
│   │   ├── news/                    # News editor
│   │   ├── events/                  # Event planner
│   │   └── redeem/                  # Code generator
│   ├── components/
│   │   └── ui/                      # UI components
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── public/
│   ├── .gitignore
│   ├── .env.example
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── README.md
├── shared/                          # Shared Library
│   ├── ui/                          # Shared UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── toast.tsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── usePagination.ts
│   ├── lib/                         # Utilities
│   │   ├── api-client.ts            # Axios client with interceptors
│   │   └── utils.ts                 # Helper functions
│   ├── types/                       # TypeScript types
│   │   └── index.ts                 # Type definitions
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── docs/                            # Frontend documentation
│   ├── COMPONENT_LIBRARY_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ENV_REFERENCE.md
│   ├── FRONTEND_ARCHITECTURE.md
│   └── PAGES_OVERVIEW.md
├── .gitignore
├── .prettierignore
│.prettierrc
├── CHANGELOG.md
├── PROJECT_SUMMARY.md
├── QUICKSTART.md
├── WORKSPACE_SETUP.md
├── package.json                     # Workspace root config
├── pnpm-workspace.yaml              # Workspace packages
├── turbo.json                       # Turbo configuration
└── README.md                        # Frontend documentation
```

**Key Files:**
- `web-portal/app/`: Next.js 15 App Router pages
- `web-admin/app/`: Admin dashboard pages
- `shared/ui/`: Reusable UI components
- `shared/lib/api-client.ts`: Axios client with JWT refresh
- `pnpm-workspace.yaml`: Defines workspace packages

## Documentation (docs/)

```
docs/
├── ARCHITECTURE.md                  # System architecture (13 KB)
├── API_GUIDE.md                     # API documentation (11 KB)
├── FRONTEND_GUIDE.md                # Frontend guide (12 KB)
├── ENV_REFERENCE.md                 # Environment variables (10 KB)
├── DEPLOYMENT_GUIDE.md              # Deployment instructions (14 KB)
├── WORKSPACE_GUIDE.md               # Monorepo guide (11 KB)
├── SECURITY_POLICY.md               # Security policies (15+ KB)
├── CHANGELOG.md                     # Version history
├── DEEP_ANALYSIS_REPORT.md          # Repository analysis (16+ KB)
├── MIGRATION_REPORT_v1.0.0.md       # Migration guide
├── STRUCTURE_MAP.md                 # This file
├── DOCS_INDEX.md                    # Documentation index
└── .gitkeep
```

**Total Documentation**: 100+ KB of comprehensive guides

## File Type Distribution

### TypeScript/JavaScript Files

```
Backend (lc_api):
├── Controllers: 9 files
├── Services: 10 files
├── Modules: 9 files
├── Guards: 2 files
├── Strategies: 1 file
├── Decorators: 2 files
└── DTOs: 5+ files

Frontend (lc_apps):
├── Pages (web-portal): 15+ files
├── Pages (web-admin): 8+ files
├── Components: 20+ files
├── Hooks: 3 files
└── Utilities: 5+ files

Shared Library:
├── UI Components: 5 files
├── Hooks: 3 files
├── Types: 1 file
└── Utils: 2 files
```

### Configuration Files

```
Root:
├── package.json (1)
├── pnpm-workspace.yaml (1)
├── turbo.json (1)
├── tsconfig.base.json (1)
├── .gitignore (1)
└── .env.example (1)

Backend:
├── package.json (2)
├── tsconfig.json (2)
├── nest-cli.json (1)
├── .eslintrc.js (1)
├── docker-compose.yml (1)
└── .env.example (1)

Frontend:
├── package.json (4)
├── tsconfig.json (4)
├── eslint.config.mjs (4)
├── next.config.ts (2)
├── postcss.config.mjs (2)
├── pnpm-workspace.yaml (1)
├── turbo.json (1)
└── .env.example (2)
```

### Documentation Files

```
├── README.md (4)
├── docs/*.md (12)
├── CHANGELOG.md (2)
├── LICENSE (2)
├── VERSION (2)
└── Other docs (10+)

Total: 30+ documentation files
```

## Database Structure

### PostgreSQL (Portal Database)

```
lc_portal (17 tables):
├── portal_users
├── portal_user_security
├── portal_oauth_providers
├── portal_game_accounts
├── portal_sessions
├── portal_activity_log
├── portal_roles
├── portal_permissions
├── portal_role_permissions
├── portal_user_roles
├── portal_news
├── portal_donations
├── portal_payments
├── portal_tickets
├── portal_votes
├── portal_redeem_codes
└── portal_market_listings
```

### MySQL (Game Database)

```
lc_game (existing tables):
├── db_auth/
│   └── (authentication tables)
├── db_db/
│   ├── characters
│   ├── guilds
│   └── (game data tables)
├── db_data/
│   └── (configuration tables)
└── db_logs/
    └── (log tables)
```

## Asset Sizes

### Code Statistics

```
TypeScript/JavaScript:
├── Backend: ~5,000 lines
├── Frontend: ~8,000 lines
├── Shared: ~1,500 lines
└── Total: ~14,500 lines

Documentation:
├── Markdown: ~15,000 lines
├── Total words: ~100,000 words
└── Total size: ~100+ KB
```

### Bundle Sizes (Production)

```
Frontend Apps:
├── web-portal:
│   ├── First Load JS: 130-143 KB
│   └── Pages: 15+ routes
└── web-admin:
    ├── First Load JS: 116-119 KB
    └── Pages: 8+ routes
```

## Port Assignments

```
Development:
├── API Server: 4000
├── Web Portal: 3000
├── Web Admin: 3001
├── PostgreSQL: 5432
├── MySQL: 3306
└── Redis: 6379 (optional)

Production:
├── API: https://api.yourdomain.com
├── Portal: https://portal.yourdomain.com
└── Admin: https://admin.yourdomain.com
```

## Environment Files

```
Required .env files:
├── /apps/lc_api/api-server/.env
├── /apps/lc_apps/web-portal/.env (optional, uses root)
└── /apps/lc_apps/web-admin/.env (optional, uses root)

Templates:
├── /.env.example (root - comprehensive)
└── /apps/lc_api/api-server/.env.example (backend-specific)
```

## Git Structure

```
.git/
├── hooks/
├── objects/
├── refs/
│   ├── heads/
│   │   └── main
│   └── remotes/
│       └── origin/
│           └── copilot/restructure-evs-lc-repository
└── config
```

## Key Directories Summary

| Directory | Purpose | Files | Size |
|-----------|---------|-------|------|
| `/apps/lc_api` | Backend API | 60+ | ~5 MB |
| `/apps/lc_apps/web-portal` | Public portal | 50+ | ~3 MB |
| `/apps/lc_apps/web-admin` | Admin dashboard | 40+ | ~2 MB |
| `/apps/lc_apps/shared` | Shared library | 20+ | ~500 KB |
| `/docs` | Documentation | 12+ | ~100 KB |
| Root | Configuration | 8 | ~50 KB |

**Total Repository Size**: ~15-20 MB (excluding node_modules, .git)

## Quick Navigation

### For Developers

```bash
# Backend development
cd apps/lc_api/api-server
npm run start:dev

# Frontend development
cd apps/lc_apps
pnpm dev

# Documentation
cd docs/
cat DOCS_INDEX.md
```

### For Administrators

```bash
# Deployment scripts
cd apps/lc_api/scripts/
./deploy.sh

# Configuration
nano .env.example

# Logs
pm2 logs
```

### For Documentation

```bash
# Main documentation
docs/README.md          # Start here
docs/ARCHITECTURE.md    # System design
docs/API_GUIDE.md       # API reference
docs/DEPLOYMENT_GUIDE.md # Deployment

# Specific guides
docs/FRONTEND_GUIDE.md
docs/WORKSPACE_GUIDE.md
docs/SECURITY_POLICY.md
```

---

**Structure Map Version:** 1.0.0  
**Last Updated:** 2025-10-16  
**Total Items Mapped:** 200+ files and directories  
**Documentation Coverage:** 100%

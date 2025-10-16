# EVS-LC-APPS Structure Overview

**Version:** 1.0.2  
**Date:** 2025-10-16  
**Purpose:** High-level overview of the EVS-LC Apps monorepo structure

## Project Overview

EVS-LC-APPS is a modern, scalable monorepo containing all web applications and backend services for the Last Chaos MMORPG project. The repository follows a clean architecture approach with clear separation of concerns.

## Repository Structure

### Root Level
```
evs-lc-apps/
├── apps/                    # All applications
│   ├── lc_api/             # Backend API workspace
│   └── lc_apps/            # Frontend applications workspace
├── docs/                    # Central documentation
├── .github/                 # CI/CD workflows
├── package.json            # Root workspace config
├── pnpm-workspace.yaml     # Workspace definitions
├── turbo.json              # Build orchestration
└── tsconfig.base.json      # Shared TypeScript config
```

## Core Applications

### 1. Backend API (apps/lc_api/)

**Path:** `apps/lc_api/api-server/`  
**Technology:** NestJS + PostgreSQL + MySQL  
**Port:** 4000

The backend API provides all server-side functionality including:
- User authentication (JWT + 2FA)
- Role-based access control (RBAC)
- Portal database operations (PostgreSQL)
- Game database integration (MySQL)
- Support ticket system
- Payment processing
- Item shop
- Vote rewards
- News management
- Character/Guild rankings

**Key Directories:**
- `src/modules/` - Feature modules (auth, users, tickets, etc.)
- `src/prisma/` - Database schema and migrations
- `src/config/` - Configuration management
- `src/common/` - Shared utilities and decorators

### 2. Web Portal (apps/lc_apps/web-portal/)

**Technology:** Next.js 15 + Tailwind CSS  
**Port:** 3000

Public-facing player portal with features:
- User registration and login
- Two-factor authentication
- Account dashboard
- Item shop interface
- News and announcements
- Rankings (characters/guilds)
- Vote for rewards
- Support tickets
- Code redemption

### 3. Web Admin (apps/lc_apps/web-admin/)

**Technology:** Next.js 15 + Tailwind CSS  
**Port:** 3001

Administrative dashboard for:
- User management
- Ticket management
- News editor
- Event planning
- Audit log viewer
- System monitoring

### 4. Shared Library (apps/lc_apps/shared/)

**Technology:** React + TypeScript  
**Type:** NPM Workspace Package

Reusable components and utilities:
- UI components (shadcn/ui based)
- Custom React hooks
- API client utilities
- TypeScript type definitions
- Theme configuration

## Technology Stack

### Backend
- **Framework:** NestJS 10.3+
- **Databases:** PostgreSQL 16+ (Portal), MySQL 8.0+ (Game)
- **ORM:** Prisma
- **Authentication:** JWT + TOTP
- **Password Hashing:** Argon2id
- **Cache:** Redis (optional)

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** Zustand
- **Forms:** React Hook Form
- **HTTP Client:** Axios

### Monorepo Management
- **Package Manager:** pnpm 10+
- **Build System:** Turbo
- **Language:** TypeScript 5.9+

## Workspace Configuration

The project uses pnpm workspaces with the following structure:

```yaml
packages:
  - "apps/*/*"
  - "!**/node_modules"
  - "!**/dist"
```

This allows:
- Shared dependencies across applications
- Incremental builds with Turbo
- Independent versioning per application
- Efficient disk space usage

## Development Workflow

### Quick Start
```bash
# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Build all applications
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Individual App Commands
```bash
# API Server
cd apps/lc_api/api-server
pnpm dev

# Web Portal
cd apps/lc_apps/web-portal
pnpm dev

# Web Admin
cd apps/lc_apps/web-admin
pnpm dev
```

## Environment Configuration

Each application requires its own environment configuration:

- **Root:** `.env.example` (template for all services)
- **API Server:** `apps/lc_api/api-server/.env.example`
- **Web Portal:** `apps/lc_apps/web-portal/.env.example`
- **Web Admin:** `apps/lc_apps/web-admin/.env.example`

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed configuration guide.

## CI/CD Pipeline

Automated workflows in `.github/workflows/`:
- **ci.yml** - Build, lint, type-check, test
- Runs on push to main/develop branches
- Docker build testing for all services
- Matrix testing across Node versions

## Documentation

Comprehensive documentation in `/docs`:
- Architecture guides
- API documentation
- Deployment guides
- Security policies
- Environment references
- Integration blueprints

## Future Extensions

The repository is structured to accommodate future additions:
- Game bridge workers (lc_game_bridge)
- Real-time notification service
- Mobile applications
- Advanced analytics
- Social features

See [ROADMAP_BASECRAFT.md](./ROADMAP_BASECRAFT.md) for planned enhancements.

## Security Considerations

- JWT tokens with short expiration
- Argon2id password hashing
- Rate limiting on API endpoints
- CORS protection
- SQL injection prevention
- Comprehensive audit logging
- Environment variable validation
- Security headers on all responses

See [SECURITY_POLICY.md](./SECURITY_POLICY.md) for security best practices.

## Support & Resources

- **Documentation:** [/docs](../docs)
- **Issues:** [GitHub Issues](https://github.com/evervibe/evs-lc-apps/issues)
- **Version:** v1.0.2
- **License:** Custom Commercial License

---

**Last Updated:** 2025-10-16  
**Maintained by:** EverVibe Studios

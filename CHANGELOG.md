# Changelog

All notable changes to the EVS-LC-APPS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-10-16

### Added

#### Documentation
- **Structure Documentation**
  - `docs/STRUCTURE_OVERVIEW.md` - High-level repository structure overview
  - `docs/ROADMAP_BASECRAFT.md` - Future development roadmap with v2 feature plans
  - `docs/SECURITY_CHECKLIST.md` - Comprehensive security validation checklist

#### Frontend
- **Environment Templates**
  - `.env.example` for web-portal with all required variables including `NEXT_PUBLIC_API_BASE_URL`
  - `.env.example` for web-admin with all required variables including `NEXT_PUBLIC_API_BASE_URL`

#### Infrastructure
- **Directory Structure**
  - Created `apps/lc_game_bridge/` placeholder for future game synchronization worker
  - Created `infra/docker/` directory for Docker-related configurations
  - Created `infra/configs/` directory for infrastructure configurations
  - Added README.md files documenting future use

### Changed

- **Repository Cleanup**
  - Removed redundant `.DS_Store` files
  - Updated `.gitignore` to prevent future `.DS_Store` commits

### Fixed

- **Environment Configuration**
  - Added missing `NEXT_PUBLIC_API_BASE_URL` to frontend environment examples
  - Ensured all applications have proper environment templates

---

## [1.0.1] - 2025-10-16

### Added

#### Infrastructure & DevOps
- **Docker Production Setup**
  - Multi-stage Dockerfiles for all services (API, web-portal, web-admin)
  - Security-hardened containers with non-root users
  - Health checks for all services
  - Production-ready `docker-compose.prod.yml` with PostgreSQL, Redis, and all apps
  - Comprehensive Docker deployment documentation (`docs/DEPLOY_DOCKER_PROD.md`)

#### CI/CD
- **GitHub Actions Workflow**
  - Automated build, lint, and type-check on push and pull requests
  - Docker build testing for all services
  - Matrix strategy for testing across Node versions
  - Caching for faster builds

#### Documentation
- **Environment Configuration**
  - Comprehensive environment variables guide (`docs/ENVIRONMENT.md`)
  - Detailed configuration tables for all services
  - Security best practices for production
  - Troubleshooting guides

#### Backend API
- **Environment Validation**
  - Runtime environment variable validation using Zod
  - Descriptive error messages for missing/invalid configuration
  - Type-safe environment access
  - Validates all required database connections, JWT secrets, and service URLs

- **Improved Build Process**
  - OpenAPI specification auto-export on build (placeholder script)
  - Prisma migrate deploy integrated into start scripts
  - Production-ready startup sequence

#### Frontend
- **Security Headers**
  - Strict-Transport-Security (HSTS)
  - X-Content-Type-Options
  - X-Frame-Options (DENY)
  - X-XSS-Protection
  - Referrer-Policy
  - Applied to both web-portal and web-admin

- **Environment Templates**
  - `.env.example` for web-portal with all required variables
  - `.env.example` for web-admin with all required variables
  - Clear documentation of feature flags

- **Tailwind Configuration**
  - `tailwind.config.ts` for web-portal (TypeScript support)
  - `tailwind.config.ts` for web-admin (TypeScript support)
  - Workspace-aware content paths for shared components

### Changed

#### Package Management
- **Unified pnpm Workspace**
  - Simplified `pnpm-workspace.yaml` to use glob patterns (`apps/*/*`)
  - Cleaner workspace structure
  - Excludes `node_modules` and `dist` directories

- **Dependencies**
  - Added `zod` for environment validation
  - Removed npm `package-lock.json` in favor of pnpm

#### Configuration
- **Backend Environment**
  - Fixed `DATABASE_URL` in `.env.example` (removed shell variable interpolation)
  - Proper PostgreSQL connection string format
  - Updated for production readiness

### Fixed
- Database URL configuration issues with environment variable interpolation
- Missing Tailwind configuration files
- Missing environment variable templates for frontend applications

### Security
- Environment validation prevents misconfiguration
- Security headers protect against common web vulnerabilities
- Non-root Docker containers
- Secrets management guidelines in documentation
- Production deployment security checklist

---

## [1.0.0] - 2025-10-15

### Added
- Initial stable release
- Complete backend API with NestJS
- Dual database support (PostgreSQL + MySQL)
- Authentication system with JWT + 2FA
- User portal with Next.js 15
- Admin dashboard structure
- Monorepo workspace configuration with pnpm + Turbo
- Comprehensive documentation suite
- Security implementations (Argon2id, RBAC, rate limiting)
- Production deployment guides

### Features
- User authentication and authorization
- Support ticket system
- Payment transaction tracking
- Item shop backend
- Vote rewards system
- Code redemption
- News management
- Character/Guild rankings
- Game account creation
- Comprehensive audit logging

### Technical Stack
- **Backend**: NestJS 10.3+, PostgreSQL 16+, MySQL 8.0+, Prisma ORM
- **Frontend**: Next.js 15, Tailwind CSS v4, shadcn/ui, Zustand
- **Monorepo**: pnpm workspaces, Turbo build system
- **Language**: TypeScript 5.9+

---

## Version History

- **v1.0.1** (2025-10-16) - Production hardening, Docker setup, CI/CD, enhanced security
- **v1.0.0** (2025-10-15) - Initial stable release

---

## Upgrade Guide

### From 1.0.0 to 1.0.1

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

2. **Update Dependencies**
   ```bash
   pnpm install
   ```

3. **Add New Environment Variables**
   - Check `docs/ENVIRONMENT.md` for any new required variables
   - Update your `.env` files accordingly

4. **Review Security Headers**
   - Security headers are now automatically applied
   - Verify compatibility with your reverse proxy configuration

5. **Docker Deployment (Optional)**
   - Review `docs/DEPLOY_DOCKER_PROD.md` for Docker deployment
   - Consider migrating to containerized deployment for easier management

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

---

**For detailed information about each version, see the commit history on GitHub.**

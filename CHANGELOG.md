# Changelog

All notable changes to the EVS-LC-APPS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-16

### Added

#### Portal Database Enhancements
- **Extended User Profiles**
  - `portal_user_profiles` table with social features
  - Display name, bio, avatar, banner customization
  - Privacy settings (show online, allow friends, allow messages)
  - Login statistics tracking (last IP, total logins)

#### Role-Based Access Control (RBAC)
- **Portal Roles System**
  - `portal_roles` table for hierarchical role management
  - Role priority system for access control
  - Default roles: SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT, USER
- **Portal Permissions System**
  - `portal_permissions` table for fine-grained permissions
  - Resource-action permission format (e.g., users.read, tickets.write)
  - Many-to-many relationship between roles and permissions

#### Game Bridge Worker
- **Foundation Implementation**
  - NestJS-based worker service for real-time game synchronization
  - Character synchronization worker (every 5 minutes)
  - Inventory synchronization worker (every 10 minutes)
  - Guild synchronization worker (every 15 minutes)
  - Event listener worker for real-time game events
- **Job Queue System**
  - Redis-powered Bull queue for reliable job processing
  - Configurable retry logic and error handling
  - Concurrent job processing with rate limiting
- **Sync Status Tracking**
  - `game_sync_status` table for monitoring synchronization
  - Tracks sync type, server ID, status, and records processed
  - Error logging for failed synchronization attempts
- **Monitoring API**
  - REST endpoints for sync status and manual triggers
  - Health check endpoints
  - Job queue statistics
  - Prometheus metrics support

#### Authentication Enhancements
- **2FA Backup Codes**
  - Generate 10 backup codes per user for 2FA recovery
  - Hashed storage using Argon2id
  - One-time use validation
- **Enhanced Session Management**
  - Improved session tracking with user agent and IP
  - Configurable session max age
  - Automatic cleanup of expired sessions

#### Documentation
- **Comprehensive Guides**
  - `docs/AGENT_OMNIFORGE_v1.5.0.md` - Complete multi-phase development agent prompt
  - `docs/MIGRATION_GUIDE_v1.1.0.md` - Detailed migration guide from v1.0.2
  - `docs/PORTAL_DB_SCHEMA.md` - Complete portal database schema documentation
  - `docs/GAME_BRIDGE_GUIDE.md` - Game Bridge Worker setup and operation guide
- **Updated Roadmap**
  - Updated `docs/ROADMAP_BASECRAFT.md` with v1.1.0 completion status
  - Phase tracking for v1.2.0 - v1.5.0 development

#### Infrastructure
- **CI/CD Pipeline Extension**
  - Added Game Bridge Worker to build pipeline
  - Automated testing for bridge worker
  - Docker build support for new service
- **Environment Configuration**
  - New environment variables for Game Bridge Worker
  - Redis configuration for job queue
  - Sync interval configuration options
  - Enhanced database connection pooling settings

### Changed

- **Version Numbers**
  - Updated VERSION file to v1.1.0
  - Updated root package.json to 1.1.0
  - Updated lc_api package.json to 1.1.0
  - Updated lc_apps package.json to 1.1.0
  - Added lc_game_bridge with version 1.1.0

- **Database Schema**
  - Extended User model with backupCodes field (String[])
  - Added UserProfile relation to User model
  - Added PortalRole and PortalPermission models
  - Added GameSyncStatus model for sync tracking

- **Project Structure**
  - Populated `apps/lc_game_bridge/` with worker implementation
  - Added Redis as runtime dependency
  - Added Bull queue as core dependency

### Fixed

- None - This is a feature release with no bug fixes

### Security

- **Enhanced 2FA Recovery**
  - Backup codes provide secure 2FA recovery method
  - Argon2id hashing for backup code storage
  - One-time use prevents code reuse

- **Permission System**
  - Fine-grained permissions for better access control
  - Resource-level security with action scoping
  - Audit trail for permission changes

### Performance

- **Optimized Sync Operations**
  - Batch processing for large datasets
  - Configurable concurrency for parallel processing
  - Connection pooling for database efficiency
  - Redis caching for frequently accessed data

---

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

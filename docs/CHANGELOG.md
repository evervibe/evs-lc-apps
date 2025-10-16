# Changelog - EVS-LC Apps

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-16

### Major Milestone: Production Release v1.0.0 🎉

This release marks the first stable, production-ready version of EVS-LC Apps after complete repository restructuring and standardization.

### Added

#### Repository Structure
- Root-level monorepo configuration with pnpm workspaces
- Turbo build system for efficient workspace orchestration
- Centralized documentation in `/docs` directory
- Root `.env.example` with comprehensive configuration template
- Root `.gitignore` for proper file exclusions
- Root `LICENSE-CUSTOM` with commercial protection
- Root `VERSION` file tracking current version
- Root `README.md` with complete project overview

#### Backend API (lc_api)
- Complete NestJS-based REST API server
- PostgreSQL portal database with Prisma ORM (17 tables)
- MySQL game database integration with read-only access
- JWT authentication with refresh tokens
- TOTP 2FA support with QR code generation
- Argon2id password hashing (64MB memory, 3 iterations)
- Role-Based Access Control (RBAC) system
- Comprehensive audit logging
- 29 fully documented API endpoints
- Swagger/OpenAPI documentation at `/api/docs`
- Health monitoring endpoints
- Rate limiting and CORS protection
- Docker Compose setup for easy deployment
- Deployment scripts (migrate, seed, deploy)

#### Frontend Applications (lc_apps)
- Next.js 15 web portal (public-facing)
- Next.js 15 web admin (administrative dashboard)
- Shared component library with UI components
- Tailwind CSS v4 styling system
- shadcn/ui + Radix UI components
- Zustand state management
- React Hook Form for forms
- Axios API client with JWT refresh interceptors
- Custom React hooks (useAuth, useFetch, usePagination)
- Responsive design for all screen sizes

#### Documentation
- **ARCHITECTURE.md**: Complete system architecture (11.6 KB)
- **API_GUIDE.md**: Comprehensive API documentation (10.9 KB)
- **FRONTEND_GUIDE.md**: Frontend development guide (12 KB)
- **ENV_REFERENCE.md**: Environment variables reference (9.6 KB)
- **DEPLOYMENT_GUIDE.md**: Production deployment guide (14 KB)
- **WORKSPACE_GUIDE.md**: Monorepo workspace guide (11 KB)
- **SECURITY_POLICY.md**: Security policies and best practices (15+ KB)
- **CHANGELOG.md**: Version history (this file)
- **MIGRATION_REPORT_v1.0.0.md**: Detailed migration report
- **DEEP_ANALYSIS_REPORT.md**: Repository analysis findings
- **STRUCTURE_MAP.md**: Complete directory structure map
- **DOCS_INDEX.md**: Documentation index and navigation

### Changed

#### Repository Organization
- Renamed `apps/backend-LC` → `apps/lc_api`
- Renamed `apps/frontend-LC` → `apps/lc_apps`
- Restructured `lc_api` to have consistent module organization
- Updated `lc_apps` workspace references (portal-web/admin-ui → web-portal/web-admin)
- Consolidated scattered documentation into central `/docs` directory
- Standardized package.json scripts across all workspaces

#### Configuration Updates
- Updated pnpm-workspace.yaml to reflect new structure
- Enhanced turbo.json with proper task dependencies
- Created tsconfig.base.json as base TypeScript configuration
- Unified environment variable configuration
- Standardized .gitignore across workspaces

### Fixed
- Workspace naming inconsistencies
- Missing environment variable templates
- Incomplete documentation references
- Build configuration issues
- Dependency management problems

### Security
- Implemented Argon2id for password hashing
- Added JWT token security with short expiration
- Enabled TOTP two-factor authentication
- Implemented RBAC with granular permissions
- Added comprehensive audit logging
- Configured rate limiting on all endpoints
- Implemented CORS protection
- Added SQL injection prevention
- Enabled failed login tracking and account lockout

### Infrastructure
- Complete Docker Compose setup
- PM2 ecosystem configuration
- nginx reverse proxy configuration
- SSL/TLS setup with Let's Encrypt
- Database backup scripts
- Health monitoring endpoints
- Log aggregation setup

## [0.9.0] - 2025-01-16 (Pre-Restructure)

### Added
- Initial backend API implementation
- Initial frontend portal and admin applications
- Basic authentication system
- Database schemas
- Core features (news, tickets, market, rankings)

### Known Issues (Pre-v1.0.0)
- Inconsistent workspace naming
- Documentation scattered across multiple locations
- Missing central configuration
- No unified license
- Incomplete deployment guides

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2025-10-16 | **Production Release** - Complete restructuring, full documentation, production-ready |
| 0.9.0 | 2025-01-16 | Pre-release - Initial implementations |

## Upgrade Guide

### From 0.9.0 to 1.0.0

This is a major restructuring release. Follow the [Migration Report](./MIGRATION_REPORT_v1.0.0.md) for detailed upgrade instructions.

**Key Changes:**
1. Directory names changed (backend-LC → lc_api, frontend-LC → lc_apps)
2. Workspace configuration updated
3. Central documentation structure
4. Unified environment variables
5. Standardized scripts

**Migration Steps:**
1. Pull latest changes
2. Update local environment files
3. Run `pnpm install` from root
4. Update any custom scripts or CI/CD pipelines
5. Review new documentation structure

## Future Roadmap

### v1.1.0 (Planned)
- [ ] WebSocket real-time notifications
- [ ] Advanced admin dashboard features
- [ ] Enhanced analytics and reporting
- [ ] Mobile app development
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support

### v1.2.0 (Planned)
- [ ] Social features (friends, messaging)
- [ ] Advanced search functionality
- [ ] Event management system
- [ ] Automated testing suite
- [ ] Performance optimizations

### v2.0.0 (Future)
- [ ] Microservices architecture migration
- [ ] GraphQL API option
- [ ] Advanced caching layer
- [ ] Multi-region deployment
- [ ] Advanced security features

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## Support

For issues, questions, or suggestions:
- GitHub Issues: https://github.com/evervibe/evs-lc-apps/issues
- Email: support@yourdomain.com
- Documentation: [/docs](./README.md)

---

**EVS-LC Apps** - Modern, Secure, Scalable  
Copyright © 2025 EverVibe Studios / EVS-LC  
Licensed under Custom Commercial License - See [LICENSE-CUSTOM](../LICENSE-CUSTOM)

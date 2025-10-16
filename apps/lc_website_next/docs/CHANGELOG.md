# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-10-03

### Added - Identity Bridge Phase 1

#### Database & Schema
- Prisma ORM integration with MySQL support
- Complete portal database schema with 8 models:
  - User accounts with Argon2id password hashing
  - Session management (Auth.js compatible)
  - OAuth account integration support
  - MFA TOTP and backup codes
  - Game server configuration management
  - Game account linking system
  - Comprehensive audit logging
- Portal schema documentation (`docs/portal_schema.md`)

#### Security & Cryptography
- Argon2id password hashing for portal accounts
- Legacy password hash verification (MD5, SHA256-salt, plaintext)
- Multi-algorithm detection with `detectAndVerify()`
- Rate limiting system (in-memory):
  - Auth endpoints: 5 attempts per 15 minutes
  - Game linking: 3 attempts per 10 minutes
  - Default: 60 requests per minute
- Security headers middleware (CSP, XSS, Frame Options, etc.)
- Audit logging with automatic sensitive data redaction

#### Legacy Database Integration
- Read-only multi-server connector with connection pooling
- Runtime guard preventing non-SELECT queries
- GameServer table-based configuration (preferred)
- Environment variable fallback (up to 5 servers)
- Health check routines for database connectivity
- MySQL2 connection pool management

#### API Endpoints
- `POST /api/auth/register` - Portal user registration
- `POST /api/auth/login` - Login skeleton (Auth.js integration pending)
- `GET /api/servers` - List game servers (public info only)
- `POST /api/servers` - Add game server (admin-only, ADMIN_TOKEN protected)
- `POST /api/game/link` - Link legacy game account with verification
- `GET /api/game/links` - List user's linked game accounts
- `GET /api/rankings/summary` - Example read-only legacy DB query

#### Configuration
- `.env.example` with portal DB, admin token, and legacy DB fallback configs
- Zod validation schemas for all API inputs
- Environment-based configuration support

#### Documentation
- Agent log: `004_identity_bridge.md`
- Portal schema documentation with security notes
- API endpoint documentation
- Legacy hash algorithm documentation

### Dependencies
- `@prisma/client` ^6.16.3
- `@node-rs/argon2` ^2.0.2
- `mysql2` ^3.15.1
- `zod` ^4.1.11
- `prisma` ^6.16.3 (dev)

### Security Notes
- No write operations to legacy databases
- All sensitive data redacted from logs
- Rate limiting prevents brute force attacks
- Legacy hashes verified but not migrated
- Read-only database connections only

## [0.3.0] - 2025-10-03

### Added
- Framer Motion animations for Hero section with fade-in effects
- Animated gradient background elements in Hero section
- Testimonials section on landing page with player feedback
- Trust indicators section with key metrics
- Accordion component for FAQ page (shadcn/ui style)
- Client-side form validation for Contact page with error messages
- News page with dummy articles and category filters
- News link added to Header navigation (desktop and mobile)
- PWA manifest.json for progressive web app support
- Enhanced meta tags with Twitter cards and OpenGraph
- Social media icons in Footer (Discord, Facebook, YouTube)
- Additional footer links (FAQ, News, Changelog)
- Visual improvements to Legal pages with section cards
- Gradient animation keyframes in global CSS

### Changed
- Hero section enhanced with improved gradient backgrounds and animations
- FAQ page converted to use accordion component for better UX
- Contact form now includes validation and loading states
- Footer expanded with more links and better organization
- Legal pages (Impressum, Datenschutz) improved with card-based sections
- Sitemap updated to include news page

### Improved
- Overall visual polish with consistent card styling
- Better mobile responsiveness across all new components
- Enhanced user experience with form validation feedback
- More professional gaming portal appearance

## [0.2.0] - 2025-10-03

### Added
- Public website structure migrated from legacy PHP system
- Modern Next.js 15 with TypeScript and TailwindCSS setup
- Global layout with Header and Footer components
- Hero section with gaming/high-tech design
- Landing page with features and content from legacy
- Rankings placeholder page
- Shop placeholder page
- FAQ page with legacy content
- Contact page with form (frontend only)
- Legal pages: Impressum and Datenschutz
- SEO metadata for all pages
- robots.txt and sitemap.xml
- Responsive design with dark mode support
- Assets migrated from legacy template

### Changed
- Migrated from PHP/MySQL to Next.js architecture
- Modernized UI/UX design
- Improved mobile responsiveness

## [0.1.0] - Initial Setup

### Added
- Next.js 15 project initialization
- TailwindCSS configuration
- TypeScript setup
- Basic project structure

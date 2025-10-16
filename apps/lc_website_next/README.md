# LastChaos - Modern Portal

Modern portal and authentication system for LastChaos MMORPG built with Next.js 15, TypeScript, and TailwindCSS.

**Current Version:** 0.5.0  
**Phase:** 3 - Security & MFA ✅  
**Status:** Production Ready (Backend)

---

## 🎯 Overview

The LC Portal is a comprehensive authentication and user management system that bridges the gap between the legacy game infrastructure and modern web standards. It provides:

- ✅ **Secure Authentication** with Argon2id password hashing
- ✅ **Multi-Factor Authentication** (TOTP + Backup Codes)
- ✅ **Password Reset Flow** with email verification
- ✅ **Game Account Linking** to legacy databases
- ✅ **Admin Dashboard** with monitoring and statistics
- ✅ **Audit Logging** for all security-relevant actions
- ✅ **Rate Limiting** to prevent abuse
- ✅ **Docker Infrastructure** for easy deployment

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Installation

```bash
# 1. Clone and navigate to project
cd lc_website_next

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env

# 4. Start all services (Portal-DB, Legacy-DB, Redis, Mailhog)
docker compose up -d

# 5. Initialize database schema
pnpm db:init

# 6. Seed test data
pnpm db:seed

# 7. Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Test Credentials:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

**Development Tools:**
- Mailhog UI: [http://localhost:8025](http://localhost:8025)
- Prisma Studio: `pnpm prisma studio`

📖 **Detailed Setup Guide:** [docs/SETUP_LOCAL_DEV.md](docs/SETUP_LOCAL_DEV.md)

---

## 📋 Phase Status

### ✅ Phase 1: Public Website (v0.2.0)

### ✅ Completed Features

- **Global Layout**: Header with navigation and Footer with links
- **Landing Page**: Hero section, features showcase, CTA sections
- **Rankings Page**: Placeholder for player/guild/PVP rankings
- **Shop Page**: Placeholder for item shop with categories preview
- **FAQ Page**: Comprehensive frequently asked questions
- **Contact Page**: Contact form and information (frontend only)
- **Legal Pages**: Impressum and Datenschutz (German legal requirements)
- **Download Page**: Game client download with system requirements
- **Register Page**: Account creation form (frontend only)
- **SEO**: Metadata, Open Graph tags, sitemap.xml, robots.txt
- **Design**: Dark mode support, responsive layout, gaming aesthetic

### 🎨 Design Features

- Modern gaming/high-tech aesthetic
- Dark theme with accent colors (#ffdda9)
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Grid-based layouts
- Accessible navigation

### 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── contact/         # Contact form page
│   ├── download/        # Download page
│   ├── faq/            # FAQ page
│   ├── legal/          # Legal pages
│   │   ├── datenschutz/
│   │   └── impressum/
│   ├── rankings/       # Rankings page
│   ├── register/       # Registration page
│   ├── shop/           # Shop page
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Landing page
│   └── sitemap.ts      # Sitemap generator
├── components/         # React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── Hero.tsx
└── app/globals.css     # Global styles
```

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Package Manager**: pnpm
- **React**: v19

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🗺 Content Migration

All content has been migrated from the legacy PHP system:

- **Navigation structure** from `legacy/index.php`
- **Footer sections** and links
- **Language strings** from `legacy/include/languages/en.php`
- **Design patterns** from `legacy/template/empire/`

See `docs/agent_logs/2025-10-03/001_public_website.md` for detailed migration notes.

### ✅ Phase 2: Identity Bridge (v0.3.0)

**Status:** Complete ✅

- **Auth.js v5 Integration**: Modern authentication framework
- **Frontend UI Pages**: Login, Register, Account Management, Server Admin
- **Game Account Linking**: Link portal accounts to legacy game accounts
- **Docker Infrastructure**: MySQL 8.0 for portal database
- **Testing**: 20 passing unit tests with Vitest

See [PHASE2_COMPLETE.md](PHASE2_COMPLETE.md) for details.

### ✅ Phase 3: Security & MFA (v0.5.0)

**Status:** Complete ✅

**Backend (100% Complete):**
- ✅ Multi-Factor Authentication (TOTP + Backup Codes)
- ✅ Password Reset Flow with email
- ✅ Security Event Logging (extended audit log)
- ✅ Admin Statistics API
- ✅ Rate Limiting on sensitive endpoints
- ✅ Email utility (dev/prod modes)
- ✅ Comprehensive documentation

**Frontend (Pending):**
- ⏳ MFA setup/management UI
- ⏳ Password reset pages
- ⏳ Security history display
- ⏳ Admin dashboard with charts

See [docs/agent_logs/2025-10-03/007_phase3.md](docs/agent_logs/2025-10-03/007_phase3.md) for implementation details.

---

## 🔐 Security Features

### Multi-Factor Authentication (MFA)

**Setup:**
1. Navigate to `/account` → Enable MFA
2. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
3. Verify setup with 6-digit code
4. Save 8 backup codes securely

**APIs:**
- `POST /api/mfa/setup` - Generate TOTP secret and QR code
- `POST /api/mfa/verify` - Confirm MFA setup
- `POST /api/mfa/disable` - Disable MFA (requires password)
- `POST /api/mfa/backup-codes` - Generate recovery codes

### Password Reset

**Flow:**
1. Request reset: `POST /api/auth/request-reset`
2. Receive email with secure token (1-hour expiration)
3. Reset password: `POST /api/auth/reset`

**Security:**
- Cryptographically secure tokens (32 bytes)
- Single-use tokens
- Email enumeration prevention
- Rate limiting

### Audit Logging

All security events are logged:
- Login attempts (success/failure)
- MFA enable/disable
- Password resets
- Game account linking
- Admin actions

**Query History:**
```typescript
GET /api/account/security-history
// Returns last 10 security events
```

### Rate Limiting

- **Auth endpoints**: 5 attempts per 15 minutes
- **Game linking**: 3 attempts per 10 minutes
- **Default**: 60 requests per minute

---

## 🗄️ Database Schema

### Portal Database

```sql
users                   -- Portal user accounts (Argon2id)
sessions                -- Auth sessions
oauth_accounts          -- OAuth provider links
mfa_totp                -- TOTP configurations
mfa_backup_codes        -- Hashed backup codes
password_reset_tokens   -- Time-limited reset tokens
game_servers            -- Game server configurations
game_account_links      -- Portal ↔ Game account links
audit_logs              -- Security event logging
```

### Legacy Database (Read-Only)

```sql
bg_user                 -- Legacy game accounts
-- Other game tables (read-only access)
```

See [docs/portal_schema.md](docs/portal_schema.md) for complete schema documentation.

---

## 🧪 Testing

### Unit Tests

```bash
pnpm test              # Run all unit tests
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Run with coverage report
```

**Current Status:** ✅ 20/20 tests passing

### E2E Tests

```bash
pnpm test:e2e          # Run E2E tests with Playwright
pnpm test:e2e:ui       # Run with Playwright UI
```

**Test Coverage:**
- Registration flow
- Login flow
- Account page access
- Password reset flow
- Public page accessibility

### Linting

```bash
pnpm lint              # Run ESLint
```

---

## 🐳 Docker Setup

### Services

```yaml
portal-db:    # MySQL 8.0 on port 3306 (Portal database)
legacy-db:    # MySQL 5.7 on port 3307 (Legacy game database)
redis:        # Redis 7 on port 6379 (Rate limiting & caching)
mailhog:      # Mailhog on ports 1025 (SMTP) & 8025 (Web UI)
```

### Commands

```bash
# Start all services
docker compose up -d

# Check status (all should show "healthy")
docker compose ps

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f portal-db
docker compose logs -f redis
docker compose logs -f mailhog

# Stop all services
docker compose down

# Reset databases (WARNING: deletes all data)
docker compose down -v
```

**See detailed guides:**
- [docs/SETUP_LOCAL_DEV.md](docs/SETUP_LOCAL_DEV.md) - **Recommended** complete local setup
- [docs/SETUP_DOCKER.md](docs/SETUP_DOCKER.md) - Docker infrastructure details
- [docs/SETUP_LEGACY_DB.md](docs/SETUP_LEGACY_DB.md) - Legacy database setup

---

## 📚 Documentation

### User Guides
- [USAGE_GUIDE.md](docs/USAGE_GUIDE.md) - User features and workflows
- [SECURITY_FEATURES.md](docs/SECURITY_FEATURES.md) - Security features guide

### Setup Guides
- [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) - Initial setup
- [SETUP_DOCKER.md](docs/SETUP_DOCKER.md) - Docker configuration
- [SETUP_LEGACY_DB.md](docs/SETUP_LEGACY_DB.md) - Legacy database setup

### Technical Documentation
- [portal_schema.md](docs/portal_schema.md) - Database schema
- [IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) - API endpoints
- [CHANGELOG.md](docs/CHANGELOG.md) - Version history

### Development Logs
- [007_phase3.md](docs/agent_logs/2025-10-03/007_phase3.md) - Phase 3 implementation
- [006_legacy_db.md](docs/agent_logs/2025-10-03/006_legacy_db.md) - Legacy DB integration
- [004_identity_bridge.md](docs/agent_logs/2025-10-03/004_identity_bridge.md) - Identity bridge
- [002_polishing.md](docs/agent_logs/2025-10-03/002_polishing.md) - Polishing phase
- [001_public_website.md](docs/agent_logs/2025-10-03/001_public_website.md) - Public website

---

## 🔜 Next Steps (Phase 4+)

### Frontend Implementation
- [ ] MFA setup/management UI components
- [ ] Password reset request/completion pages
- [ ] Security history display in account page
- [ ] Admin dashboard with Chart.js visualizations
- [ ] MFA verification in login flow

### Infrastructure
- [ ] SMTP email delivery (production)
- [ ] GitHub Actions CI/CD pipeline
- [ ] Database migration automation
- [ ] Redis for session storage
- [ ] Performance monitoring

### Features
- [ ] OAuth providers (Discord, Google, Steam)
- [ ] Hardware security keys (WebAuthn)
- [ ] SMS-based MFA backup
- [ ] Advanced admin analytics
- [ ] API documentation (OpenAPI)

---

## 📊 Project Statistics

- **Backend APIs**: 15+ endpoints
- **Test Coverage**: 20 unit tests, 5 E2E scenarios
- **Documentation**: 50+ KB comprehensive guides
- **Code Quality**: TypeScript strict mode, 100% type coverage
- **Security**: Argon2id, MFA, rate limiting, audit logging

## 🤝 Contributing

This is a private project. For issues or suggestions, contact the development team.

## 📄 License

Proprietary - All rights reserved.

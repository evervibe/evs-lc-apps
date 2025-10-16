# EVS-LC Apps - EverVibe Studios Last Chaos Applications

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./VERSION)
[![License](https://img.shields.io/badge/license-Custom-red.svg)](./LICENSE-CUSTOM)
[![Node](https://img.shields.io/badge/node-20%2B-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-orange.svg)](https://pnpm.io/)

Modern, scalable monorepo for Last Chaos MMORPG web applications and backend services.

## 📁 Project Structure

```
evs-lc-apps/
├── apps/
│   ├── lc_api/              # Backend API System
│   │   ├── api-server/      # NestJS API Application
│   │   ├── docs/            # API Documentation
│   │   ├── scripts/         # Deployment Scripts
│   │   └── package.json
│   └── lc_apps/             # Frontend Applications
│       ├── web-portal/      # Public Player Portal (Next.js)
│       ├── web-admin/       # Admin Dashboard (Next.js)
│       ├── shared/          # Shared UI Components & Utils
│       ├── docs/            # Frontend Documentation
│       └── package.json
├── docs/                    # Central Documentation
├── package.json             # Root Workspace Configuration
├── pnpm-workspace.yaml      # pnpm Workspace Setup
├── turbo.json               # Turbo Build Configuration
├── tsconfig.base.json       # Base TypeScript Config
├── .env.example             # Environment Template
├── LICENSE-CUSTOM           # Commercial License
└── VERSION                  # Current Version (v1.0.0)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20.x or later
- **pnpm**: 10.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/evervibe/evs-lc-apps.git
cd evs-lc-apps

# Install dependencies for all workspaces
pnpm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your settings
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# API will be available at: http://localhost:4000
# Web Portal at: http://localhost:3000
# Web Admin at: http://localhost:3001
```

### Building for Production

```bash
# Build all applications
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 🎯 Core Applications

### 1. Backend API (lc_api)

Modern NestJS-based REST API with PostgreSQL portal database and MySQL game database integration.

**Features:**
- User authentication (JWT + TOTP 2FA)
- Role-based access control (RBAC)
- Support ticket system
- Payment transaction tracking
- Item shop backend
- Vote rewards system
- Code redemption
- News management
- Character/Guild rankings
- Game account creation
- Comprehensive audit logging

**Tech Stack:**
- NestJS 10.3+
- TypeScript 5.3+
- PostgreSQL 16+ with Prisma ORM
- MySQL 8.0+ for game integration
- JWT authentication
- Argon2id password hashing

**Documentation:** [API Documentation](./docs/API_GUIDE.md)

### 2. Web Portal (lc_apps/web-portal)

Public-facing player portal built with Next.js 15 and modern React.

**Features:**
- User registration and login
- Two-factor authentication (2FA)
- User dashboard with account overview
- Cash balance and purchases
- News and announcements
- Item shop
- Character/Guild rankings
- Vote for rewards
- Code redemption
- Support ticket system
- Game downloads

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- React Hook Form
- Zustand state management

**Documentation:** [Frontend Guide](./docs/FRONTEND_GUIDE.md)

### 3. Web Admin (lc_apps/web-admin)

Administrative dashboard for managing the portal and monitoring game servers.

**Features:**
- User management
- Ticket management system
- News editor
- Event planner
- Audit logs viewer
- Statistics dashboard
- System monitoring

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

**Documentation:** [Frontend Guide](./docs/FRONTEND_GUIDE.md)

### 4. Shared Library (lc_apps/shared)

Reusable UI components, hooks, utilities, and type definitions shared across frontend applications.

**Contents:**
- UI components (Button, Card, Dialog, Input, Toast, etc.)
- Custom React hooks
- API client utilities
- TypeScript type definitions
- Theme configuration

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

### Core Guides
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - System design and components
- **[API Guide](./docs/API_GUIDE.md)** - Backend API documentation
- **[Frontend Guide](./docs/FRONTEND_GUIDE.md)** - Frontend architecture and development
- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Environment Reference](./docs/ENV_REFERENCE.md)** - Environment variables guide
- **[Workspace Guide](./docs/WORKSPACE_GUIDE.md)** - Monorepo workspace setup
- **[Security Policy](./docs/SECURITY_POLICY.md)** - Security measures and best practices

### Integration & Migration
- **[LC_WEBSITE_NEXT Integration Master](./docs/LC_WEBSITE_NEXT_INTEGRATION_MASTER.md)** - Complete integration blueprint
- **[Integration Quick Start](./docs/LC_WEBSITE_INTEGRATION_QUICKSTART.md)** - Quick reference guide

### Version History
- **[Changelog](./docs/CHANGELOG.md)** - Version history
- **[Migration Report](./docs/MIGRATION_REPORT_v1.0.0.md)** - v1.0.0 migration details

### Navigation
- **[Documentation Index](./docs/DOCS_INDEX.md)** - Complete documentation navigation

## 🛠️ Development Commands

### Root Level (All Workspaces)

```bash
pnpm dev            # Start all apps in development mode
pnpm build          # Build all applications
pnpm lint           # Run linting across all workspaces
pnpm test           # Run tests across all workspaces
pnpm type-check     # Type check all TypeScript code
pnpm clean          # Clean build artifacts and node_modules
pnpm format         # Format code with Prettier
```

### Backend API (apps/lc_api)

```bash
cd apps/lc_api
pnpm dev            # Start API in development mode
pnpm build          # Build API for production
pnpm start          # Start production build
pnpm test           # Run tests
pnpm lint           # Lint API code
```

### Frontend Apps (apps/lc_apps)

```bash
cd apps/lc_apps
pnpm dev            # Start all frontend apps
pnpm build          # Build all frontend apps
pnpm lint           # Lint frontend code
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch
```

## 🔧 Technology Stack

### Core Technologies
- **Monorepo Management**: pnpm workspaces + Turbo
- **Language**: TypeScript 5.9+
- **Runtime**: Node.js 20+

### Backend
- **Framework**: NestJS 10.3+
- **Portal Database**: PostgreSQL 16+ with Prisma ORM
- **Game Database**: MySQL 8.0+
- **Authentication**: JWT + TOTP (2FA)
- **Password Hashing**: Argon2id
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios

## 🔒 Security

This project implements comprehensive security measures:

- **Password Security**: Argon2id hashing with 64MB memory, 3 iterations
- **Authentication**: JWT tokens with short expiration (15min access, 7d refresh)
- **Two-Factor Authentication**: TOTP support with QR code generation
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Origin whitelist configuration
- **SQL Injection Prevention**: ORM and prepared statements
- **Activity Logging**: Comprehensive audit trail

See [Security Policy](./docs/SECURITY_POLICY.md) for detailed information.

## 🚢 Deployment

### Using Docker

```bash
cd apps/lc_api/api-server
docker-compose up -d
```

### Using PM2

```bash
# API
cd apps/lc_api/api-server
npm run build
pm2 start dist/main.js --name lc-api

# Frontend apps
cd apps/lc_apps/web-portal
pnpm build
pm2 start npm --name lc-portal -- start

cd ../web-admin
pnpm build
pm2 start npm --name lc-admin -- start
```

See [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 Monitoring & Health Checks

### API Health Endpoints

```bash
# Basic health check
curl http://localhost:4000/health

# Version information
curl http://localhost:4000/health/version

# Readiness check
curl http://localhost:4000/health/ready
```

### API Documentation

When the API is running, access interactive documentation at:
- **Swagger UI**: http://localhost:4000/api/docs

## 📄 License

Copyright © 2025 EverVibe Studios / EVS-LC

This project is proprietary software with a custom commercial license. All rights reserved.

**Usage, reproduction, modification, or commercial use is prohibited without express written permission.**

The source code may only be viewed for educational and study purposes. Redistribution or commercial use is strictly forbidden.

See [LICENSE-CUSTOM](./LICENSE-CUSTOM) for full license terms.

## 🤝 Support

- **Documentation**: [/docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/evervibe/evs-lc-apps/issues)
- **Version**: v1.0.0 (Stable)

## 🎯 Project Status

**Current Version**: v1.0.0 (Stable)  
**Last Updated**: 2025-10-16  
**Status**: Production Ready ✅

### Completed Features
- ✅ Complete backend API with dual database support
- ✅ Authentication system with JWT + 2FA
- ✅ User portal with all core features
- ✅ Admin dashboard structure
- ✅ Monorepo workspace configuration
- ✅ Comprehensive documentation
- ✅ Security implementations
- ✅ Production deployment guides

### Roadmap
- [ ] Complete admin dashboard implementation
- [ ] Real-time notifications via WebSocket
- [ ] Progressive Web App (PWA) support
- [ ] Internationalization (i18n)
- [ ] Mobile applications
- [ ] Advanced analytics dashboard
- [ ] Social features (friends, messaging)

## 👥 Credits

**Built with ❤️ by EverVibe Studios**

Powered by:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Turbo](https://turbo.build/) - High-performance build system
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

---

**EVS-LC Apps v1.0.0** - Modern, Secure, Scalable  
🎮 Built for the Last Chaos Community

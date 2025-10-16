# LC API - Backend v2.x

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./VERSION)
[![Node](https://img.shields.io/badge/node-20%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3%2B-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3%2B-red.svg)](https://nestjs.com/)

Modern backend system for Last Chaos with separated Portal (PostgreSQL) and Game Integration (MySQL).

## 🎯 Overview

LC Backend v2.x is a complete rewrite of the Last Chaos web portal backend, featuring:

- **Portal System** - Modern PostgreSQL-based user management, authentication, payments, tickets, and more
- **Game Integration** - Controlled MySQL access to game databases with read queries and stored procedures
- **Security-First** - Argon2id password hashing, JWT tokens, TOTP 2FA, RBAC, and comprehensive audit logging
- **API-Driven** - RESTful API with Swagger documentation, ready for web and mobile clients
- **Production-Ready** - Docker support, health monitoring, comprehensive documentation

## 🚀 Quick Start

```bash
# Navigate to lc_api
cd apps/lc_api

# Install dependencies
npm run install:all

# Configure environment
cp .env.example apps/api-server/.env

# Start services (PostgreSQL, MySQL, Redis)
cd apps/api-server && docker-compose up -d

# Run migrations
npm run prisma:migrate

# Start API
npm run dev

# Access API
open http://localhost:4000/api/docs
```

## 📁 Project Structure

```
├── apps/
│   └── lc_api/
│       ├── apps/
│       │   └── api-server/   # NestJS API application
│       │       ├── src/      # Source code
│       │       ├── prisma/   # Database schema & migrations
│       │       ├── package.json
│       │       ├── tsconfig.json
│       │       └── docker-compose.yml
│       ├── docs/             # Comprehensive documentation
│       ├── scripts/          # Deployment & maintenance scripts
│       ├── .env.example      # Environment template
│       ├── package.json      # Root package.json with monorepo scripts
│       └── tsconfig.json     # Root TypeScript config
├── scripts/                  # Legacy scripts (reference only)
├── VERSION                   # Current version (v1.0.0)
└── README.md                # This file
```

## 📚 Documentation

Comprehensive documentation available in `/apps/lc_api/docs/`:

- **[Architecture Overview](./apps/lc_api/docs/ARCHITECTURE_OVERVIEW.md)** - System design and components
- **[Database Schema](./apps/lc_api/docs/DB_SCHEMA.md)** - Complete database documentation
- **[Security Policy](./apps/lc_api/docs/SECURITY_POLICY.md)** - Security measures and best practices
- **[Deployment Guide](./apps/lc_api/docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Changelog](./apps/lc_api/docs/CHANGELOG.md)** - Version history
- **[Migration Report](./apps/lc_api/docs/MIGRATION_REPORT.md)** - Migration details
- **[Implementation Summary](./apps/lc_api/docs/IMPLEMENTATION_SUMMARY.md)** - High-level delivery checklist
- **[Implementation Report](./apps/lc_api/docs/FINAL_IMPLEMENTATION_REPORT.md)** - Complete project report

## ✨ Features

### Portal System
- ✅ User registration and authentication
- ✅ JWT-based sessions (access + refresh tokens)
- ✅ TOTP 2FA with QR code generation
- ✅ Role-Based Access Control (RBAC)
- ✅ Support ticket system
- ✅ Payment transaction tracking
- ✅ Redeem code system
- ✅ Vote tracking
- ✅ News management
- ✅ Comprehensive audit logging

### Game Integration
- ✅ Character queries (rankings, search)
- ✅ Guild queries
- ✅ Account creation via stored procedures
- ✅ Cash grants via stored procedures
- ✅ Account linking (portal ↔ game)
- ✅ Read-only safety for game database

### Security
- ✅ Argon2id password hashing
- ✅ JWT token authentication
- ✅ TOTP 2FA support
- ✅ Rate limiting
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ Failed login tracking
- ✅ Activity audit log

## 🛠️ Technology Stack

- **Framework:** NestJS 10.3+
- **Language:** TypeScript 5.3+
- **Runtime:** Node.js 20+
- **Portal DB:** PostgreSQL 16+ with Prisma ORM
- **Game DB:** MySQL 8.0+ with mysql2
- **HTTP Server:** Fastify 4.25+
- **Authentication:** JWT + TOTP (otplib)
- **Password Hashing:** Argon2id
- **Documentation:** Swagger/OpenAPI

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/totp/setup` - Setup 2FA
- `POST /auth/totp/verify` - Verify and enable 2FA

### Game Integration
- `POST /game/account/create` - Create game account
- `POST /game/cash/grant` - Grant cash (admin only)
- `GET /game/characters` - Get characters
- `GET /game/guilds` - Get guilds
- `GET /game/rankings/level` - Get level rankings

### Portal Features
- `GET /users/me` - Get user profile
- `POST /tickets` - Create support ticket
- `POST /redeem/claim` - Claim redeem code
- `GET /news` - Get news articles
- `POST /votes` - Register vote

### Health & Monitoring
- `GET /health` - Health check
- `GET /health/ready` - Readiness check
- `GET /health/version` - API version

**Full API Documentation:** http://localhost:4000/api/docs

## 🔧 Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+ (or use Docker)
- MySQL 8.0+ (or use Docker)

### Setup
```bash
# Navigate to lc_api directory
cd apps/lc_api

# Install dependencies
npm run install:all

# Setup environment
cp .env.example apps/api-server/.env
# Edit apps/api-server/.env with your settings

# Start databases
cd apps/api-server && docker-compose up -d && cd ../..

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Available Commands
```bash
npm run dev            # Development mode (watch)
npm run build          # Build for production
npm run start          # Start production build
npm run lint           # Lint code
npm run test           # Run tests
npm run test:cov       # Run tests with coverage
npm run prisma:studio  # Open database GUI
```

## 🚢 Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Using PM2
```bash
npm install
npm run build
pm2 start dist/main.js --name lc-api
```

### Deployment Scripts
```bash
./scripts/migrate.sh   # Run database migrations
./scripts/seed.sh      # Seed initial data
./scripts/deploy.sh    # Complete deployment
```

See [Deployment Guide](./apps/lc_api/docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🏗️ Architecture

```
┌──────────────┐
│ Web Clients  │
│ (Portal/API) │
└──────┬───────┘
       │ HTTPS
       ▼
┌──────────────┐
│   lc_api     │
│ (NestJS/TS)  │
└───┬──────┬───┘
    │      │
    ▼      ▼
┌────────┐ ┌────────┐
│   PG   │ │ MySQL  │
│ Portal │ │  Game  │
└────────┘ └────────┘
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch
```

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:4000/health
curl http://localhost:4000/health/version
```

### Logs
```bash
# PM2
pm2 logs lc-api

# Docker
docker-compose logs -f
```

## 🔒 Security

- All passwords hashed with Argon2id (64MB memory, 3 iterations)
- JWT tokens with short expiration (15min access, 7d refresh)
- TOTP 2FA available for enhanced security
- Rate limiting on all endpoints
- CORS protection with origin whitelist
- SQL injection prevention via ORM and prepared statements
- Comprehensive activity audit logging

See [Security Policy](./apps/lc_api/docs/SECURITY_POLICY.md) for details.

## 📝 Version

**Current Version:** v1.0.0

See [CHANGELOG.md](./apps/lc_api/docs/CHANGELOG.md) for version history.

## 📄 License

Proprietary - See [LICENSE-PROPRIETARY](./LICENSE-PROPRIETARY) for details.

This project is proprietary software. All rights reserved.

- Private use requires written permission
- Commercial use requires individual licensing agreement

## 🤝 Support

- **Documentation:** `/apps/lc_api/docs/`
- **Issues:** GitHub Issues
- **Email:** support@example.com

## 👥 Contributing

This is a proprietary project. Contributions are not accepted at this time.

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [Argon2](https://github.com/ranisalt/node-argon2) - Password hashing
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

---

**LC Backend v2.x** - Modern, Secure, Scalable  
Built with ❤️ for Last Chaos Community

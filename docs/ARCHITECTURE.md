# EVS-LC Apps - Architecture Documentation

**Version:** 1.0.0  
**Last Updated:** 2025-10-16

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Design](#database-design)
6. [Security Architecture](#security-architecture)
7. [Integration Patterns](#integration-patterns)
8. [Deployment Architecture](#deployment-architecture)

## System Overview

EVS-LC Apps is a modern monorepo application for Last Chaos MMORPG, consisting of:

- **Backend API (lc_api)**: NestJS-based REST API server
- **Frontend Apps (lc_apps)**: Next.js-based web applications (portal + admin)
- **Shared Libraries**: Common components, types, and utilities

### High-Level Architecture

```
┌─────────────────┐
│   Web Clients   │
│  (Browser/PWA)  │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────┐
│   Frontend Apps │
│  (Next.js 15)   │
│  - Portal       │
│  - Admin        │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│  Backend API    │
│   (NestJS)      │
└────┬──────┬─────┘
     │      │
     ▼      ▼
┌────────┐ ┌────────┐
│  PG 16 │ │ MySQL 8│
│ Portal │ │  Game  │
└────────┘ └────────┘
```

## Architecture Patterns

### Monorepo Structure

The project uses **pnpm workspaces** and **Turbo** for efficient monorepo management:

- **Workspace Isolation**: Each app is independently buildable
- **Shared Dependencies**: Common packages shared across workspaces
- **Build Orchestration**: Turbo manages build order and caching
- **Development Efficiency**: Parallel development and testing

### Microservices vs Monolith

Current implementation uses a **modular monolith** approach:

- Single API server with feature modules
- Clear module boundaries
- Easy to extract into microservices later
- Simpler deployment and maintenance

## Backend Architecture

### Technology Stack

- **Framework**: NestJS 10.3+ (Node.js 20+)
- **Language**: TypeScript 5.3+
- **HTTP Server**: Fastify 4.25+
- **Portal Database**: PostgreSQL 16+ with Prisma ORM
- **Game Database**: MySQL 8.0+ with mysql2 driver
- **Authentication**: JWT + Passport
- **Password Hashing**: Argon2id
- **2FA**: TOTP (OTP library)
- **Documentation**: Swagger/OpenAPI

### Module Structure

```
api-server/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication & authorization
│   │   ├── users/         # User management
│   │   ├── tickets/       # Support ticket system
│   │   ├── payments/      # Payment tracking
│   │   ├── redeem/        # Redeem code system
│   │   ├── news/          # News management
│   │   ├── votes/         # Vote rewards
│   │   ├── game/          # Game database integration
│   │   ├── health/        # Health checks
│   │   └── prisma/        # Database client
│   ├── connectors/
│   │   └── mysql.connector.ts  # MySQL connection pool
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   └── schema.prisma      # Database schema
└── package.json
```

### Key Design Patterns

#### 1. Dependency Injection
All services use NestJS DI for loose coupling and testability.

#### 2. Repository Pattern
Database operations abstracted through services and Prisma client.

#### 3. Guard Pattern
Authentication and authorization via guards:
- `JwtAuthGuard`: Validates JWT tokens
- `RolesGuard`: Checks user permissions

#### 4. Decorator Pattern
Custom decorators for cleaner code:
- `@CurrentUser()`: Extract user from request
- `@Roles()`: Define required roles

#### 5. Strategy Pattern
Passport strategies for different auth methods.

### Database Architecture

#### Portal Database (PostgreSQL)

**17 Tables** for portal features:

1. **portal_users**: User accounts
2. **portal_user_security**: Security settings (2FA, failed logins)
3. **portal_oauth_providers**: OAuth integrations
4. **portal_game_accounts**: Portal-Game account linking
5. **portal_sessions**: Session management
6. **portal_activity_log**: Audit trail
7. **portal_roles**: RBAC roles
8. **portal_permissions**: RBAC permissions
9. **portal_role_permissions**: Role-Permission mapping
10. **portal_user_roles**: User-Role assignments
11. **portal_news**: News articles
12. **portal_donations**: Donation tracking
13. **portal_payments**: Payment transactions
14. **portal_tickets**: Support tickets
15. **portal_votes**: Vote tracking
16. **portal_redeem_codes**: Redeem code system
17. **portal_market_listings**: Market listings

#### Game Database (MySQL)

**Read-Only Access** to existing Last Chaos databases:
- **db_auth**: Authentication data
- **db_db**: Character and guild data
- **db_data**: Game configuration data
- **db_logs**: Game logs

**Stored Procedures** for write operations:
- `sp_create_game_account`: Create game account
- `sp_add_cash`: Grant cash to account

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios with interceptors

### Application Structure

#### Portal Web (Public-Facing)

```
web-portal/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── news/              # News pages
│   ├── market/            # Item shop
│   ├── rankings/          # Leaderboards
│   ├── vote/              # Vote system
│   ├── redeem/            # Code redemption
│   ├── support/           # Support tickets
│   └── downloads/         # Client downloads
├── components/
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── lib/
│   ├── api.ts           # API client
│   └── utils.ts         # Utilities
└── package.json
```

#### Admin Dashboard

```
web-admin/
├── app/
│   ├── dashboard/        # Overview
│   ├── users/           # User management
│   ├── tickets/         # Ticket management
│   ├── news/            # News editor
│   ├── events/          # Event planner
│   └── redeem/          # Redeem code generator
├── components/
└── lib/
```

#### Shared Library

```
shared/
├── ui/                   # Shared UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── toast.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── usePagination.ts
├── lib/                # Utilities
│   ├── api-client.ts
│   └── utils.ts
└── types/              # TypeScript types
    └── index.ts
```

### Key Design Patterns

#### 1. Server Components (Default)
Next.js 15 uses React Server Components by default for better performance.

#### 2. Client Components
Interactive components marked with `'use client'` directive.

#### 3. API Routes
Server-side API routes for server actions and data fetching.

#### 4. Layout System
Nested layouts for consistent UI structure.

#### 5. Interceptors Pattern
Axios interceptors for JWT token management and error handling.

## Security Architecture

### Authentication Flow

```
1. User Login
   ↓
2. Validate Credentials (Argon2id)
   ↓
3. Generate JWT Tokens
   - Access Token (15min)
   - Refresh Token (7d)
   ↓
4. Return Tokens to Client
   ↓
5. Client Stores in Memory/LocalStorage
   ↓
6. Include Token in API Requests
   ↓
7. Validate Token (JWT Strategy)
   ↓
8. Check Permissions (RBAC)
   ↓
9. Process Request
```

### Two-Factor Authentication (2FA)

1. User enables 2FA
2. Server generates TOTP secret
3. QR code shown to user
4. User scans with authenticator app
5. User verifies code
6. 2FA enabled for account
7. Future logins require TOTP code

### Role-Based Access Control (RBAC)

```
User → User_Roles → Roles → Role_Permissions → Permissions
```

**Roles:**
- `player`: Basic user access
- `moderator`: Ticket management
- `admin`: Full system access

**Permissions:**
- `read:users`, `write:users`
- `read:tickets`, `write:tickets`
- `read:news`, `write:news`
- `grant:cash`, `create:game_account`

### Security Measures

1. **Password Security**
   - Argon2id hashing
   - 64MB memory, 3 iterations
   - Salt per password

2. **Token Security**
   - Short-lived access tokens (15min)
   - Refresh token rotation
   - Token blacklisting (optional)

3. **API Security**
   - Rate limiting (100 req/min)
   - CORS protection
   - SQL injection prevention (ORM)
   - XSS protection (sanitization)

4. **Audit Logging**
   - All important actions logged
   - IP address tracking
   - Timestamp and user ID
   - Action details stored

## Integration Patterns

### Frontend → Backend

**REST API** communication:
- JSON request/response
- JWT authentication
- Error handling
- Request retries

### Backend → Portal DB

**Prisma ORM**:
- Type-safe queries
- Migration system
- Connection pooling
- Transaction support

### Backend → Game DB

**MySQL2 Connector**:
- Connection pooling
- Read-only queries
- Stored procedure execution
- Error handling

## Deployment Architecture

### Development

```
localhost:4000  → API Server
localhost:3000  → Portal Web
localhost:3001  → Admin UI
localhost:5432  → PostgreSQL
localhost:3306  → MySQL
```

### Production

```
┌─────────────────────┐
│    Load Balancer    │
│      (nginx)        │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐    ┌────────┐
│ API 1  │    │ API 2  │
└────────┘    └────────┘
    │
    ▼
┌─────────────────────┐
│  Database Cluster   │
│  PostgreSQL + MySQL │
└─────────────────────┘
```

### Container Architecture

**Docker Compose** setup:
- `api-server`: NestJS API
- `postgres`: Portal database
- `mysql`: Game database
- `redis`: Cache (optional)

### Scaling Strategies

1. **Horizontal Scaling**
   - Multiple API instances
   - Load balancer distribution
   - Shared database

2. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Query optimization

3. **Caching**
   - Redis for frequent queries
   - API response caching
   - Static asset CDN

## Performance Considerations

### Backend

- Connection pooling
- Query optimization
- Caching layer (Redis)
- Async operations
- Batch operations

### Frontend

- Code splitting
- Image optimization
- Static generation
- Server-side rendering
- API response caching

## Monitoring & Observability

### Health Checks

- `GET /health`: Basic health
- `GET /health/ready`: Readiness check
- `GET /health/version`: Version info

### Logging

- Structured logging
- Log levels (error, warn, info, debug)
- Activity audit log in database
- Error tracking (Sentry recommended)

### Metrics (Recommended)

- Request rate
- Response time
- Error rate
- Database query performance
- Active users

## Future Enhancements

1. **Microservices Migration**
   - Extract modules to services
   - Event-driven architecture
   - Message queue (RabbitMQ/Kafka)

2. **Real-time Features**
   - WebSocket support
   - Live notifications
   - Chat system

3. **Caching Layer**
   - Redis integration
   - Cache invalidation
   - Session storage

4. **API Gateway**
   - Rate limiting
   - Request routing
   - API versioning

5. **Mobile Apps**
   - React Native
   - Shared API
   - Push notifications

---

**This architecture is designed to be scalable, maintainable, and secure while providing excellent developer experience and performance.**

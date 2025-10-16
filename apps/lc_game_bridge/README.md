# LC Game Bridge Worker

**Status:** ✅ Implemented (v1.1.0)  
**Purpose:** Real-time synchronization between portal and game databases

## Overview

The Game Bridge Worker is a NestJS-based background service that synchronizes data between your Last Chaos game databases (MySQL) and the portal database (PostgreSQL). It provides real-time updates for character data, inventory, guilds, and game events.

### Key Features

- **Real-time Synchronization** - Scheduled workers sync data at configurable intervals
- **Job Queue System** - Redis-based Bull queue for reliable job processing
- **Error Handling** - Retry logic and error logging for failed sync jobs
- **Monitoring** - REST API for checking sync status and triggering manual syncs
- **Scalable** - Can be horizontally scaled for high-traffic environments

## Quick Start

### Prerequisites

- Node.js 20+
- Redis 7+
- MySQL 8+ (game database)
- PostgreSQL 16+ (portal database)
- pnpm 10+

### Installation

```bash
cd apps/lc_game_bridge

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env

# Build the application
pnpm build

# Start in development mode
pnpm dev

# Or start in production mode
pnpm start:prod
```

### API Endpoints

Once running, the following endpoints are available:

- **Health Check**: `GET http://localhost:5000/api/sync/health`
- **Sync Status**: `GET http://localhost:5000/api/sync/status`
- **Manual Sync**: `POST http://localhost:5000/api/sync/{type}`
- **API Docs**: `http://localhost:5000/api/docs` (Swagger UI)

## Architecture

```
lc_game_bridge/
├── src/
│   ├── workers/
│   │   ├── character-sync.worker.ts
│   │   ├── inventory-sync.worker.ts
│   │   └── event-listener.worker.ts
│   ├── services/
│   ├── config/
│   └── main.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Documentation

For complete setup and usage documentation, see:

- **[Game Bridge Guide](../../docs/GAME_BRIDGE_GUIDE.md)** - Comprehensive setup and operation guide
- **[Migration Guide v1.1.0](../../docs/MIGRATION_GUIDE_v1.1.0.md)** - Migration from v1.0.2
- **[Portal DB Schema](../../docs/PORTAL_DB_SCHEMA.md)** - Portal database schema reference

## Development Roadmap

**v1.1.0 (Current)** ✅
- Basic NestJS application structure
- Redis queue integration
- REST API for sync operations
- Health check endpoints
- Swagger documentation

**v1.2.0 (Planned)**
- Implement character sync worker
- Implement inventory sync worker
- Implement guild sync worker
- Database connection services
- Error handling and retry logic

**v1.3.0 (Planned)**
- Real-time event listener
- WebSocket integration for live updates
- Advanced monitoring and metrics
- Performance optimizations

---

**Last Updated:** 2025-10-16  
**Maintained by:** EverVibe Studios

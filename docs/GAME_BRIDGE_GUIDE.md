# Game Bridge Worker Guide

**Version:** 1.1.0  
**Purpose:** Real-time synchronization between game databases (MySQL) and portal database (PostgreSQL)  
**Last Updated:** 2025-10-16

---

## Overview

The Game Bridge Worker is a NestJS-based background service that synchronizes data between your Last Chaos game databases (MySQL) and the portal database (PostgreSQL). It provides real-time updates for character data, inventory, guilds, and game events.

### Key Features

- **Real-time Synchronization** - Scheduled workers sync data at configurable intervals
- **Job Queue System** - Redis-based Bull queue for reliable job processing
- **Error Handling** - Retry logic and error logging for failed sync jobs
- **Monitoring** - REST API for checking sync status and triggering manual syncs
- **Scalable** - Can be horizontally scaled for high-traffic environments

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Game Bridge Worker                      │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐ │
│  │   Character  │    │  Inventory   │    │  Guild   │ │
│  │    Sync      │    │     Sync     │    │   Sync   │ │
│  │   Worker     │    │    Worker    │    │  Worker  │ │
│  └──────┬───────┘    └──────┬───────┘    └─────┬────┘ │
│         │                    │                   │      │
│         └────────────────────┴───────────────────┘      │
│                              │                          │
│                    ┌─────────▼──────────┐               │
│                    │   Sync Coordinator │               │
│                    │      Service       │               │
│                    └─────────┬──────────┘               │
│                              │                          │
│         ┌────────────────────┴────────────────┐        │
│         │                                      │        │
│    ┌────▼────┐                           ┌────▼─────┐ │
│    │  Game   │                           │  Portal  │ │
│    │   DB    │                           │    DB    │ │
│    │ (MySQL) │                           │(Postgres)│ │
│    └─────────┘                           └──────────┘ │
│                                                         │
│                    ┌──────────────┐                    │
│                    │    Redis     │                    │
│                    │  Job Queue   │                    │
│                    └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Scheduled Jobs** - Cron triggers create sync jobs
2. **Job Queue** - Redis Bull queue manages job execution
3. **Worker Processing** - Workers fetch data from MySQL game DBs
4. **Data Transformation** - Convert game data to portal format
5. **Portal Update** - Write transformed data to PostgreSQL
6. **Status Tracking** - Update GameSyncStatus table
7. **Event Emission** - Publish events via Redis pub/sub

---

## Installation

### Prerequisites

- Node.js 20+
- Redis 7+
- MySQL 8+ (game database)
- PostgreSQL 16+ (portal database)
- pnpm 10+

### Setup Steps

#### 1. Install Dependencies

```bash
cd apps/lc_game_bridge
pnpm install
```

#### 2. Configure Environment

Create `.env` file:

```env
# Node Environment
NODE_ENV=production
PORT=5000

# PostgreSQL Portal Database
PORTAL_DATABASE_URL=postgresql://lcuser:lcpass@localhost:5432/lc_portal

# MySQL Game Databases
GAME_DB_HOST=localhost
GAME_DB_PORT=3306
GAME_DB_USER=lcgame
GAME_DB_PASSWORD=lcgamepass
GAME_DB_AUTH=lc_auth      # Auth database name
GAME_DB_DATA=lc_data      # Data database name
GAME_DB_LOGS=lc_logs      # Logs database name

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Sync Configuration
SYNC_INTERVAL_CHARACTER=300000    # 5 minutes (ms)
SYNC_INTERVAL_INVENTORY=600000    # 10 minutes (ms)
SYNC_INTERVAL_GUILD=900000        # 15 minutes (ms)
SYNC_BATCH_SIZE=100               # Records per batch

# Job Queue Settings
QUEUE_CONCURRENCY=5               # Concurrent jobs
QUEUE_RETRY_ATTEMPTS=3            # Retry failed jobs
QUEUE_RETRY_DELAY=60000           # 1 minute (ms)

# Logging
LOG_LEVEL=info                    # debug, info, warn, error
LOG_TO_FILE=true
LOG_FILE_PATH=/var/log/game-bridge/

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=5001
```

#### 3. Build Application

```bash
pnpm build
```

#### 4. Start Worker

**Development:**
```bash
pnpm dev
```

**Production:**
```bash
pnpm start:prod
```

**With PM2:**
```bash
pm2 start dist/main.js --name game-bridge
pm2 save
```

**With Docker:**
```bash
docker build -t evs-game-bridge .
docker run -d \
  --name game-bridge \
  --env-file .env \
  -p 5000:5000 \
  evs-game-bridge
```

---

## Configuration

### Sync Intervals

Configure how often each sync type runs:

```env
# Character sync every 5 minutes
SYNC_INTERVAL_CHARACTER=300000

# Inventory sync every 10 minutes
SYNC_INTERVAL_INVENTORY=600000

# Guild sync every 15 minutes
SYNC_INTERVAL_GUILD=900000

# Event listener (real-time)
SYNC_INTERVAL_EVENTS=0  # 0 = real-time listening
```

### Database Connections

**MySQL Connection Pool:**
```env
GAME_DB_CONNECTION_LIMIT=10       # Max connections
GAME_DB_QUEUE_LIMIT=0            # Queue limit (0 = unlimited)
GAME_DB_WAIT_FOR_CONNECTIONS=true
```

**PostgreSQL Connection:**
```env
PORTAL_DATABASE_URL=postgresql://user:pass@host:port/db?schema=public&connection_limit=10
```

### Performance Tuning

**Batch Processing:**
```env
SYNC_BATCH_SIZE=100              # Process 100 records at a time
SYNC_PARALLEL_BATCHES=3          # Process 3 batches in parallel
```

**Memory Management:**
```env
NODE_OPTIONS="--max-old-space-size=2048"  # 2GB heap limit
```

---

## Workers

### Character Sync Worker

**Purpose:** Synchronizes character data from game DB to portal.

**Synced Data:**
- Character name, level, class
- Experience points
- Last login time
- Online status

**Sync Logic:**
```typescript
@Injectable()
export class CharacterSyncWorker {
  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncCharacters() {
    const characters = await this.gameDbService.getCharacters();
    
    for (const character of characters) {
      const portalData = this.transformCharacter(character);
      await this.portalDbService.upsertCharacter(portalData);
    }
    
    await this.updateSyncStatus('character', 'success', characters.length);
  }
}
```

**Manual Trigger:**
```bash
curl -X POST http://localhost:5000/api/sync/character
```

### Inventory Sync Worker

**Purpose:** Synchronizes player inventories.

**Synced Data:**
- Item ID and quantity
- Item enhancements
- Storage location (inventory/warehouse)

**Sync Frequency:** Every 10 minutes (configurable)

**Manual Trigger:**
```bash
curl -X POST http://localhost:5000/api/sync/inventory
```

### Guild Sync Worker

**Purpose:** Synchronizes guild information.

**Synced Data:**
- Guild name and members
- Guild level and experience
- Guild warehouse items
- Guild rankings

**Sync Frequency:** Every 15 minutes (configurable)

**Manual Trigger:**
```bash
curl -X POST http://localhost:5000/api/sync/guild
```

### Event Listener Worker

**Purpose:** Listens for real-time game events.

**Events Tracked:**
- Player login/logout
- Level up events
- Item acquisitions
- Guild events
- PvP/Castle siege events

**Implementation:**
```typescript
@Injectable()
export class EventListenerWorker implements OnModuleInit {
  async onModuleInit() {
    // Start listening to game event tables
    this.startEventPolling();
  }
  
  private async startEventPolling() {
    setInterval(async () => {
      const events = await this.gameDbService.getNewEvents();
      for (const event of events) {
        await this.processEvent(event);
      }
    }, 5000); // Check every 5 seconds
  }
}
```

---

## API Endpoints

The Game Bridge Worker exposes a REST API for monitoring and control.

### Health Check

**GET** `/health`

Returns worker health status.

**Response:**
```json
{
  "status": "ok",
  "uptime": 3600,
  "redis": "connected",
  "gameDb": "connected",
  "portalDb": "connected"
}
```

### Sync Status

**GET** `/api/sync/status`

Returns current sync status for all workers.

**Response:**
```json
{
  "character": {
    "lastSyncAt": "2025-10-16T19:00:00Z",
    "status": "success",
    "recordsProcessed": 1234,
    "nextSyncIn": 180
  },
  "inventory": {
    "lastSyncAt": "2025-10-16T19:05:00Z",
    "status": "success",
    "recordsProcessed": 5678,
    "nextSyncIn": 420
  },
  "guild": {
    "lastSyncAt": "2025-10-16T19:10:00Z",
    "status": "success",
    "recordsProcessed": 89,
    "nextSyncIn": 540
  }
}
```

### Manual Sync Trigger

**POST** `/api/sync/{type}`

Manually trigger a sync job.

**Parameters:**
- `type` - Sync type: `character`, `inventory`, `guild`, or `all`

**Example:**
```bash
curl -X POST http://localhost:5000/api/sync/character

# Trigger all syncs
curl -X POST http://localhost:5000/api/sync/all
```

**Response:**
```json
{
  "message": "Sync job queued successfully",
  "jobId": "uuid-job-id",
  "type": "character"
}
```

### Job Queue Stats

**GET** `/api/queue/stats`

Returns job queue statistics.

**Response:**
```json
{
  "waiting": 5,
  "active": 2,
  "completed": 1234,
  "failed": 12,
  "delayed": 0,
  "paused": 0
}
```

---

## Monitoring

### Logs

**Log Levels:**
- `debug` - Detailed debugging information
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages

**Log Locations:**
- Console (stdout/stderr)
- File: `/var/log/game-bridge/app.log` (if enabled)

**View Logs:**
```bash
# PM2
pm2 logs game-bridge

# Docker
docker logs -f game-bridge

# File
tail -f /var/log/game-bridge/app.log
```

### Metrics

**Prometheus Metrics Endpoint:**

**GET** `/metrics`

**Available Metrics:**
- `game_bridge_sync_duration_seconds` - Sync operation duration
- `game_bridge_sync_records_total` - Total records processed
- `game_bridge_sync_errors_total` - Total sync errors
- `game_bridge_queue_jobs_total` - Total queued jobs
- `game_bridge_db_queries_total` - Total database queries

**Example:**
```prometheus
# TYPE game_bridge_sync_duration_seconds histogram
game_bridge_sync_duration_seconds_bucket{type="character",le="1"} 45
game_bridge_sync_duration_seconds_bucket{type="character",le="5"} 98
game_bridge_sync_duration_seconds_sum{type="character"} 234.5
game_bridge_sync_duration_seconds_count{type="character"} 100
```

### Grafana Dashboard

Import the provided Grafana dashboard:

**File:** `infra/grafana/game-bridge-dashboard.json`

**Panels:**
- Sync duration over time
- Records processed per sync
- Error rate
- Queue depth
- Database connection pool usage

---

## Troubleshooting

### Common Issues

#### Issue 1: Worker Not Starting

**Symptom:** Worker crashes on startup.

**Possible Causes:**
- Redis not running
- Database connection failed
- Invalid environment variables

**Solution:**
```bash
# Check Redis
redis-cli ping

# Check database connections
telnet localhost 3306  # MySQL
telnet localhost 5432  # PostgreSQL

# Validate .env
cat .env | grep -E "^[^#]"
```

#### Issue 2: Sync Jobs Failing

**Symptom:** Sync status shows "failed" status.

**Solution:**
```bash
# Check logs for errors
pm2 logs game-bridge --lines 100

# Check job queue
curl http://localhost:5000/api/queue/stats

# Clear failed jobs
curl -X POST http://localhost:5000/api/queue/clean/failed
```

#### Issue 3: High Memory Usage

**Symptom:** Worker consuming too much memory.

**Solution:**
```env
# Reduce batch size
SYNC_BATCH_SIZE=50

# Reduce concurrency
QUEUE_CONCURRENCY=3

# Increase Node heap limit
NODE_OPTIONS="--max-old-space-size=4096"
```

#### Issue 4: Slow Sync Performance

**Symptom:** Syncs taking too long to complete.

**Solution:**
```env
# Increase parallel batches
SYNC_PARALLEL_BATCHES=5

# Optimize database queries
GAME_DB_CONNECTION_LIMIT=20

# Reduce sync frequency for non-critical data
SYNC_INTERVAL_GUILD=1800000  # 30 minutes
```

---

## Development

### Project Structure

```
apps/lc_game_bridge/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── config/
│   │   ├── database.config.ts     # Database configuration
│   │   ├── redis.config.ts        # Redis configuration
│   │   └── env.validation.ts      # Environment validation (Zod)
│   ├── workers/
│   │   ├── character-sync.worker.ts
│   │   ├── inventory-sync.worker.ts
│   │   ├── guild-sync.worker.ts
│   │   └── event-listener.worker.ts
│   ├── services/
│   │   ├── game-db.service.ts     # MySQL game DB service
│   │   ├── portal-db.service.ts   # PostgreSQL portal DB service
│   │   ├── redis-pub.service.ts   # Redis pub/sub service
│   │   └── sync-coordinator.service.ts
│   ├── controllers/
│   │   └── sync.controller.ts     # REST API controller
│   ├── dto/
│   │   └── sync-events.dto.ts     # Data transfer objects
│   └── interfaces/
│       └── sync.interface.ts      # TypeScript interfaces
├── test/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Adding New Sync Worker

1. Create worker file in `src/workers/`
2. Implement `@Cron()` decorator for scheduling
3. Add to `AppModule` providers
4. Create corresponding API endpoint
5. Add tests
6. Update documentation

**Example:**
```typescript
// src/workers/achievement-sync.worker.ts

@Injectable()
export class AchievementSyncWorker {
  constructor(
    private gameDb: GameDbService,
    private portalDb: PortalDbService,
    private syncCoordinator: SyncCoordinatorService
  ) {}
  
  @Cron('0 */30 * * * *') // Every 30 minutes
  async syncAchievements() {
    try {
      const achievements = await this.gameDb.getAchievements();
      
      for (const achievement of achievements) {
        await this.portalDb.upsertAchievement(achievement);
      }
      
      await this.syncCoordinator.updateStatus({
        type: 'achievement',
        status: 'success',
        recordsProcessed: achievements.length
      });
    } catch (error) {
      await this.syncCoordinator.updateStatus({
        type: 'achievement',
        status: 'failed',
        errors: error.message
      });
    }
  }
}
```

---

## Security

### Best Practices

1. **Least Privilege** - Use read-only MySQL user for game DB
2. **Secure Credentials** - Store in environment variables, never in code
3. **Network Security** - Use VPN or SSH tunnels for DB connections
4. **Rate Limiting** - Prevent excessive sync jobs
5. **Input Validation** - Validate all data from game DB before inserting

### Database Permissions

**MySQL (Game DB):**
```sql
-- Create read-only user for sync
CREATE USER 'game_bridge'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON lc_auth.* TO 'game_bridge'@'%';
GRANT SELECT ON lc_data.* TO 'game_bridge'@'%';
GRANT SELECT ON lc_logs.* TO 'game_bridge'@'%';
FLUSH PRIVILEGES;
```

**PostgreSQL (Portal DB):**
```sql
-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO game_bridge;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO game_bridge;
```

---

## Performance Optimization

### Database Indexing

Ensure proper indexes on game DB tables:

```sql
-- MySQL (game DB)
CREATE INDEX idx_characters_last_login ON lc_data.characters(last_login);
CREATE INDEX idx_inventory_updated ON lc_data.inventory(updated_at);
CREATE INDEX idx_guild_sync ON lc_data.guilds(last_modified);
```

### Connection Pooling

```typescript
// config/database.config.ts
export const gameDbConfig = {
  host: process.env.GAME_DB_HOST,
  port: parseInt(process.env.GAME_DB_PORT),
  user: process.env.GAME_DB_USER,
  password: process.env.GAME_DB_PASSWORD,
  connectionLimit: 10,        // Max connections
  queueLimit: 0,              // Unlimited queue
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};
```

### Caching

Use Redis for caching frequently accessed data:

```typescript
async getCharacter(id: string) {
  // Check cache first
  const cached = await this.redis.get(`character:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Fetch from DB
  const character = await this.gameDb.findCharacter(id);
  
  // Cache for 5 minutes
  await this.redis.setex(`character:${id}`, 300, JSON.stringify(character));
  
  return character;
}
```

---

## Scaling

### Horizontal Scaling

Run multiple worker instances:

```bash
# Instance 1 - Character sync only
WORKER_TYPE=character pnpm start:prod

# Instance 2 - Inventory sync only
WORKER_TYPE=inventory pnpm start:prod

# Instance 3 - Guild sync only
WORKER_TYPE=guild pnpm start:prod
```

### Load Balancing

Use Redis for distributed locking:

```typescript
async acquireLock(key: string): Promise<boolean> {
  const lock = await this.redis.set(
    `lock:${key}`,
    'locked',
    'EX', 60,      // 60 seconds expiry
    'NX'           // Only if not exists
  );
  return lock === 'OK';
}
```

---

## Appendix

### Environment Variables Reference

See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete reference.

### Related Documentation

- [PORTAL_DB_SCHEMA.md](./PORTAL_DB_SCHEMA.md) - Portal database schema
- [MIGRATION_GUIDE_v1.1.0.md](./MIGRATION_GUIDE_v1.1.0.md) - Migration guide
- [API_GUIDE.md](./API_GUIDE.md) - API documentation

---

**Maintained by:** EverVibe Studios  
**Version:** 1.1.0  
**Last Updated:** 2025-10-16

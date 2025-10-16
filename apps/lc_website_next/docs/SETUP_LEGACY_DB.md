# Legacy Database Docker Setup Guide

This guide explains how to set up and use the Legacy Game Database Docker container for local development.

---

## Overview

The Legacy Database Docker service provides a MySQL 5.7 environment that:
- Runs on port **3307** (to avoid conflicts with the Portal DB on 3306)
- Automatically imports SQL dumps from `../live_db/` directory
- Provides **read-only** access for game account verification
- Uses a separate data volume for persistence

---

## Prerequisites

1. Docker and Docker Compose installed
2. SQL dumps available (see "SQL Dump Location" below)
3. Portal database already configured (see `SETUP_DOCKER.md`)

---

## SQL Dump Location

SQL dumps should be placed in the `live_db/` directory **one level above** the `lc_website_next/` directory:

```
lc_website_old/
├── live_db/              # ← SQL dumps go here
│   ├── db_db.sql        # Game data (characters, guilds, etc.)
│   ├── db_data.sql      # Static data (items, skills, etc.)
│   └── db_auth.sql      # Account data (user accounts)
└── lc_website_next/
    ├── docker-compose.yml
    └── ...
```

### Important Notes:

- **The `live_db/` directory is protected by `.gitignore`** and will NOT be committed to the repository
- SQL dumps are loaded automatically when the container starts for the first time
- Files must have `.sql` extension to be recognized by MySQL's init process
- Dumps are loaded in alphabetical order

### Creating the Directory:

```bash
# From the repository root
cd /home/runner/work/lc_website_old/lc_website_old
mkdir -p live_db
```

---

## Configuration

### 1. Environment Variables

The `.env.example` file includes the default configuration for the Legacy Docker database:

```env
# MySQL Configuration for Docker Containers
LEGACY_MYSQL_ROOT_PASSWORD=your_secure_legacy_root_password
LEGACY_MYSQL_PASSWORD=readonly_pass

# Server 1 - Legacy Local Docker
GAME_DB1_HOST="localhost"
GAME_DB1_PORT="3307"
GAME_DB1_DATABASE="lc_game"
GAME_DB1_USER="readonly_user"
GAME_DB1_PASSWORD="readonly_pass"
GAME_DB1_LABEL="Legacy Local Docker"
```

Copy these to your `.env` file:

```bash
cp .env.example .env
# Edit .env with your actual passwords
```

### 2. Docker Compose Service

The `docker-compose.yml` includes the `legacy-db` service:

```yaml
legacy-db:
  image: mysql:5.7
  container_name: lc_legacy_db
  ports:
    - "3307:3306"
  volumes:
    - ../live_db:/docker-entrypoint-initdb.d:ro
```

---

## Starting the Services

### Start Both Databases (Portal + Legacy)

```bash
docker-compose up -d
```

This will:
- Start the Portal database on port 3306
- Start the Legacy database on port 3307
- Import SQL dumps from `../live_db/` (if present)

### Check Service Status

```bash
docker-compose ps
```

You should see both `lc_portal_db` and `lc_legacy_db` with status "Up".

### View Logs

```bash
# View all logs
docker-compose logs

# View only legacy-db logs
docker-compose logs legacy-db

# Follow logs in real-time
docker-compose logs -f legacy-db
```

---

## Testing the Connection

### 1. Direct MySQL Connection

Connect to the legacy database directly:

```bash
docker exec -it lc_legacy_db mysql -u readonly_user -p lc_game
```

Enter the password: `readonly_pass`

### 2. Test Query

Once connected, verify data was imported:

```sql
-- Check databases
SHOW DATABASES;

-- Use the game database
USE lc_game;

-- Check tables
SHOW TABLES;

-- Count accounts (example)
SELECT COUNT(*) FROM bg_user;

-- Exit
EXIT;
```

### 3. Test via Portal API

Once the portal is running, you can test the connection via the API:

```bash
# Start the portal
pnpm dev

# In another terminal, test the servers endpoint
curl http://localhost:3000/api/servers
```

The legacy database should appear in the list (if configured via environment variables).

---

## Troubleshooting

### Legacy DB Container Won't Start

**Check logs:**
```bash
docker-compose logs legacy-db
```

**Common issues:**
- Port 3307 already in use → Change the port in `docker-compose.yml`
- SQL dump errors → Check dump file syntax and compatibility with MySQL 5.7

### SQL Dumps Not Loading

**Verify dump location:**
```bash
# From lc_website_next directory
ls -la ../live_db/
```

**Check mount:**
```bash
docker exec lc_legacy_db ls -la /docker-entrypoint-initdb.d/
```

**Note:** Dumps are only loaded on first container creation. To reimport:

```bash
# Stop and remove the container AND its volume
docker-compose down -v

# Restart (this will reimport dumps)
docker-compose up -d
```

### Read-Only User Can't Access Tables

**Check user grants:**
```bash
docker exec -it lc_legacy_db mysql -u root -p
```

```sql
-- Grant read-only access to all tables
GRANT SELECT ON lc_game.* TO 'readonly_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### Connection Refused from Portal

**Verify connection settings in `.env`:**
- Host should be `localhost` (not `127.0.0.1`)
- Port should be `3307`
- User should be `readonly_user`
- Password should match `LEGACY_MYSQL_PASSWORD`

**Test connection:**
```bash
docker exec lc_portal_db mysql -h host.docker.internal -P 3307 -u readonly_user -p lc_game
```

---

## Maintenance

### Stop Legacy Database Only

```bash
docker-compose stop legacy-db
```

### Start Legacy Database Only

```bash
docker-compose start legacy-db
```

### Restart Legacy Database

```bash
docker-compose restart legacy-db
```

### Remove Legacy Database (Keep Data)

```bash
docker-compose stop legacy-db
docker-compose rm legacy-db
```

### Remove Legacy Database (Delete All Data)

⚠️ **WARNING:** This will delete all imported data!

```bash
docker-compose down -v
```

---

## Security Notes

### Read-Only Access

The `readonly_user` is configured for **SELECT-only** operations:
- No INSERT, UPDATE, or DELETE allowed
- No CREATE, DROP, or ALTER allowed
- Runtime validation in `src/lib/legacy-db.ts` ensures only SELECT queries

### Password Security

- Never commit `.env` file with real passwords
- Use strong passwords for production environments
- Rotate passwords regularly

### Network Isolation

For production:
- Do NOT expose port 3307 publicly
- Use Docker networks to isolate services
- Consider VPN or SSH tunnels for remote access

---

## Integration with Portal

### Game Account Linking

The portal uses the legacy database to verify game account credentials:

1. User submits game username/password via `/api/game/link`
2. Portal queries `bg_user` table in legacy database
3. Password is verified using legacy hash algorithm (MD5/SHA256)
4. If valid, account link is created in portal database

### Health Checks

The `/api/servers` endpoint performs health checks on all configured game servers, including the legacy Docker database.

---

## Next Steps

1. **Configure Game Servers:** Add the legacy database as a game server via the Admin panel or API
2. **Test Account Linking:** Try linking a game account through the portal UI
3. **Monitor Logs:** Check for any connection issues or errors

---

## Related Documentation

- [Docker Setup Guide](./SETUP_DOCKER.md) - Portal database setup
- [Usage Guide](./USAGE_GUIDE.md) - Portal features and workflows
- [Portal Schema](./portal_schema.md) - Database schema documentation

---

**Last Updated:** 2025-10-03

# Development Scripts

Helper scripts for local development and database management.

---

## 📋 Available Scripts

### `init-db.sh`

Initializes the portal database schema without requiring Prisma CLI.

**Usage:**
```bash
bash scripts/init-db.sh
```

**What it does:**
- Waits for the portal-db container to be ready
- Creates all database tables (users, sessions, etc.)
- Adds foreign key constraints
- Safe to run multiple times (uses `CREATE TABLE IF NOT EXISTS`)

**Requirements:**
- Docker Compose must be running (`docker compose up -d`)
- portal-db container must be accessible

**Environment Variables:**
- `MYSQL_ROOT_PASSWORD` - Root password (default: `change_this_root_password`)

---

### `seed-db.js`

Seeds the database with test data for local development.

**Usage:**
```bash
node scripts/seed-db.js
```

**What it creates:**
- Admin user: `admin@example.com` / `admin123`
- Normal user: `user@example.com` / `user123`
- Game server: Legacy Local Docker (connects to localhost:3307)

**Environment Variables:**
- `DB_HOST` - Database host (default: `localhost`)
- `DB_PORT` - Database port (default: `3306`)
- `DB_USER` - Database user (default: `root`)
- `DB_PASSWORD` - Database password (default: `change_this_root_password`)
- `DB_NAME` - Database name (default: `portal_db`)

**Features:**
- Idempotent - safe to run multiple times
- Skips existing users/servers
- Uses Argon2id for password hashing
- Works without Prisma CLI

---

## 🚀 Quick Setup

Complete database setup in restricted environments:

```bash
# 1. Start Docker services
docker compose up -d

# 2. Initialize schema
bash scripts/init-db.sh

# 3. Seed test data
node scripts/seed-db.js

# 4. Start development server
pnpm dev
```

---

## 🔧 Troubleshooting

### "portal-db container is not running"

Start Docker Compose:
```bash
docker compose up -d
```

### "Database failed to start after 30 seconds"

Check container logs:
```bash
docker compose logs portal-db
```

Restart the container:
```bash
docker compose restart portal-db
```

### "Access denied for user"

Ensure you're using the correct password. Check your `.env` file or use defaults:
- Root password: `change_this_root_password`
- Portal user password: `change_this_password`

### "Cannot find module 'mysql2/promise'"

Install dependencies:
```bash
pnpm install
```

---

## 📝 Notes

- These scripts are designed to work in **restricted network environments** where Prisma CLI cannot download binaries
- They use direct MySQL connections via `mysql2` and `@node-rs/argon2`
- Schema is kept in sync with `prisma/schema.prisma` manually
- For production, use proper Prisma migrations: `pnpm prisma migrate deploy`

---

## 🔗 Related Documentation

- [Local Development Setup](../docs/SETUP_LOCAL_DEV.md)
- [Docker Setup](../docs/SETUP_DOCKER.md)
- [Database Schema](../docs/portal_schema.md)

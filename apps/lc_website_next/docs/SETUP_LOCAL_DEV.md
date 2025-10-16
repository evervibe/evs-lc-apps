# Local Development Setup Guide

Complete guide for setting up the LC Portal development environment in VS Code.

---

## 🎯 Goal

Get the project running locally with **one command**: `docker compose up`, followed by migrations, seeding, and `pnpm dev`. Everything should work immediately with test data.

---

## 📋 Prerequisites

- **Docker Desktop** (with Docker Compose)
- **Node.js** v20+ and **pnpm**
- **VS Code** (recommended)
- **Git**

---

## 🚀 Quick Start

### 1. Clone Repository & Navigate

```bash
git clone <repository-url>
cd lc_website_old/lc_website_next
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

The `.env.example` file contains sensible defaults for local development. You can use it as-is, or customize:

```env
# Portal Database
DATABASE_URL="mysql://portal_user:portal_user_pw@localhost:3306/portal_db"

# Redis (Rate Limiting)
REDIS_URL="redis://localhost:6379"

# Mailhog (SMTP Testing)
SMTP_HOST="localhost"
SMTP_PORT=1025

# Auth.js
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="super-secret-auth-key-change-this-in-production"

# Admin API Protection
ADMIN_TOKEN="super-secret-admin-token"
```

### 3. Start Docker Services

```bash
docker compose up -d
```

This starts:
- **portal-db** (MySQL 8.0) on port `3306`
- **legacy-db** (MySQL 5.7) on port `3307`
- **redis** on port `6379`
- **mailhog** on ports `1025` (SMTP) and `8025` (Web UI)

**Verify all services are running:**

```bash
docker compose ps
```

All containers should show status "Up (healthy)".

**Wait for databases to initialize** (first time only):

```bash
# Check portal-db logs - wait for "ready for connections"
docker compose logs portal-db | grep "ready for connections"

# Should see: /usr/sbin/mysqld: ready for connections
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Initialize Database Schema

**Option A: Using Prisma CLI** (requires internet access for first-time setup)

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

**Option B: Using initialization script** (works in restricted environments)

```bash
pnpm db:init
# or: bash scripts/init-db.sh
```

This creates all database tables in the portal database.

### 6. Seed Test Data

**Option A: Using Prisma CLI**

```bash
pnpm prisma db seed
```

**Option B: Using npm script** (works in restricted environments)

```bash
pnpm db:seed
# or: node scripts/seed-db.js
```

This creates:
- **Admin User**: `admin@example.com` / `admin123`
- **Normal User**: `user@example.com` / `user123`
- **GameServer**: Legacy Local Docker connection

### 7. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Development Tools

### Mailhog - Email Testing

**Web UI**: [http://localhost:8025](http://localhost:8025)

- Captures all emails sent by the application
- No real emails are sent
- Perfect for testing password reset flows

**Test password reset:**
1. Go to password reset page
2. Enter your test email (e.g., `user@example.com`)
3. Check Mailhog UI for the reset email
4. Click the reset link

### Prisma Studio - Database GUI

```bash
pnpm prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555)

- Browse all tables
- Edit data directly
- View relationships

### Redis CLI

```bash
docker exec -it lc_redis redis-cli
```

Useful commands:
```redis
KEYS *           # List all keys
GET key_name     # Get value
FLUSHALL         # Clear everything (use with caution!)
```

---

## 🧪 Testing

### Run Unit Tests

```bash
pnpm test
```

### Run E2E Tests

```bash
pnpm test:e2e
```

Make sure the development server is running on port 3000.

### Run Tests with UI

```bash
pnpm test:ui        # Unit tests with Vitest UI
pnpm test:e2e:ui    # E2E tests with Playwright UI
```

---

## 🗄️ Database Management

### Connect to Portal Database

```bash
docker exec -it lc_portal_db mysql -u portal_user -pportal_user_pw portal_db
```

### Connect to Legacy Database

```bash
docker exec -it lc_legacy_db mysql -u readonly_user -preadonly_pass lc_game
```

### Reset Database

If you need to start fresh:

```bash
# Stop containers and remove volumes
docker compose down -v

# Start fresh
docker compose up -d

# Re-run migrations and seed
pnpm prisma migrate dev
pnpm prisma db seed
```

### View Migration History

```bash
pnpm prisma migrate status
```

---

## 📚 Documentation

- **API Documentation**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Security Features**: `docs/SECURITY_FEATURES.md`
- **User Guide**: `docs/USAGE_GUIDE.md`
- **Docker Setup**: `docs/SETUP_DOCKER.md`
- **Legacy DB Setup**: `docs/SETUP_LEGACY_DB.md`
- **Database Schema**: `docs/portal_schema.md`

---

## 🐛 Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using the port
lsof -i :3306   # Portal DB
lsof -i :3307   # Legacy DB
lsof -i :6379   # Redis
lsof -i :1025   # Mailhog SMTP
lsof -i :8025   # Mailhog Web UI

# Stop the conflicting service or change the port in docker-compose.yml
```

### Database Connection Failed

```bash
# Check container logs
docker compose logs portal-db
docker compose logs legacy-db

# Restart services
docker compose restart portal-db
```

### Prisma Client Not Generated

```bash
pnpm prisma generate
```

### Prisma Network Issues (Restricted Environments)

If `pnpm prisma generate` or `pnpm prisma migrate dev` fail due to network restrictions (cannot download Prisma engines), you can manually apply the schema:

1. **Create a SQL file from the schema** (already exists in `prisma/migrations/`)
2. **Apply directly to database:**
   ```bash
   # Find the migration SQL file
   cat prisma/migrations/*/migration.sql
   
   # Apply to database using docker
   docker exec -i lc_portal_db mysql -uroot -p{MYSQL_ROOT_PASSWORD} portal_db < prisma/migrations/*/migration.sql
   ```

3. **For seeding**, use a direct Node.js script with mysql2 instead of Prisma CLI

### Seed Script Fails

```bash
# Make sure migrations are up to date
pnpm prisma migrate dev

# Try seeding again
pnpm prisma db seed

# Alternative: Use direct MySQL insert if Prisma CLI unavailable
# See seed script in prisma/seed.ts for the SQL approach
```

### Redis Connection Issues

```bash
# Check Redis is running
docker compose logs redis

# Test connection
docker exec -it lc_redis redis-cli ping
# Should return: PONG
```

### Mailhog Not Receiving Emails

1. Check Mailhog is running: `docker compose ps`
2. Verify SMTP settings in `.env`:
   ```env
   SMTP_HOST="localhost"
   SMTP_PORT=1025
   ```
3. Check application logs for email sending errors

---

## 🎨 VS Code Setup

### Recommended Extensions

- **Prisma** - Syntax highlighting for schema files
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

---

## 🔄 Typical Development Workflow

1. **Start Docker services** (once per session):
   ```bash
   docker compose up -d
   ```

2. **Start dev server**:
   ```bash
   pnpm dev
   ```

3. **Make changes** to code

4. **Test changes**:
   - Browser auto-refreshes on save
   - Check Mailhog for emails
   - Use Prisma Studio to inspect DB

5. **Run tests before committing**:
   ```bash
   pnpm test
   pnpm test:e2e
   ```

6. **Stop services** (when done):
   ```bash
   docker compose down
   ```

---

## 🔐 Test Credentials

After running `pnpm prisma db seed`:

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@example.com      | admin123  |
| User  | user@example.com       | user123   |

---

## 📞 Getting Help

- Check container logs: `docker compose logs <service-name>`
- Check application logs in the terminal running `pnpm dev`
- Review Prisma schema: `lc_website_next/prisma/schema.prisma`
- See troubleshooting section above

---

**Happy Coding! 🚀**

# LC Backend API v1.0.0

Modern backend system for Last Chaos with Portal (PostgreSQL) + Game Integration (MySQL).

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+ (or use Docker)
- MySQL 8.0+ (or use Docker)

### Local Development

1. **Clone and Install**
   ```bash
   cd apps/lc_api/apps/api-server
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp ../../.env.example .env
   # Edit .env with your settings
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start API**
   ```bash
   npm run start:dev
   ```

6. **Access API**
   - API: http://localhost:4000
   - Docs: http://localhost:4000/api/docs
   - Health: http://localhost:4000/health

## 📚 Documentation

- [Architecture Overview](../docs/ARCHITECTURE_OVERVIEW.md)
- [Database Schema](../docs/DB_SCHEMA.md)
- [Security Policy](../docs/SECURITY_POLICY.md)
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)
- [Changelog](../docs/CHANGELOG.md)
- [Migration Report](../docs/MIGRATION_REPORT.md)
- [Final Implementation Report](../docs/FINAL_IMPLEMENTATION_REPORT.md)

## 🏗️ Architecture

```
Portal (PostgreSQL)          Game (MySQL)
- Users & Auth               - Characters
- RBAC & Permissions         - Guilds
- Tickets & Support          - Items
- Payments                   - Rankings
- Redeem Codes              - Cash
- News & Votes              
```

## 🔐 Security

- **Passwords:** Argon2id hashing
- **Auth:** JWT tokens (15min access, 7d refresh)
- **2FA:** TOTP support with QR codes
- **RBAC:** Role-based access control
- **Audit:** Activity logging for all actions

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /auth/totp/setup` - Setup 2FA
- `POST /auth/totp/verify` - Verify 2FA

### Users
- `GET /users/me` - Get profile
- `PATCH /users/me` - Update profile

### Game Integration
- `POST /game/account/create` - Create game account
- `POST /game/cash/grant` - Grant cash (admin)
- `GET /game/characters` - Get characters
- `GET /game/guilds` - Get guilds
- `GET /game/rankings/level` - Get rankings

### Portal Features
- `POST /tickets` - Create ticket
- `GET /tickets` - List tickets
- `POST /redeem/claim` - Claim code
- `GET /news` - Get news
- `POST /votes` - Vote

### Health
- `GET /health` - Health check
- `GET /health/version` - Version info

## 🛠️ Development

### Available Scripts

```bash
npm run start:dev      # Development mode (watch)
npm run build          # Build for production
npm run start:prod     # Start production build
npm run lint           # Lint code
npm run test           # Run tests
```

### Database Commands

```bash
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create migration
npx prisma migrate deploy      # Deploy migrations
npx prisma generate            # Generate Prisma Client
```

## 🐳 Docker

### Start All Services

```bash
docker-compose up -d
```

### Stop All Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
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

## 📦 Production Deployment

See [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy with PM2

```bash
npm install
npm run build
npm install -g pm2
pm2 start dist/main.js --name lc-api
pm2 save
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `MYSQL_*` - MySQL connection details

**Optional:**
- `REDIS_URL` - Redis for caching
- `CORS_ORIGINS` - Allowed origins

## 🐛 Troubleshooting

### Database Connection Failed

1. Check if PostgreSQL is running: `docker-compose ps`
2. Verify connection string in `.env`
3. Check firewall rules

### Migrations Failed

1. Reset database: `npx prisma migrate reset`
2. Regenerate client: `npx prisma generate`
3. Rerun migrations: `npx prisma migrate deploy`

### Port Already in Use

Change `API_PORT` in `.env` or stop conflicting service.

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-16T00:00:00.000Z",
  "database": "connected"
}
```

## 📝 License

Proprietary - See LICENSE-PROPRIETARY for details.

## 🤝 Support

- Documentation: `/docs`
- Issues: Create a GitHub issue
- Email: support@example.com

## 🎯 Version

Current Version: **v1.0.0**

See [CHANGELOG.md](../docs/CHANGELOG.md) for version history.

---

Built with ❤️ using NestJS, TypeScript, and PostgreSQL

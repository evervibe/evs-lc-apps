# Deployment Guide - EVS-LC Apps

**Version:** 1.0.0  
**Last Updated:** 2025-10-16

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend API Deployment](#backend-api-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Recovery](#backup--recovery)

## Overview

This guide covers complete production deployment of the EVS-LC Apps monorepo, including:
- Backend API (NestJS)
- Frontend applications (Next.js)
- Database systems (PostgreSQL + MySQL)
- Reverse proxy configuration (nginx)
- Process management (PM2)
- Containerization (Docker)

## Prerequisites

### Server Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ or similar Linux distribution

**Recommended:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- OS: Ubuntu 22.04 LTS

### Software Requirements

```bash
# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm
npm install -g pnpm

# PM2 (process manager)
npm install -g pm2

# nginx (reverse proxy)
sudo apt-get install -y nginx

# PostgreSQL 16
sudo apt-get install -y postgresql postgresql-contrib

# MySQL 8
sudo apt-get install -y mysql-server

# Docker & Docker Compose (optional)
curl -fsSL https://get.docker.com | sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Backend API Deployment

### Option 1: PM2 (Recommended)

#### 1. Prepare Application

```bash
# Clone repository
git clone https://github.com/evervibe/evs-lc-apps.git
cd evs-lc-apps/apps/lc_api/api-server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Run migrations
npx prisma migrate deploy

# Build application
npm run build
```

#### 2. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'lc-api',
    script: './dist/main.js',
    cwd: '/var/www/evs-lc-apps/apps/lc_api/api-server',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: '/var/log/pm2/lc-api-error.log',
    out_file: '/var/log/pm2/lc-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
}
```

#### 3. Start with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Monitor
pm2 status
pm2 logs lc-api
pm2 monit
```

### Option 2: Docker

#### Dockerfile

```dockerfile
# apps/lc_api/api-server/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built app and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 4000

# Start application
CMD ["node", "dist/main.js"]
```

#### Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: ./apps/lc_api/api-server
      dockerfile: Dockerfile
    restart: always
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    depends_on:
      - postgres
      - mysql
    networks:
      - app-network

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network

volumes:
  postgres-data:
  mysql-data:

networks:
  app-network:
    driver: bridge
```

Start with Docker:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Frontend Deployment

### Option 1: Vercel (Easiest)

#### Web Portal

```bash
cd apps/lc_apps/web-portal

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Configure environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`
- etc.

#### Web Admin

Repeat for web-admin directory.

### Option 2: PM2 with Node.js

#### 1. Build Applications

```bash
cd apps/lc_apps

# Build portal
cd web-portal
pnpm install
pnpm build

# Build admin
cd ../web-admin
pnpm install
pnpm build
```

#### 2. PM2 Configuration

Add to `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    // ... API config above ...
    {
      name: 'lc-portal',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/evs-lc-apps/apps/lc_apps/web-portal',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'lc-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      cwd: '/var/www/evs-lc-apps/apps/lc_apps/web-admin',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

#### 3. Start Applications

```bash
pm2 start ecosystem.config.js
pm2 save
```

### Option 3: Docker

Create Dockerfiles for each frontend app:

```dockerfile
# apps/lc_apps/web-portal/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm install -g pnpm && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## nginx Configuration

### Reverse Proxy Setup

```nginx
# /etc/nginx/sites-available/evs-lc-apps

# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Web Portal
server {
    listen 80;
    server_name portal.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Web Admin
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable configuration:

```bash
sudo ln -s /etc/nginx/sites-available/evs-lc-apps /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/TLS Configuration

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d portal.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com

# Auto-renewal (should be setup automatically)
sudo certbot renew --dry-run
```

Certbot will automatically modify nginx config to use HTTPS.

## Database Setup

### PostgreSQL (Portal Database)

```bash
# Create user and database
sudo -u postgres psql
CREATE USER lcuser WITH PASSWORD 'strong_password';
CREATE DATABASE lc_portal OWNER lcuser;
GRANT ALL PRIVILEGES ON DATABASE lc_portal TO lcuser;
\q

# Configure pg_hba.conf for connections
sudo nano /etc/postgresql/16/main/pg_hba.conf
# Add: host lc_portal lcuser 127.0.0.1/32 md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Run migrations
cd /var/www/evs-lc-apps/apps/lc_api/api-server
npx prisma migrate deploy
```

### MySQL (Game Database)

```bash
# Secure installation
sudo mysql_secure_installation

# Create user and database
sudo mysql
CREATE DATABASE lc_game;
CREATE USER 'lcgame'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT ON lc_game.* TO 'lcgame'@'localhost';
GRANT EXECUTE ON lc_game.* TO 'lcgame'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema if needed
mysql -u lcgame -p lc_game < schema.sql
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs
pm2 logs lc-api
pm2 logs lc-portal

# Flush logs
pm2 flush
```

### nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Application Health Checks

```bash
# API health
curl https://api.yourdomain.com/health

# Portal health
curl https://portal.yourdomain.com

# Check all services
pm2 status
```

## Backup & Recovery

### Database Backups

#### PostgreSQL

```bash
# Create backup script
cat > /usr/local/bin/backup-postgres.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U lcuser lc_portal > $BACKUP_DIR/lc_portal_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-postgres.sh

# Add to cron (daily at 2 AM)
(crontab -l ; echo "0 2 * * * /usr/local/bin/backup-postgres.sh") | crontab -
```

#### MySQL

```bash
# Create backup script
cat > /usr/local/bin/backup-mysql.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mysqldump -u lcgame -p'password' lc_game > $BACKUP_DIR/lc_game_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-mysql.sh

# Add to cron
(crontab -l ; echo "0 2 * * * /usr/local/bin/backup-mysql.sh") | crontab -
```

### Application Backups

```bash
# Backup entire application
tar -czf /var/backups/evs-lc-apps_$(date +%Y%m%d).tar.gz \
  /var/www/evs-lc-apps \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist'
```

## Security Checklist

- [ ] Firewall configured (ufw/iptables)
- [ ] SSL/TLS certificates installed
- [ ] Strong database passwords
- [ ] Environment variables secured
- [ ] Fail2ban installed for SSH protection
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured

## Post-Deployment

### 1. Verify Services

```bash
# Check all PM2 apps
pm2 status

# Check nginx
sudo systemctl status nginx

# Check databases
sudo systemctl status postgresql
sudo systemctl status mysql

# Test API endpoints
curl https://api.yourdomain.com/health
curl https://api.yourdomain.com/health/version

# Test frontend
curl https://portal.yourdomain.com
curl https://admin.yourdomain.com
```

### 2. Setup Monitoring

- Configure uptime monitoring (UptimeRobot, Pingdom)
- Setup error tracking (Sentry)
- Enable log aggregation (ELK stack, Datadog)
- Configure alerts (email, Slack, PagerDuty)

### 3. Performance Optimization

```bash
# Enable nginx gzip compression
# Add to nginx.conf http block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;

# Enable PM2 cluster mode for API
pm2 scale lc-api 4  # Scale to 4 instances

# Optimize PostgreSQL
# Edit /etc/postgresql/16/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs lc-api --lines 100

# Check environment
pm2 env lc-api

# Restart
pm2 restart lc-api
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U lcuser -h localhost -d lc_portal

# Test MySQL connection
mysql -u lcgame -h localhost -p lc_game

# Check if services are running
sudo systemctl status postgresql
sudo systemctl status mysql
```

### nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error log
tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

---

**For more information:**
- [Architecture Documentation](./ARCHITECTURE.md)
- [Security Policy](./SECURITY_POLICY.md)
- [Workspace Guide](./WORKSPACE_GUIDE.md)

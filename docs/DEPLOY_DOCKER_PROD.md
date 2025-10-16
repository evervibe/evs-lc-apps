# Docker Production Deployment Guide

This guide provides step-by-step instructions for deploying EVS-LC-APPS in production using Docker and Docker Compose.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment Steps](#deployment-steps)
- [Service Management](#service-management)
- [Monitoring & Logs](#monitoring--logs)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Prerequisites

### System Requirements

- **Operating System**: Linux (Ubuntu 22.04+ recommended)
- **Docker**: 24.0+
- **Docker Compose**: 2.20+
- **Memory**: Minimum 4GB RAM (8GB+ recommended)
- **Disk Space**: Minimum 20GB free space
- **Network**: Open ports 80, 443 (and optionally 4000, 3000, 3001 for direct access)

### Software Installation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version

# Add current user to docker group (logout required)
sudo usermod -aG docker $USER
```

---

## Architecture Overview

### Services

```
┌─────────────────────────────────────────────────────────────┐
│                     EVS-LC-APPS Stack                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │ Web Portal   │   │  Web Admin   │   │   Backend    │  │
│  │  (Next.js)   │   │  (Next.js)   │   │    API       │  │
│  │  Port: 3000  │   │  Port: 3001  │   │ (NestJS)     │  │
│  └──────┬───────┘   └──────┬───────┘   │  Port: 4000  │  │
│         │                  │            └──────┬───────┘  │
│         └──────────────────┴────────────────┬──┘          │
│                                             │              │
│  ┌──────────────┐                   ┌──────┴───────┐     │
│  │  PostgreSQL  │                   │    Redis     │     │
│  │  Port: 5432  │                   │  Port: 6379  │     │
│  └──────────────┘                   └──────────────┘     │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │         External MySQL Databases (Game)          │    │
│  │  AUTH │ GAME │ DATA │ LOGS                       │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Network

All services communicate over a dedicated Docker network (`evs-net`):
- Internal service-to-service communication
- Isolated from external access
- Health checks enabled for all services

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/evervibe/evs-lc-apps.git
cd evs-lc-apps
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
nano .env
```

**Minimal Required Configuration:**

```env
# PostgreSQL
POSTGRES_USER=lc_portal
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE
POSTGRES_DB=lc_portal_db

# Redis
REDIS_PASSWORD=YOUR_REDIS_PASSWORD_HERE

# JWT (CRITICAL - CHANGE THIS!)
JWT_SECRET=YOUR_SECURE_RANDOM_STRING_MIN_32_CHARS

# CORS Origins (Update with your domains)
CORS_ORIGINS=https://portal.yourdomain.com,https://admin.yourdomain.com

# Public URLs
PORTAL_URL=https://portal.yourdomain.com
ADMIN_URL=https://admin.yourdomain.com

# MySQL Game Databases (Configure based on your setup)
MYSQL_AUTH_HOST=your-mysql-host
MYSQL_AUTH_PORT=3306
MYSQL_AUTH_USER=lc_ro
MYSQL_AUTH_PASS=your-password
MYSQL_AUTH_DB=db_auth
# ... (configure other MySQL databases)
```

### 3. Deploy

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

---

## Configuration

### Environment Variables

See [ENVIRONMENT.md](./ENVIRONMENT.md) for comprehensive variable reference.

#### Critical Variables to Change in Production

1. **JWT_SECRET**: Generate with `openssl rand -base64 32`
2. **POSTGRES_PASSWORD**: Strong database password
3. **REDIS_PASSWORD**: Strong Redis password
4. **CORS_ORIGINS**: Your actual domain names
5. **MySQL credentials**: Game database connection details

### Docker Compose Override

For environment-specific configurations, create `docker-compose.override.yml`:

```yaml
version: '3.9'

services:
  api:
    environment:
      # Override specific variables
      JWT_SECRET: production_secret_from_vault
```

---

## Deployment Steps

### Step 1: Database Initialization

On first deployment, initialize the PostgreSQL database:

```bash
# The API service will automatically run migrations on startup
# Check logs to verify:
docker compose -f docker-compose.prod.yml logs api
```

### Step 2: Verify Services

Wait for all services to become healthy:

```bash
# Check health status
docker compose -f docker-compose.prod.yml ps

# All services should show "healthy" status
```

### Step 3: Test Endpoints

```bash
# API Health Check
curl http://localhost:4000/health

# API Documentation
curl http://localhost:4000/api/docs

# Web Portal
curl http://localhost:3000

# Web Admin
curl http://localhost:3001
```

### Step 4: Configure Reverse Proxy (Recommended)

Use Nginx or Caddy as a reverse proxy for SSL/TLS:

**Nginx Example:**

```nginx
server {
    listen 443 ssl http2;
    server_name portal.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Service Management

### Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Stop Services

```bash
docker compose -f docker-compose.prod.yml stop
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart api
```

### Update Services

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Remove old images
docker image prune -a
```

### Scale Services (if needed)

```bash
# Scale web-portal to 3 instances
docker compose -f docker-compose.prod.yml up -d --scale web-portal=3
```

---

## Monitoring & Logs

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### Health Checks

```bash
# Check all container statuses
docker compose -f docker-compose.prod.yml ps

# Inspect specific service health
docker inspect --format='{{.State.Health.Status}}' lc-api
```

### Resource Usage

```bash
# View resource consumption
docker stats

# Detailed container info
docker compose -f docker-compose.prod.yml top
```

---

## Backup & Recovery

### Database Backup

```bash
# PostgreSQL backup
docker exec lc-postgres pg_dump -U lc_portal lc_portal_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (add to crontab)
0 2 * * * docker exec lc-postgres pg_dump -U lc_portal lc_portal_db | gzip > /backups/lc_db_$(date +\%Y\%m\%d).sql.gz
```

### Database Restore

```bash
# Stop services
docker compose -f docker-compose.prod.yml stop api

# Restore database
cat backup.sql | docker exec -i lc-postgres psql -U lc_portal lc_portal_db

# Restart services
docker compose -f docker-compose.prod.yml start api
```

### Volume Backup

```bash
# Backup PostgreSQL data
docker run --rm -v evs-lc-apps_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Backup Redis data
docker run --rm -v evs-lc-apps_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz -C /data .
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs service-name

# Verify environment variables
docker compose -f docker-compose.prod.yml config

# Check port conflicts
sudo netstat -tulpn | grep LISTEN
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
docker exec lc-postgres psql -U lc_portal -d lc_portal_db -c "SELECT 1;"

# Check DATABASE_URL format
docker compose -f docker-compose.prod.yml exec api printenv DATABASE_URL
```

### Memory Issues

```bash
# Check memory usage
docker stats --no-stream

# Increase Docker memory limit (Docker Desktop)
# Settings > Resources > Memory
```

### Permission Errors

```bash
# Fix volume permissions
docker compose -f docker-compose.prod.yml down
sudo chown -R 1001:1001 /var/lib/docker/volumes/evs-lc-apps_*
docker compose -f docker-compose.prod.yml up -d
```

---

## Security Best Practices

### 1. Secrets Management

- **Never commit secrets to Git**
- Use Docker secrets or environment variable files
- Consider using HashiCorp Vault or AWS Secrets Manager

### 2. Network Security

- Use a firewall (ufw, iptables)
- Only expose necessary ports
- Use a reverse proxy with SSL/TLS

```bash
# UFW firewall example
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### 3. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### 4. Access Control

- Use strong passwords (min 16 characters)
- Enable 2FA for admin accounts
- Implement rate limiting
- Monitor audit logs

### 5. Monitoring

Consider integrating:
- **Prometheus + Grafana**: Metrics and dashboards
- **ELK Stack**: Log aggregation
- **Sentry**: Error tracking

---

## Production Checklist

Before going live, verify:

- [ ] Strong, unique passwords for all services
- [ ] JWT_SECRET is secure (min 32 characters)
- [ ] CORS_ORIGINS configured with actual domains
- [ ] SSL/TLS certificates configured
- [ ] Database backups automated
- [ ] Monitoring and alerting configured
- [ ] Firewall rules in place
- [ ] Health checks passing
- [ ] Log rotation configured
- [ ] Reverse proxy configured (Nginx/Caddy)
- [ ] Domain DNS properly configured
- [ ] Rate limiting enabled
- [ ] Environment variables validated

---

## Advanced Configuration

### Using Docker Secrets

```bash
# Create secrets
echo "my_jwt_secret" | docker secret create jwt_secret -
echo "postgres_password" | docker secret create postgres_pass -

# Update docker-compose to use secrets (requires Swarm mode)
```

### Resource Limits

Add to `docker-compose.prod.yml`:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### External MySQL Connection

If MySQL databases are on external servers:

```yaml
services:
  api:
    extra_hosts:
      - "mysql-host:192.168.1.100"
```

---

## Support

For issues or questions:
- **Documentation**: [/docs](../docs)
- **GitHub Issues**: [GitHub Issues](https://github.com/evervibe/evs-lc-apps/issues)

---

**Last Updated:** 2025-10-16  
**Version:** 1.0.1  
**Status:** Production Ready ✅

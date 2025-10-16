# Docker Setup Guide

This guide explains how to set up the Portal Database using Docker for development and production.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

## Quick Start

### 1. Configure Environment Variables

Create a `.env` file in the `lc_website_next/` directory (if it doesn't exist):

```bash
cp .env.example .env
```

Edit the `.env` file with your desired MySQL credentials:

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_portal_password

# Portal Database Connection
DATABASE_URL="mysql://portal_user:your_secure_portal_password@localhost:3306/portal_db"
```

### 2. Start the Portal Database

```bash
docker-compose up -d
```

This will:
- Pull the MySQL 8.0 image (if not already downloaded)
- Create a container named `lc_portal_db`
- Create a persistent volume `portal_db_data`
- Expose MySQL on port `3306`

### 3. Verify the Database is Running

```bash
docker-compose ps
```

You should see the `lc_portal_db` container with status "Up".

Check container logs:

```bash
docker-compose logs portal-db
```

### 4. Run Prisma Migrations

Once the database is running, initialize the schema:

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Optional: Seed initial data (if you have a seed script)
pnpm prisma db seed
```

### 5. Verify Database Schema

Connect to MySQL to verify tables were created:

```bash
docker exec -it lc_portal_db mysql -u portal_user -p portal_db
```

Enter your `MYSQL_PASSWORD` when prompted, then:

```sql
SHOW TABLES;
DESCRIBE users;
EXIT;
```

## Managing the Database

### Stop the Database

```bash
docker-compose stop
```

### Start the Database

```bash
docker-compose start
```

### Restart the Database

```bash
docker-compose restart
```

### Stop and Remove the Database Container

```bash
docker-compose down
```

**Note:** This does NOT delete the data volume. Your data is safe.

### Remove Everything (Including Data Volume)

⚠️ **WARNING:** This will delete all database data!

```bash
docker-compose down -v
```

## Database Backup & Restore

### Create a Backup

```bash
docker exec lc_portal_db mysqldump -u portal_user -p portal_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

Enter your `MYSQL_PASSWORD` when prompted.

### Restore from Backup

```bash
docker exec -i lc_portal_db mysql -u portal_user -p portal_db < backup_20250103_120000.sql
```

## Troubleshooting

### Container Fails to Start

**Problem:** Port 3306 already in use

```bash
# Check what's using port 3306
sudo lsof -i :3306

# If another MySQL is running, stop it or change docker-compose.yml port mapping
# e.g., "3307:3306" to expose on port 3307
```

**Problem:** Permission denied

```bash
# On Linux, you might need sudo
sudo docker-compose up -d
```

### Connection Issues

**Problem:** Can't connect from Next.js app

1. Verify the database is running:
   ```bash
   docker-compose ps
   ```

2. Check `DATABASE_URL` in `.env` matches your credentials:
   ```env
   DATABASE_URL="mysql://portal_user:your_password@localhost:3306/portal_db"
   ```

3. Test connection:
   ```bash
   pnpm prisma db push --skip-generate
   ```

### Reset Database

If you need to completely reset the database:

```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Re-run migrations
pnpm prisma migrate dev
```

## Production Deployment

For production, consider:

1. **Use separate `.env` file** with strong passwords
2. **Don't expose port 3306** publicly (use internal Docker network)
3. **Configure regular backups** (e.g., cron job with mysqldump)
4. **Monitor disk space** for the data volume
5. **Use secrets management** (e.g., Docker Secrets, Kubernetes Secrets)

Example production `docker-compose.yml` excerpt:

```yaml
services:
  portal-db:
    # ... other config ...
    ports: []  # Don't expose ports externally
    networks:
      - internal
    
  app:
    # Your Next.js app
    environment:
      DATABASE_URL: "mysql://portal_user:${MYSQL_PASSWORD}@portal-db:3306/portal_db"
    networks:
      - internal

networks:
  internal:
    driver: bridge
```

## Advanced Configuration

### Custom MySQL Configuration

Create a `mysql.cnf` file:

```ini
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 256M
```

Mount it in `docker-compose.yml`:

```yaml
services:
  portal-db:
    volumes:
      - portal_db_data:/var/lib/mysql
      - ./mysql.cnf:/etc/mysql/conf.d/custom.cnf:ro
```

### Performance Tuning

For better performance on development machines:

```yaml
services:
  portal-db:
    command: >
      --default-authentication-plugin=mysql_native_password
      --innodb-buffer-pool-size=512M
      --innodb-log-file-size=128M
      --max-connections=200
```

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [Prisma with MySQL](https://www.prisma.io/docs/concepts/database-connectors/mysql)

---

**Need Help?**

- Check container logs: `docker-compose logs portal-db`
- Check application logs: `pnpm dev` (with verbose logging)
- Review Prisma schema: `lc_website_next/prisma/schema.prisma`

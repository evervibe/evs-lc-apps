# Deployment Guide

## Overview

This guide covers deploying the LC Apps frontend system to production environments.

## Prerequisites

- Node.js 20.x or later
- pnpm package manager
- Access to deployment platform (Vercel, Netlify, or custom server)

## Environment Variables

### Portal Web

Create `.env.production` in `portal-web/`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
NEXT_PUBLIC_RECAPTCHA_KEY=your_recaptcha_site_key
```

### Admin UI

Create `.env.production` in `admin-ui/`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=LastChaos Admin
NEXT_PUBLIC_ENV=production
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment for Next.js applications.

#### Portal Web

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to portal-web:
   ```bash
   cd portal-web
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Configure environment variables in Vercel dashboard

#### Admin UI

Repeat the same steps for admin-ui directory.

### Option 2: Custom Server (Node.js)

#### Build for Production

```bash
# Portal Web
cd portal-web
pnpm install
pnpm run build

# Admin UI
cd ../admin-ui
pnpm install
pnpm run build
```

#### Run with PM2

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'portal-web',
         cwd: './portal-web',
         script: 'node_modules/next/dist/bin/next',
         args: 'start -p 3000',
         env: {
           NODE_ENV: 'production'
         }
       },
       {
         name: 'admin-ui',
         cwd: './admin-ui',
         script: 'node_modules/next/dist/bin/next',
         args: 'start -p 3001',
         env: {
           NODE_ENV: 'production'
         }
       }
     ]
   };
   ```

3. Start applications:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Nginx Configuration

```nginx
# Portal Web
server {
    listen 80;
    server_name portal.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin UI
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: Docker

#### Dockerfile (Portal Web)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  portal-web:
    build:
      context: ./portal-web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    restart: unless-stopped

  admin-ui:
    build:
      context: ./admin-ui
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    restart: unless-stopped
```

Build and run:
```bash
docker-compose up -d
```

## SSL/TLS Configuration

### Using Certbot (Let's Encrypt)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d portal.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Performance Optimization

### Enable Compression

Nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Caching Headers

```nginx
location /_next/static {
    alias /path/to/app/.next/static;
    expires 365d;
    access_log off;
}

location /static {
    alias /path/to/app/public;
    expires 30d;
    access_log off;
}
```

## Monitoring

### Setup Application Monitoring

1. Install monitoring tools:
   ```bash
   npm install --save @sentry/nextjs
   ```

2. Configure Sentry in `next.config.js`

3. Add health check endpoint

### Log Management

Configure PM2 logs:
```bash
pm2 logs portal-web --lines 100
pm2 flush # Clear logs
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Portal Web

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: cd portal-web && pnpm install
        
      - name: Build
        run: cd portal-web && pnpm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./portal-web
```

## Backup Strategy

1. Database backups (handled by backend)
2. User uploads backup (if applicable)
3. Configuration files backup
4. SSL certificates backup

## Rollback Procedure

### Vercel

Use Vercel dashboard to rollback to previous deployment.

### Custom Server

```bash
# Using PM2
pm2 deploy production revert 1

# Manual
cd portal-web
git checkout <previous-commit>
pnpm install
pnpm run build
pm2 restart portal-web
```

## Security Checklist

- [ ] Environment variables secured
- [ ] SSL/TLS certificates installed
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] Regular security updates
- [ ] Monitoring and alerting setup

## Post-Deployment

1. Verify all pages load correctly
2. Test authentication flow
3. Check API integration
4. Verify environment variables
5. Test error handling
6. Monitor performance metrics
7. Check logs for errors

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
pnpm install
pnpm run build
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Memory Issues

Increase Node.js memory limit:
```bash
NODE_OPTIONS=--max_old_space_size=4096 pnpm run build
```

## Support

For deployment issues:
- Check application logs
- Review Vercel/platform logs
- Verify environment variables
- Test API connectivity
- Contact DevOps team

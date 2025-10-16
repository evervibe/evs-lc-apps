# Multi-stage Dockerfile for Web Admin Production

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Copy workspace configuration
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/lc_apps/package.json ./apps/lc_apps/
COPY apps/lc_apps/web-admin/package.json ./apps/lc_apps/web-admin/
COPY apps/lc_apps/shared/package.json ./apps/lc_apps/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/lc_apps/web-admin/node_modules ./apps/lc_apps/web-admin/node_modules
COPY --from=deps /app/apps/lc_apps/shared/node_modules ./apps/lc_apps/shared/node_modules

# Copy source files
COPY apps/lc_apps/web-admin ./apps/lc_apps/web-admin
COPY apps/lc_apps/shared ./apps/lc_apps/shared
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Build application
WORKDIR /app/apps/lc_apps/web-admin
RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/lc_apps/web-admin/next.config.ts ./
COPY --from=builder /app/apps/lc_apps/web-admin/package.json ./
COPY --from=builder /app/apps/lc_apps/web-admin/public ./public

# Copy build output
COPY --from=builder --chown=nextjs:nodejs /app/apps/lc_apps/web-admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/lc_apps/web-admin/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js
CMD ["node", "server.js"]

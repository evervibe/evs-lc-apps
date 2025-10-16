# Multi-stage Dockerfile for LC API Production

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY apps/lc_api/api-server/package.json ./apps/lc_api/api-server/

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/lc_api/api-server/node_modules ./apps/lc_api/api-server/node_modules

# Copy source files
COPY apps/lc_api/api-server ./apps/lc_api/api-server
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.base.json ./

# Generate Prisma Client
WORKDIR /app/apps/lc_api/api-server
RUN npx prisma generate

# Build application
RUN pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=builder /app/apps/lc_api/api-server/dist ./dist
COPY --from=builder /app/apps/lc_api/api-server/node_modules ./node_modules
COPY --from=builder /app/apps/lc_api/api-server/prisma ./prisma
COPY --from=builder /app/apps/lc_api/api-server/package.json ./

# Set ownership
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose API port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

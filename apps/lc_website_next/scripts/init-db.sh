#!/bin/bash
# Initialize Portal Database
# This script sets up the database schema and seeds test data
# Works even in restricted network environments where Prisma CLI is unavailable

set -e

echo "🚀 Initializing Portal Database..."
echo ""

# Check if docker is running
if ! docker compose ps | grep -q "lc_portal_db"; then
    echo "❌ Error: portal-db container is not running"
    echo "   Run: docker compose up -d"
    exit 1
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec lc_portal_db mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo "✅ Database is ready"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Database failed to start after 30 seconds"
        exit 1
    fi
    sleep 1
done

echo ""

# Get MySQL root password from environment or use default
MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-change_this_root_password}"

# Check if schema is already initialized
if docker exec lc_portal_db mysql -uroot -p"$MYSQL_ROOT_PASSWORD" portal_db -e "SHOW TABLES LIKE 'users';" 2>/dev/null | grep -q "users"; then
    echo "ℹ️  Database schema already exists"
else
    echo "📋 Creating database schema..."
    
    # Apply schema SQL
    cat << 'EOF' | docker exec -i lc_portal_db mysql -uroot -p"$MYSQL_ROOT_PASSWORD" portal_db 2>/dev/null
-- Portal Database Schema
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    email VARCHAR(191) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX users_email_key(email),
    INDEX users_email_idx(email),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    expiresAt DATETIME(3) NOT NULL,
    INDEX sessions_userId_idx(userId),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS oauth_accounts (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    provider VARCHAR(191) NOT NULL,
    providerAccountId VARCHAR(191) NOT NULL,
    accessToken TEXT NULL,
    refreshToken TEXT NULL,
    expiresAt DATETIME(3) NULL,
    UNIQUE INDEX oauth_accounts_provider_providerAccountId_key(provider, providerAccountId),
    INDEX oauth_accounts_userId_idx(userId),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mfa_totp (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    secretEncrypted VARCHAR(255) NOT NULL,
    enabledAt DATETIME(3) NULL,
    UNIQUE INDEX mfa_totp_userId_key(userId),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mfa_backup_codes (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    codeHash VARCHAR(255) NOT NULL,
    usedAt DATETIME(3) NULL,
    INDEX mfa_backup_codes_userId_idx(userId),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    token VARCHAR(191) NOT NULL,
    expiresAt DATETIME(3) NOT NULL,
    usedAt DATETIME(3) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX password_reset_tokens_token_key(token),
    INDEX password_reset_tokens_userId_idx(userId),
    INDEX password_reset_tokens_token_idx(token),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_servers (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(191) NOT NULL,
    region VARCHAR(191) NULL,
    driver VARCHAR(50) NOT NULL DEFAULT 'mysql',
    host VARCHAR(191) NOT NULL,
    port INT NOT NULL DEFAULT 3306,
    \`database\` VARCHAR(191) NOT NULL,
    roUser VARCHAR(191) NOT NULL,
    roPassEncrypted VARCHAR(255) NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_account_links (
    id VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    serverId VARCHAR(36) NOT NULL,
    gameUsername VARCHAR(191) NOT NULL,
    verifiedAt DATETIME(3) NULL,
    legacyAlgo VARCHAR(50) NULL,
    lastCheckAt DATETIME(3) NULL,
    UNIQUE INDEX game_account_links_serverId_gameUsername_key(serverId, gameUsername),
    INDEX game_account_links_userId_idx(userId),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) NOT NULL,
    actorUserId VARCHAR(36) NULL,
    action VARCHAR(191) NOT NULL,
    target VARCHAR(191) NOT NULL,
    metaJson TEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX audit_logs_actorUserId_idx(actorUserId),
    INDEX audit_logs_createdAt_idx(createdAt),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE sessions ADD CONSTRAINT sessions_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE oauth_accounts ADD CONSTRAINT oauth_accounts_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE mfa_totp ADD CONSTRAINT mfa_totp_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE mfa_backup_codes ADD CONSTRAINT mfa_backup_codes_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE password_reset_tokens ADD CONSTRAINT password_reset_tokens_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE game_account_links ADD CONSTRAINT game_account_links_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE game_account_links ADD CONSTRAINT game_account_links_serverId_fkey FOREIGN KEY (serverId) REFERENCES game_servers(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_actorUserId_fkey FOREIGN KEY (actorUserId) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
EOF
    
    echo "✅ Database schema created"
fi

echo ""
echo "🎉 Database initialization complete!"
echo ""
echo "Next steps:"
echo "  1. Run: node scripts/seed-db.js"
echo "  2. Or use: pnpm prisma db seed"
echo ""

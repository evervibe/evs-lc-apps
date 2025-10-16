#!/bin/bash

# LC Backend Database Seed Script
# Run this to seed initial data (roles, permissions, etc.)

set -e

echo "🌱 Starting database seeding..."

cd "$(dirname "$0")/../apps/lc_api/backend"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Seed data using psql
echo "📋 Seeding roles and permissions..."

PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') \
PGHOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p') \
PGPORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p') \
PGDATABASE=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p') \
PGUSER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p') \
psql -v ON_ERROR_STOP=1 <<-EOSQL
    -- Insert default roles
    INSERT INTO portal_roles (name, description) VALUES
        ('user', 'Regular user')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_roles (name, description) VALUES
        ('moderator', 'Moderator with elevated permissions')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_roles (name, description) VALUES
        ('admin', 'Full administrative access')
    ON CONFLICT (name) DO NOTHING;

    -- Insert default permissions
    INSERT INTO portal_permissions (name, description) VALUES
        ('read:users', 'Read user data')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_permissions (name, description) VALUES
        ('write:users', 'Modify user data')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_permissions (name, description) VALUES
        ('delete:users', 'Delete users')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_permissions (name, description) VALUES
        ('grant:cash', 'Grant cash to game accounts')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_permissions (name, description) VALUES
        ('manage:tickets', 'Manage support tickets')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO portal_permissions (name, description) VALUES
        ('manage:news', 'Manage news articles')
    ON CONFLICT (name) DO NOTHING;

    -- Assign all permissions to admin role
    INSERT INTO portal_role_permissions (role_id, permission_id)
    SELECT r.id, p.id 
    FROM portal_roles r, portal_permissions p 
    WHERE r.name = 'admin'
    ON CONFLICT DO NOTHING;

    -- Assign some permissions to moderator role
    INSERT INTO portal_role_permissions (role_id, permission_id)
    SELECT r.id, p.id 
    FROM portal_roles r, portal_permissions p 
    WHERE r.name = 'moderator' AND p.name IN ('read:users', 'manage:tickets')
    ON CONFLICT DO NOTHING;
EOSQL

echo "✅ Database seeding completed successfully!"
echo "👤 Default roles created: user, moderator, admin"
echo "🔐 Default permissions created and assigned"

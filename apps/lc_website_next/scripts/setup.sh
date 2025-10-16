#!/bin/bash

# LC Portal Setup Script
# Automates the initial setup process

set -e

echo "🚀 LC Portal Setup Script"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm --version) detected"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker detected"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

echo "✅ docker-compose detected"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env file with your configuration"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d
echo "✅ Docker containers started"
echo ""

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready (30 seconds)..."
sleep 30

# Run Prisma migrations
echo "🗄️  Running database migrations..."
pnpm prisma migrate deploy
echo "✅ Migrations completed"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm prisma generate
echo "✅ Prisma client generated"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your configuration"
echo "  2. Run 'pnpm dev' to start the development server"
echo "  3. Visit http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Quick start guide"
echo "  - docs/SETUP_GUIDE.md - Detailed setup instructions"
echo "  - docs/SECURITY_FEATURES.md - Security features guide"
echo ""

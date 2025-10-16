# Quick Start Guide

Get the LastChaos Portal & Admin system up and running in minutes.

## Prerequisites

- **Node.js**: 20.x or later ([Download](https://nodejs.org/))
- **pnpm**: Latest version (recommended package manager)
- **Git**: For cloning the repository

## Installation

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Clone the Repository

```bash
git clone https://github.com/evervibe/lc_apps.git
cd lc_apps
```

### 3. Install All Dependencies (Workspace)

```bash
# This installs dependencies for all apps and shared library
pnpm install
```

### 4. Setup Environment Variables

```bash
# Copy environment files
cp portal-web/.env.example portal-web/.env
cp admin-ui/.env.example admin-ui/.env

# Edit .env files and update NEXT_PUBLIC_API_URL
# Example: NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Running Development Servers

### Start All Apps (Recommended)

```bash
# Starts both portal-web and admin-ui concurrently
pnpm dev
```

- Portal Web: [http://localhost:3000](http://localhost:3000)
- Admin UI: [http://localhost:3001](http://localhost:3001)

### Start Individual Apps

```bash
# Portal Web only
cd portal-web && pnpm dev

# Admin UI only  
cd admin-ui && pnpm dev
```

## Building for Production

### Build All Apps

```bash
# Builds both apps using Turbo
pnpm build
```

### Build Individual Apps

```bash
# Portal Web
cd portal-web
pnpm run build
pnpm start
```

### Admin UI

```bash
cd admin-ui
pnpm run build
pnpm start
```

## Project Structure (Monorepo)

```
lc_apps/                   # Monorepo root
├── portal-web/            # Player portal (port 3000)
│   ├── app/              # Pages and routes
│   ├── components/       # UI components
│   ├── lib/             # Utilities
│   └── public/          # Static assets
│
├── admin-ui/             # Admin dashboard (port 3001)
│   ├── app/             # Pages and routes
│   ├── components/      # UI components
│   └── lib/            # Utilities
│
├── shared/              # Shared library (@lc-apps/shared)
│   ├── ui/             # Shared components
│   ├── lib/            # Utilities & API client
│   ├── hooks/          # Custom hooks
│   └── types/          # TypeScript types
│
├── docs/               # Documentation
├── package.json        # Root workspace config
├── pnpm-workspace.yaml # Workspace definition
└── turbo.json          # Build orchestration
```

## Available Pages

### Portal Web
- `/` - Landing page
- `/news` - News listing
- `/market` - Item shop
- `/rankings` - Leaderboards
- `/vote` - Vote for rewards
- `/redeem` - Code redemption
- `/downloads` - Client downloads
- `/support/tickets` - Support system
- `/dashboard` - User dashboard
- `/auth/login` - Login
- `/auth/register` - Register

### Admin UI
- `/` - Admin login
- `/dashboard` - Statistics overview
- `/users` - User management
- `/tickets` - Support tickets
- `/redeem` - Code management
- `/news` - News editor
- `/events` - Event management
- `/logs` - Audit logs

## Environment Variables

### Required (Portal Web)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_ENV=development
```

### Optional (Portal Web)

```env
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
NEXT_PUBLIC_RECAPTCHA_KEY=your_recaptcha_key
NEXT_PUBLIC_ENABLE_VOTING=true
NEXT_PUBLIC_ENABLE_MARKET=true
NEXT_PUBLIC_ENABLE_RANKINGS=true
```

See [ENV_REFERENCE.md](./docs/ENV_REFERENCE.md) for complete details.

## Common Commands

### Development (Workspace)
```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps
pnpm lint             # Lint all workspaces
pnpm type-check       # Type check all workspaces
pnpm format           # Format code with Prettier
pnpm clean            # Clean build artifacts
```

### Individual Apps
```bash
cd portal-web
pnpm dev              # Start portal-web only
pnpm build            # Build portal-web only
pnpm lint             # Lint portal-web only
```

### Package Management
```bash
pnpm install          # Install dependencies
pnpm add <package>    # Add new package
pnpm remove <package> # Remove package
pnpm update           # Update all packages
```

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm run dev -- -p 3002
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
pnpm install
pnpm run build
```

### Module Not Found

```bash
# Reinstall dependencies
pnpm install
```

### Environment Variables Not Working

1. Restart dev server after changing `.env`
2. Ensure variable starts with `NEXT_PUBLIC_` for client-side
3. Check variable name spelling (case-sensitive)

## API Integration

The frontend expects a backend API at `NEXT_PUBLIC_API_URL`. Key endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/me` - Current user
- `GET /news` - News articles
- `GET /rankings/characters` - Character rankings
- `GET /rankings/guilds` - Guild rankings
- `GET /market/items` - Shop items
- `GET /votes/sites` - Vote sites
- `POST /redeem/code` - Redeem code
- `GET /tickets` - Support tickets

See the backend documentation for complete API reference.

## Next Steps

1. **Customize Branding**
   - Update colors in `app/globals.css`
   - Replace logo and assets in `public/`
   - Update metadata in `layout.tsx`

2. **Connect to Real API**
   - Update `NEXT_PUBLIC_API_URL` to your backend
   - Implement actual authentication
   - Connect all data fetching

3. **Add Features**
   - Implement admin dashboard
   - Add real-time updates
   - Integrate payment system
   - Add more game features

4. **Deploy**
   - See [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)
   - Configure production environment
   - Set up CI/CD pipeline

## Documentation

- [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)
- [Component Library Guide](./docs/COMPONENT_LIBRARY_GUIDE.md)
- [Pages Overview](./docs/PAGES_OVERVIEW.md)
- [Environment Reference](./docs/ENV_REFERENCE.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Changelog](./CHANGELOG.md)

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/evervibe/lc_apps/issues)
- **Discussions**: [GitHub Discussions](https://github.com/evervibe/lc_apps/discussions)
- **Discord**: Join our community server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the LastChaos server infrastructure.

---

**Happy Coding!** 🚀

For detailed information, see the [main README](./README.md) and [documentation](./docs/).

# Changelog

All notable changes to the LC Apps project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-16

### Added

#### Workspace Setup
- **Monorepo Configuration**: pnpm workspace with turbo for build orchestration
- **Root Package**: Centralized scripts for dev, build, lint, and test
- **Shared Library**: Properly configured as workspace package with exports
- **Environment Examples**: .env.example files for both apps with NEXT_PUBLIC_API_URL

#### Portal Web
- **Landing Page**: Hero section with stats, news preview, and features
- **Authentication System**: Login, register, password reset pages
- **User Dashboard**: Account overview with cash balance, game accounts, and activity log
- **News System**: News listing and detail pages with categories
- **Item Shop**: Browse and purchase items
- **Rankings**: Top 100 characters and top 50 guilds leaderboards
- **Vote System**: Vote for rewards on multiple sites with cooldown tracking
- **Code Redemption**: Redeem promotional codes for rewards
- **Support System**: Create and view support tickets
- **Downloads**: Game client and launcher download page
- **Header Component**: Navigation with mobile menu and auth state
- **Footer Component**: Links and social media icons
- **UI Components**: Button, Input, Card, Dialog, Toast
- **API Client**: Axios-based client with JWT refresh token support
- **Theme Support**: Dark/light mode with system preference detection

#### Admin UI
- **Landing Page**: Admin login prompt
- **Dashboard**: Statistics overview with key metrics
- **User Management**: View and manage users
- **Ticket Management**: Support ticket system interface
- **Redeem Codes**: Code generation and management
- **News Management**: Create and edit news posts
- **Event Management**: Schedule and manage events
- **Audit Logs**: System activity monitoring
- **UI Components**: Shared components from portal
- **API Client**: Same authentication system as portal

#### Shared Library
- **UI Components**: Button, Input, Card, Dialog, Toast
- **Utilities**: cn() for class names, date formatters, truncate
- **API Client**: JWT authentication with refresh token handling
- **Types**: Comprehensive TypeScript interfaces for all entities
- **Hooks**: useAuth, useFetch, usePagination

#### Documentation
- **Frontend Architecture**: Complete system overview
- **Deployment Guide**: Multiple deployment options (Vercel, Docker, Custom)
- **Pages Overview**: Detailed description of all pages
- **README files**: Main repo, portal-web with installation instructions

#### Infrastructure
- **Next.js 15**: App Router with TypeScript
- **Tailwind CSS v4**: Custom theme with oklch colors
- **shadcn/ui**: Component library integration
- **Environment Config**: Example files with all variables
- **Build System**: Production-ready builds for both apps

### Technical Details

#### Dependencies
- next: 15.5.5
- react: 19.1.0
- typescript: 5.9.3
- tailwindcss: 4.1.14
- axios: 1.12.2
- zustand: 5.0.8
- react-hook-form: 7.65.0
- lucide-react: 0.545.0
- next-themes: 0.4.6
- @radix-ui/react-*: Multiple UI primitive packages

#### Project Structure
```
lc_apps/
├── portal-web/     # Player portal (3000)
├── admin-ui/       # Admin dashboard (3001)
├── shared/         # Shared library
└── docs/           # Documentation
```

### Development

#### Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

#### Environment Variables
- NEXT_PUBLIC_API_URL - Backend API URL
- NEXT_PUBLIC_APP_NAME - Application name
- NEXT_PUBLIC_ENV - Environment (development/production)
- NEXT_PUBLIC_DISCORD_CLIENT_ID - Discord OAuth
- NEXT_PUBLIC_RECAPTCHA_KEY - ReCaptcha site key

## [Unreleased]

### Planned Features

#### Portal Web
- Real-time server status via WebSocket/SSE
- Advanced search functionality
- Social features (friends, messaging)
- Guild directory and management
- Event calendar
- PvP leaderboards
- User profile customization
- Payment integration
- Progressive Web App (PWA)
- Internationalization (i18n)

#### Admin UI
- Dashboard with live statistics
- User management (ban, edit, view)
- Ticket management system
- News editor with markdown support
- Event planner and scheduler
- Code generator for redemption
- Audit log viewer
- Analytics and reports
- System settings
- Bulk operations

#### Shared
- Additional UI components (Table, Tabs, Select, etc.)
- Form validation schemas
- More custom hooks
- WebSocket client
- File upload utilities

#### Testing
- Unit tests for utilities
- Integration tests for API calls
- E2E tests for critical flows
- Component tests

#### Performance
- Image optimization
- Code splitting optimization
- Service worker for offline support
- Advanced caching strategies

---

## Version History

- **1.0.0** (2025-01-16) - Initial release with complete portal-web and basic admin-ui
- **0.1.0** (2025-01-16) - Project setup and structure

---

## Contributing

When adding new features:
1. Update this CHANGELOG with your changes
2. Follow the existing format
3. Include breaking changes in a separate section
4. Reference issue/PR numbers when applicable

## Links

- [Repository](https://github.com/evervibe/lc_apps)
- [Issues](https://github.com/evervibe/lc_apps/issues)
- [Documentation](./docs/)

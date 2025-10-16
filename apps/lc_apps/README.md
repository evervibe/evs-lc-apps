# LC Apps - LastChaos Portal & Admin Frontend System

Modern web applications for LastChaos MMORPG, built with Next.js 15, TypeScript, and Tailwind CSS.

## 📁 Project Structure

```
lc_apps/                  # Monorepo root
├── portal-web/           # Public player portal (Next.js app)
├── admin-ui/             # Admin dashboard (Next.js app)
├── shared/               # Shared library (@lc-apps/shared)
│   ├── ui/              # UI components
│   ├── hooks/           # React hooks
│   ├── lib/             # Utilities and API client
│   └── types/           # TypeScript types
├── docs/                # Documentation
├── package.json         # Root workspace configuration
├── pnpm-workspace.yaml  # pnpm workspace setup
└── turbo.json           # Turbo build orchestration
```

## 🚀 Features

### Portal Web
- **Authentication**: Login, register, 2FA support, password reset
- **User Dashboard**: Account overview, cash balance, game accounts
- **News System**: Latest updates and announcements
- **Item Shop**: Purchase in-game items and upgrades
- **Rankings**: Top 100 characters and guilds leaderboards
- **Vote System**: Vote for rewards on multiple sites
- **Code Redemption**: Redeem promotional codes
- **Support**: Create and manage support tickets
- **Downloads**: Game client and launcher downloads

### Admin UI
- (In development)
- User management
- Ticket management
- News editor
- Event planner
- Audit logs
- Statistics dashboard

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: pnpm (workspace)
- **Build Tool**: Turbo (monorepo orchestration)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios with JWT refresh

## 📦 Installation

### Prerequisites
- Node.js 20.x or later
- pnpm 10.x or later

### Setup

1. Clone the repository:
```bash
git clone https://github.com/evervibe/lc_apps.git
cd lc_apps
```

2. Install dependencies (all workspaces):
```bash
pnpm install
```

3. Copy environment files:
```bash
# Portal Web
cp portal-web/.env.example portal-web/.env

# Admin UI
cp admin-ui/.env.example admin-ui/.env
```

4. Update environment variables with your API URL and other settings.

## 🏃‍♂️ Running Development Servers

### All Apps (Recommended)
```bash
pnpm dev
```
This starts both portal-web (port 3000) and admin-ui (port 3001) concurrently.

- Portal Web: [http://localhost:3000](http://localhost:3000)
- Admin UI: [http://localhost:3001](http://localhost:3001)

### Individual Apps
```bash
# Portal Web only
cd portal-web && pnpm dev

# Admin UI only
cd admin-ui && pnpm dev
```

## 🏗 Building for Production

### All Apps
```bash
pnpm build
```

### Individual Apps
```bash
# Portal Web
cd portal-web
pnpm build
pnpm start

# Admin UI
cd admin-ui
pnpm build
pnpm start
```

## 🧪 Linting and Type Checking

```bash
# Run linting across all workspaces
pnpm lint

# Run type checking
pnpm type-check
```

## 📚 Documentation

- [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Component Library Guide](./docs/COMPONENT_LIBRARY_GUIDE.md) (Coming soon)
- [Environment Reference](./docs/ENV_REFERENCE.md) (Coming soon)

## 🔗 API Integration

The frontend connects to the LastChaos API backend. Configure the API URL in environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

API endpoints:
- Authentication: `/auth/*`
- Users: `/users/*`
- News: `/news/*`
- Market: `/market/*`
- Rankings: `/rankings/*`
- Votes: `/votes/*`
- Redeem: `/redeem/*`
- Support: `/tickets/*`

## 🎨 Customization

### Theme Colors
Edit `app/globals.css` to customize the color scheme:
```css
@theme {
  --color-primary: oklch(55% 0.21 263);
  --color-secondary: oklch(96% 0 0);
  /* ... */
}
```

### Components
All UI components are in `components/ui/` and can be customized:
- Button
- Input
- Card
- Dialog
- Toast

## 🧪 Testing and Quality

```bash
# Run linting across all workspaces
pnpm lint

# Run type checking
pnpm type-check

# Format code with Prettier
pnpm format

# Run all checks
pnpm build && pnpm lint && pnpm type-check
```

## 📄 License

This project is part of the LastChaos server infrastructure.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- GitHub Issues: [evervibe/lc_apps/issues](https://github.com/evervibe/lc_apps/issues)
- Discord: Join our community server

## 🎯 Roadmap

- [ ] Complete admin-ui implementation
- [ ] Real-time notifications via WebSocket
- [ ] Progressive Web App (PWA)
- [ ] Internationalization (i18n)
- [ ] Mobile app version
- [ ] Advanced search functionality
- [ ] Social features (friends, messaging)

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-16

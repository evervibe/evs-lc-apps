# LastChaos Portal Web

Public-facing portal for LastChaos players. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Landing Page**: Hero section, stats, latest news, and features showcase
- **Authentication**: Login, register, password reset, 2FA support
- **User Dashboard**: Account overview, cash balance, game accounts, activity log
- **News System**: Browse and read game updates and announcements
- **Item Shop**: Purchase in-game items and upgrades
- **Rankings**: View top 100 characters and top 50 guilds
- **Vote System**: Vote on multiple sites for cash rewards
- **Code Redemption**: Redeem promotional codes for rewards
- **Support Tickets**: Create and manage support tickets
- **Downloads**: Download game client and launcher

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Lucide React icons
- Zustand for state management
- React Hook Form
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Update .env with your settings
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=LastChaos Portal
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_DISCORD_CLIENT_ID=
NEXT_PUBLIC_RECAPTCHA_KEY=
```

### Development

```bash
# Run development server
pnpm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
pnpm run build

# Start production server
pnpm start
```

## Project Structure

```
portal-web/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Landing page
│   ├── auth/             # Auth pages (login, register, etc.)
│   ├── news/             # News pages
│   ├── market/           # Item shop
│   ├── rankings/         # Leaderboards
│   ├── vote/             # Vote system
│   ├── redeem/           # Code redemption
│   ├── downloads/        # Client downloads
│   ├── support/          # Support tickets
│   └── dashboard/        # User dashboard
├── components/
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components (Header, Footer)
├── lib/
│   ├── api.ts          # API client with JWT refresh
│   └── utils.ts        # Utility functions
└── hooks/              # Custom React hooks
```

## Pages

### Public Pages
- `/` - Landing page
- `/news` - News listing
- `/news/[id]` - Individual news article
- `/market` - Item shop
- `/rankings` - Character and guild rankings
- `/vote` - Vote for rewards
- `/downloads` - Download client
- `/auth/login` - Login
- `/auth/register` - Register

### Protected Pages (Login Required)
- `/dashboard` - User dashboard
- `/redeem` - Code redemption
- `/support/tickets` - Support tickets

## Components

### UI Components (shadcn/ui)
- Button
- Input
- Card
- Dialog
- Toast

### Layout Components
- Header - Navigation with auth status
- Footer - Links and social media

## API Integration

The portal connects to the LastChaos API backend:

```typescript
import apiClient from "@/lib/api";

// Example: Login
const response = await apiClient.post("/auth/login", {
  username,
  password,
});

// JWT tokens are automatically handled
```

## Styling

Uses Tailwind CSS v4 with custom theme:
- Light/Dark mode support via next-themes
- Custom color palette
- Responsive design
- Utility-first approach

## State Management

### Authentication (Zustand)

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, login, logout } = useAuth();
```

## Development

### Linting

```bash
pnpm run lint
```

### Type Checking

```bash
pnpm run type-check
```

## Deployment

See [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Vercel

```bash
vercel --prod
```

## License

Part of the LastChaos server infrastructure.

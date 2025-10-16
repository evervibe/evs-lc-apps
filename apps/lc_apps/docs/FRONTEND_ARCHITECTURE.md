# Frontend Architecture

## Overview

The LC Apps frontend system consists of three main components:
1. **portal-web** - Public-facing portal for players
2. **admin-ui** - Administrative dashboard for moderators and admins
3. **shared** - Shared library with common components, hooks, and types

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT refresh token support

## Project Structure

```
lc_apps/
├── portal-web/              # Player portal application
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx      # Root layout with header/footer
│   │   ├── page.tsx        # Landing page
│   │   ├── auth/           # Authentication pages
│   │   ├── news/           # News pages
│   │   ├── market/         # Item shop
│   │   ├── rankings/       # Leaderboards
│   │   ├── vote/           # Vote for rewards
│   │   ├── redeem/         # Code redemption
│   │   ├── downloads/      # Client downloads
│   │   ├── support/        # Support tickets
│   │   └── dashboard/      # User dashboard
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities and API client
│   └── hooks/             # Custom React hooks
│
├── admin-ui/               # Admin dashboard application
│   ├── app/               # Next.js app directory
│   ├── components/        # UI components
│   ├── lib/              # Utilities
│   └── hooks/            # Custom hooks
│
└── shared/                # Shared library
    ├── ui/               # Shared UI components
    ├── lib/             # Shared utilities
    ├── hooks/           # Shared hooks
    ├── types/           # TypeScript types
    └── assets/          # Shared assets
```

## Key Features

### Portal Web

1. **Authentication System**
   - Login with 2FA support
   - Registration with validation
   - Password reset
   - JWT-based authentication with refresh tokens

2. **User Dashboard**
   - Cash balance display
   - Game accounts management
   - Recent activity log
   - Statistics overview

3. **News System**
   - News listing with pagination
   - Individual news article pages
   - Category filtering
   - Search functionality (planned)

4. **Rankings**
   - Top 100 characters
   - Top 50 guilds
   - Real-time updates
   - Filterable by class/level

5. **Item Shop**
   - Browse purchasable items
   - Category filtering
   - Shopping cart (planned)
   - Purchase history

6. **Vote System**
   - Multiple vote sites
   - Cooldown tracking
   - Automatic rewards
   - Vote history

7. **Code Redemption**
   - Promotional code system
   - One-time use codes
   - Multiple reward types
   - Redemption history

8. **Support System**
   - Ticket creation
   - Ticket status tracking
   - Priority levels
   - Reply system (planned)

### Admin UI

(To be implemented)
- User management
- Ticket management
- News editor
- Event planner
- Audit log viewer
- Statistics dashboard

## API Integration

### API Client (`lib/api.ts`)

The API client is built on Axios and includes:
- Automatic JWT token injection
- Refresh token handling
- Request/response interceptors
- Error handling
- TypeScript support

```typescript
import apiClient from "@/lib/api";

// GET request
const users = await apiClient.get("/users");

// POST request
const response = await apiClient.post("/auth/login", credentials);

// PUT request
await apiClient.put("/users/123", userData);

// DELETE request
await apiClient.delete("/users/123");
```

### Authentication Flow

1. User logs in with credentials
2. Server returns access_token and refresh_token
3. Tokens stored in localStorage
4. Access token sent with each request
5. On 401 error, refresh token used to get new access token
6. If refresh fails, user redirected to login

## State Management

### Zustand Store (useAuth)

```typescript
import { useAuth } from "@/hooks/useAuth";

function Component() {
  const { user, login, logout } = useAuth();
  
  // Access user data
  console.log(user);
  
  // Login
  await login({ username, password });
  
  // Logout
  logout();
}
```

## Styling

### Tailwind CSS v4

The project uses Tailwind CSS v4 with custom theme configuration:

- Custom color palette for light/dark modes
- Responsive breakpoints
- Custom components via shadcn/ui
- Utility-first approach

### Dark Mode

Dark mode is implemented using `next-themes`:
- System preference detection
- Manual toggle
- Persistent preference

## Component Library

### shadcn/ui Components

All UI components are based on shadcn/ui:
- Button
- Input
- Card
- Dialog
- Toast
- Select
- Dropdown
- Tooltip

Components are located in `components/ui/` and can be customized as needed.

## Performance Optimization

- Static page generation where possible
- Image optimization with Next.js Image
- Code splitting via dynamic imports
- Lazy loading of components
- Memoization of expensive calculations

## SEO

- Next.js metadata API
- Dynamic meta tags per page
- Open Graph tags
- Sitemap generation (planned)
- Robots.txt

## Security

- XSS protection via React
- CSRF tokens (planned)
- Input sanitization
- Secure cookie handling
- Rate limiting (API level)

## Best Practices

1. **Code Organization**
   - Keep components small and focused
   - Use custom hooks for logic reuse
   - Separate business logic from UI

2. **TypeScript**
   - Use strict mode
   - Define interfaces for all data structures
   - Avoid `any` type

3. **Error Handling**
   - Use try-catch blocks
   - Display user-friendly error messages
   - Log errors for debugging

4. **Testing**
   - Unit tests for utilities
   - Integration tests for API calls
   - E2E tests for critical flows (planned)

## Future Improvements

- [ ] Real-time updates via WebSocket
- [ ] Progressive Web App (PWA)
- [ ] Internationalization (i18n)
- [ ] Advanced search functionality
- [ ] Social features (friend list, messaging)
- [ ] Payment integration
- [ ] Mobile app version

# MASTER INTEGRATION PLAN: LC_WEBSITE_NEXT → EVS-LC-APPS

**Version:** 1.0.0  
**Date:** 2025-10-16  
**Status:** Integration Blueprint  
**Repository:** evs-lc-apps  
**Reference Document:** LC_WEBSITE_NEXT_ANALYSIS.md  

---

## Executive Summary

This document serves as the **master integration blueprint** for transferring the complete architecture, best practices, UI/UX patterns, and technical improvements from `lc_website_next` into the active production repository `evs-lc-apps`.

**Core Objective:** Transform `evs-lc-apps` into a production-ready, feature-complete, and optimized Last Chaos portal by adopting proven patterns from `lc_website_next` while strictly adhering to the existing conventions and standards of `evs-lc-apps`.

### Reference Documentation

All technical details, architecture analysis, component specifications, and improvement recommendations are documented in:
- **`LC_WEBSITE_NEXT_ANALYSIS.md`** (see internal documentation or reference repository)

This master document provides the **integration strategy** and **implementation roadmap** for applying those findings to `evs-lc-apps`.

---

## 1. Current State Analysis

### 1.1 EVS-LC-APPS Repository Structure

```
evs-lc-apps/
├── apps/
│   ├── lc_api/              # Backend (NestJS, PostgreSQL, MySQL)
│   │   └── api-server/      # REST API with JWT + TOTP 2FA
│   └── lc_apps/             # Frontend Applications
│       ├── web-portal/      # Public Portal (Next.js 15, Tailwind v4)
│       ├── web-admin/       # Admin Dashboard (Next.js 15)
│       └── shared/          # Shared Components & Utilities
├── docs/                    # Comprehensive Documentation
├── turbo.json               # Turbo Build Configuration
├── pnpm-workspace.yaml      # Workspace Definition
└── tsconfig.base.json       # Base TypeScript Config
```

### 1.2 Current Technology Stack

| Category | Technology | Version | Status |
|----------|-----------|---------|--------|
| **Monorepo** | pnpm + Turbo | 10.18.3 + 2.x | ✅ |
| **Frontend** | Next.js | 15.5.5 | ✅ |
| **React** | React | 19.1.0 | ✅ |
| **TypeScript** | TypeScript | 5.9.3 | ✅ |
| **Styling** | Tailwind CSS | v4 | ✅ |
| **UI Components** | shadcn/ui + Radix UI | Latest | ✅ |
| **State** | Zustand | 5.0.8 | ✅ |
| **Forms** | React Hook Form | 7.65.0 | ✅ |
| **Backend** | NestJS | 10.3+ | ✅ |
| **Database** | PostgreSQL + MySQL | 16+ / 8.0+ | ✅ |
| **Auth** | JWT + TOTP | - | ✅ |

### 1.3 Existing Features (✅ = Complete)

**Web Portal (apps/lc_apps/web-portal):**
- ✅ Landing page with hero section
- ✅ User authentication (Login/Register)
- ✅ Dashboard structure
- ✅ News system
- ✅ Rankings display
- ✅ Downloads page
- ✅ Support ticket system
- ✅ Vote rewards
- ✅ Code redemption
- ✅ Market/Shop structure
- ⚠️ MFA UI (Backend ready, Frontend pending)
- ⚠️ Password reset UI (Backend ready, Frontend pending)
- ⚠️ Security settings UI (Backend ready, Frontend pending)

**Web Admin (apps/lc_apps/web-admin):**
- ⚠️ Basic structure in place
- ⚠️ Full implementation pending

**Backend API (apps/lc_api):**
- ✅ Complete REST API
- ✅ Authentication with JWT + TOTP 2FA
- ✅ User management
- ✅ Ticket system
- ✅ Payment processing
- ✅ Item shop backend
- ✅ Rankings calculation
- ✅ Audit logging

---

## 2. Integration Strategy

### 2.1 Core Principles

1. **Respect Existing Conventions**: All changes must align with `evs-lc-apps` standards
2. **Minimal Disruption**: Integrate without breaking existing functionality
3. **Feature Parity**: Achieve all features documented in LC_WEBSITE_NEXT_ANALYSIS.md
4. **Production Ready**: Focus on production-grade quality, security, and performance
5. **Documentation First**: Document changes as they are implemented

### 2.2 Integration Approach

**Phase 1: Foundation Enhancement** (Priority: HIGH)
- Enhance component library with missing UI components
- Implement authentication middleware
- Add environment validation
- Setup CI/CD pipeline
- Add error boundaries

**Phase 2: Security & Authentication** (Priority: HIGH)
- Implement MFA setup UI
- Build password reset flow UI
- Create security settings page
- Add backup codes management UI
- Implement audit log viewer

**Phase 3: Performance & Optimization** (Priority: MEDIUM)
- Bundle analysis and optimization
- Image optimization with next/image
- Dynamic imports for heavy components
- Font optimization
- Lighthouse CI integration

**Phase 4: Developer Experience** (Priority: MEDIUM)
- Enhanced development tooling
- Storybook for component documentation
- Improved testing infrastructure
- Better error logging

**Phase 5: Advanced Features** (Priority: LOW)
- Admin dashboard completion
- Internationalization (i18n)
- PWA features
- OAuth providers integration
- Real-time features (WebSocket)

---

## 3. Detailed Integration Plan

### 3.1 UI/UX Component System

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 4 & 5

**Current State:**
- Basic components in `apps/lc_apps/web-portal/components/`
- Shared components in `apps/lc_apps/shared/ui/`
- Uses shadcn/ui + Radix UI

**Integration Tasks:**

#### 3.1.1 Enhance Component Library
```
Target: apps/lc_apps/shared/ui/
```

**Missing Components to Add:**
- [ ] **Form Components**
  - Input variants (text, email, password, number)
  - Textarea with character counter
  - Select/Dropdown with search
  - Checkbox and Radio groups
  - Switch/Toggle
  - Date/Time pickers
  
- [ ] **Feedback Components**
  - Loading spinner variants
  - Skeleton loaders
  - Progress bars
  - Toast notifications (enhanced)
  - Alert/Banner components
  
- [ ] **Layout Components**
  - Container with responsive max-width
  - Grid system wrapper
  - Card variants (default, bordered, elevated)
  - Modal/Dialog variants
  - Drawer/Sidebar
  
- [ ] **Navigation Components**
  - Breadcrumbs
  - Pagination
  - Tabs component
  - Stepper (multi-step forms)
  
- [ ] **Data Display**
  - Table with sorting/filtering
  - Badge variants
  - Avatar with fallback
  - Stat cards
  - Empty states

**Implementation Approach:**
1. Use shadcn/ui CLI to add missing components
2. Extend with custom variants matching LC design system
3. Document each component with usage examples
4. Create stories for Storybook (Phase 4)

**File Locations:**
```
apps/lc_apps/shared/ui/
├── form/
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   └── switch.tsx
├── feedback/
│   ├── loading-spinner.tsx
│   ├── skeleton.tsx
│   ├── progress.tsx
│   └── alert.tsx
├── layout/
│   ├── container.tsx
│   ├── card.tsx
│   ├── modal.tsx
│   └── drawer.tsx
├── navigation/
│   ├── breadcrumbs.tsx
│   ├── pagination.tsx
│   ├── tabs.tsx
│   └── stepper.tsx
└── data/
    ├── table.tsx
    ├── badge.tsx
    ├── avatar.tsx
    └── stat-card.tsx
```

#### 3.1.2 Design System Enhancement

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 5.1-5.3

**Current State:**
- Tailwind CSS v4 with `@theme` inline configuration
- CSS variables defined in `globals.css`
- Dark mode support via `next-themes`

**Tasks:**
- [ ] Review and enhance color palette
- [ ] Define typography scale
- [ ] Define spacing/sizing scale
- [ ] Add animation utilities
- [ ] Document design tokens

**Enhanced globals.css Structure:**
```css
@import "tailwindcss";

@theme {
  /* Color Palette - Light Mode Base */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(15% 0 0);
  --color-primary: oklch(55% 0.21 263);
  --color-primary-foreground: oklch(98% 0 0);
  
  /* Game-Specific Colors */
  --color-game-gold: oklch(75% 0.15 85);
  --color-game-rare: oklch(60% 0.20 280);
  --color-game-epic: oklch(55% 0.20 320);
  --color-game-legendary: oklch(70% 0.25 50);
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-mono: 'Courier New', monospace;
  
  /* Spacing & Layout */
  --radius-sm: 0.25rem;
  --radius-base: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark Mode Overrides */
.dark {
  --color-background: oklch(10% 0 0);
  --color-foreground: oklch(98% 0 0);
  /* ... other dark mode colors */
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Custom Animations for Hero/Landing */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

#### 3.1.3 Layout System

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 4.1

**Current Implementation:**
```tsx
// apps/lc_apps/web-portal/app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <body className="min-h-screen flex flex-col">
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ThemeProvider>
  </body>
</html>
```

**Enhancements to Add:**
- [ ] Auth layout variant (centered forms, no header/footer)
- [ ] Dashboard layout variant (with sidebar)
- [ ] Admin layout variant (with admin sidebar)
- [ ] Error layout (for error pages)

**New Layouts to Create:**
```
apps/lc_apps/web-portal/components/layout/
├── AuthLayout.tsx        # For login/register pages
├── DashboardLayout.tsx   # For user dashboard
└── ErrorLayout.tsx       # For error pages
```

### 3.2 Authentication & Security Features

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 7.2

**Priority:** HIGH (Production-Critical)

#### 3.2.1 Authentication Middleware

**File:** `apps/lc_apps/web-portal/middleware.ts` (Create)

```typescript
// Protect authenticated routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/account',
    '/market',
    '/vote',
    '/redeem',
    '/support'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  
  if (isProtectedRoute && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Tasks:**
- [ ] Create middleware.ts
- [ ] Implement token validation
- [ ] Add redirect logic
- [ ] Test protected route access
- [ ] Document middleware behavior

#### 3.2.2 MFA Setup UI

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md - Backend MFA implementation exists

**New Page:** `apps/lc_apps/web-portal/app/account/security/page.tsx`

**Components to Create:**
```
apps/lc_apps/web-portal/components/security/
├── MFASetupWizard.tsx     # Multi-step MFA setup
├── QRCodeDisplay.tsx      # Display QR code for authenticator
├── TOTPVerifyInput.tsx    # 6-digit code input
├── BackupCodesDisplay.tsx # Show backup codes (one-time)
├── MFAStatus.tsx          # Current MFA status badge
└── DisableMFAModal.tsx    # Confirm disable dialog
```

**Features:**
- [ ] Step 1: Explain MFA benefits
- [ ] Step 2: Display QR code + manual entry key
- [ ] Step 3: Verify TOTP code
- [ ] Step 4: Display backup codes (download/copy)
- [ ] Step 5: Confirmation
- [ ] Disable MFA flow with password verification
- [ ] Recovery via backup codes

**API Integration:**
```typescript
// apps/lc_apps/shared/lib/api-client.ts
export const securityAPI = {
  // MFA Setup
  setupMFA: () => axios.post('/api/mfa/setup'),
  verifyMFA: (code: string) => axios.post('/api/mfa/verify', { code }),
  disableMFA: (password: string) => axios.post('/api/mfa/disable', { password }),
  
  // Backup Codes
  getBackupCodes: () => axios.get('/api/mfa/backup-codes'),
  regenerateBackupCodes: () => axios.post('/api/mfa/backup-codes/regenerate'),
};
```

#### 3.2.3 Password Reset Flow UI

**New Pages:**
```
apps/lc_apps/web-portal/app/auth/
├── forgot-password/
│   └── page.tsx          # Request reset token
└── reset-password/
    └── page.tsx          # Reset with token
```

**Components:**
```
apps/lc_apps/web-portal/components/auth/
├── ForgotPasswordForm.tsx
├── ResetPasswordForm.tsx
└── PasswordStrengthMeter.tsx
```

**Features:**
- [ ] Email input for password reset request
- [ ] Token validation
- [ ] New password input with strength meter
- [ ] Password confirmation
- [ ] Success/error messaging
- [ ] Auto-redirect after success

#### 3.2.4 Security Settings Page

**Page:** `apps/lc_apps/web-portal/app/account/security/page.tsx`

**Sections:**
- [ ] **Password Management**
  - Change password form
  - Password strength requirements
  - Last changed date
  
- [ ] **Two-Factor Authentication**
  - Enable/Disable toggle
  - Setup wizard button
  - Backup codes management
  
- [ ] **Security History**
  - Recent login attempts
  - Device/location tracking
  - Audit log viewer
  
- [ ] **Active Sessions**
  - List of active sessions
  - Logout from specific devices
  - Logout from all devices

### 3.3 API Client Architecture

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 8.4 (Recommendation #14)

**Current State:**
- Individual API calls scattered across components
- Using axios directly

**Target State:**
- Centralized API client with organized endpoints
- Type-safe request/response handling
- Error handling middleware
- Loading state management

**Implementation:**

**File:** `apps/lc_apps/shared/lib/api-client.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class APIClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Request interceptor (add auth token)
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Response interceptor (error handling)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Auth endpoints
  auth = {
    login: (credentials: LoginDto) => 
      this.client.post('/auth/login', credentials),
    register: (data: RegisterDto) => 
      this.client.post('/auth/register', data),
    logout: () => 
      this.client.post('/auth/logout'),
    refresh: () => 
      this.client.post('/auth/refresh'),
    requestPasswordReset: (email: string) =>
      this.client.post('/auth/request-reset', { email }),
    resetPassword: (token: string, password: string) =>
      this.client.post('/auth/reset-password', { token, password }),
  };
  
  // MFA endpoints
  mfa = {
    setup: () => this.client.post('/mfa/setup'),
    verify: (code: string) => this.client.post('/mfa/verify', { code }),
    disable: (password: string) => this.client.post('/mfa/disable', { password }),
    getBackupCodes: () => this.client.get('/mfa/backup-codes'),
    regenerateBackupCodes: () => this.client.post('/mfa/backup-codes/regenerate'),
  };
  
  // User/Account endpoints
  account = {
    getProfile: () => this.client.get('/account/profile'),
    updateProfile: (data: UpdateProfileDto) => 
      this.client.put('/account/profile', data),
    changePassword: (data: ChangePasswordDto) =>
      this.client.post('/account/change-password', data),
    getSecurityHistory: () => 
      this.client.get('/account/security-history'),
    getSessions: () => 
      this.client.get('/account/sessions'),
    terminateSession: (sessionId: string) =>
      this.client.delete(`/account/sessions/${sessionId}`),
  };
  
  // Shop endpoints
  shop = {
    getProducts: () => this.client.get('/shop/products'),
    getProduct: (id: string) => this.client.get(`/shop/products/${id}`),
    checkout: (data: CheckoutDto) => this.client.post('/shop/checkout', data),
  };
  
  // News endpoints
  news = {
    getAll: (page = 1, limit = 10) => 
      this.client.get('/news', { params: { page, limit } }),
    getBySlug: (slug: string) => 
      this.client.get(`/news/${slug}`),
  };
  
  // Rankings endpoints
  rankings = {
    getCharacters: (limit = 100) =>
      this.client.get('/rankings/characters', { params: { limit } }),
    getGuilds: (limit = 100) =>
      this.client.get('/rankings/guilds', { params: { limit } }),
  };
  
  // Vote endpoints
  vote = {
    getSites: () => this.client.get('/vote/sites'),
    recordVote: (siteId: string) => this.client.post('/vote/record', { siteId }),
    getRewards: () => this.client.get('/vote/rewards'),
  };
  
  // Support tickets
  tickets = {
    getAll: () => this.client.get('/tickets'),
    get: (id: string) => this.client.get(`/tickets/${id}`),
    create: (data: CreateTicketDto) => this.client.post('/tickets', data),
    reply: (id: string, message: string) => 
      this.client.post(`/tickets/${id}/reply`, { message }),
    close: (id: string) => this.client.post(`/tickets/${id}/close`),
  };
}

export const api = new APIClient();
export default api;
```

**TypeScript Types File:** `apps/lc_apps/shared/types/api.ts`

```typescript
// Authentication
export interface LoginDto {
  email: string;
  password: string;
  totpCode?: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Shop
export interface CheckoutDto {
  productId: string;
  quantity: number;
  paymentMethod: 'paypal' | 'stripe';
}

// Tickets
export interface CreateTicketDto {
  subject: string;
  category: string;
  message: string;
}

// Add more types as needed...
```

**Tasks:**
- [ ] Create api-client.ts with organized endpoints
- [ ] Create api.ts type definitions
- [ ] Add request/response interceptors
- [ ] Implement error handling
- [ ] Add loading state management
- [ ] Update all components to use new API client
- [ ] Document API client usage

### 3.4 State Management Strategy

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 4.3

**Current State:**
- Zustand installed but minimal usage
- Local state with useState in components

**Enhancement Strategy:**

**Global Stores to Create:**

```typescript
// apps/lc_apps/shared/lib/stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  mfaEnabled: boolean;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => {
        localStorage.setItem('auth-token', token);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('auth-token');
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
    }),
    { name: 'auth-storage' }
  )
);
```

```typescript
// apps/lc_apps/shared/lib/stores/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.productId === item.productId);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            total: state.total + (item.price * item.quantity)
          };
        }
        return {
          items: [...state.items, item],
          total: state.total + (item.price * item.quantity)
        };
      }),
      removeItem: (productId) => set((state) => {
        const item = state.items.find(i => i.productId === productId);
        return {
          items: state.items.filter(i => i.productId !== productId),
          total: state.total - (item ? item.price * item.quantity : 0)
        };
      }),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        ),
        total: state.items.reduce((sum, i) =>
          sum + (i.productId === productId ? i.price * quantity : i.price * i.quantity),
          0
        )
      })),
      clearCart: () => set({ items: [], total: 0 }),
    }),
    { name: 'cart-storage' }
  )
);
```

**Tasks:**
- [ ] Create auth-store.ts
- [ ] Create cart-store.ts
- [ ] Create ui-store.ts (for modals, toasts, etc.)
- [ ] Update components to use stores
- [ ] Document store usage patterns

### 3.5 Environment Validation

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 8.1 (Recommendation #4)

**File:** `apps/lc_apps/shared/lib/env.ts` (Create)

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  
  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().default('false'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    });
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

export const env = validateEnv();
```

**Usage:**
```typescript
// In any file
import { env } from '@lc-apps/shared/lib/env';

const apiUrl = env.NEXT_PUBLIC_API_URL;
```

**Tasks:**
- [ ] Create env.ts with Zod validation
- [ ] Update .env.example with all required variables
- [ ] Add validation to startup
- [ ] Document environment variables

### 3.6 Error Boundaries

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 8.1 (Recommendation #3)

**File:** `apps/lc_apps/shared/ui/error-boundary.tsx` (Create)

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage in Layout:**
```tsx
// apps/lc_apps/web-portal/app/layout.tsx
import { ErrorBoundary } from '@lc-apps/shared/ui/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Tasks:**
- [ ] Create ErrorBoundary component
- [ ] Add to root layout
- [ ] Add to critical page sections
- [ ] Integrate error tracking service
- [ ] Create custom error pages

### 3.7 CI/CD Pipeline

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 8.1 (Recommendation #1)

**File:** `.github/workflows/ci.yml` (Create)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run ESLint
        run: pnpm lint
      
      - name: Run TypeScript check
        run: pnpm type-check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    name: Build Applications
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build all apps
        run: pnpm build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            apps/*/dist
            apps/*/.next

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build portal
        run: cd apps/lc_apps/web-portal && pnpm build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
          uploadArtifacts: true
          temporaryPublicStorage: true
```

**Additional Workflow:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to production
        run: |
          # Add your deployment script here
          # Examples: rsync, docker push, vercel deploy, etc.
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

**Tasks:**
- [ ] Create CI workflow
- [ ] Create deployment workflow
- [ ] Setup GitHub secrets
- [ ] Configure Lighthouse CI
- [ ] Add status badges to README
- [ ] Document deployment process

### 3.8 Performance Optimizations

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 7.1 & 8.5

#### 3.8.1 Image Optimization

**Current State:** Not using next/image consistently

**Tasks:**
- [ ] Replace all `<img>` tags with `<Image>` from next/image
- [ ] Configure image domains in next.config.ts
- [ ] Optimize hero images
- [ ] Add placeholder blur images
- [ ] Implement responsive images

**Example Migration:**
```tsx
// Before
<img src="/hero.jpg" alt="Hero" />

// After
import Image from 'next/image';
<Image 
  src="/hero.jpg" 
  alt="Hero" 
  width={1920} 
  height={1080}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### 3.8.2 Dynamic Imports

**Components to Lazy Load:**
- Admin dashboard components
- Chart.js components
- Heavy modals/dialogs
- Video players
- Rich text editors

**Example:**
```tsx
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard'),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
);
```

**Tasks:**
- [ ] Identify heavy components (>100KB)
- [ ] Implement dynamic imports
- [ ] Add loading states
- [ ] Test lazy loading behavior

#### 3.8.3 Font Optimization

**File:** Update `apps/lc_apps/web-portal/app/layout.tsx`

```tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Update CSS:**
```css
@theme {
  --font-sans: var(--font-sans), -apple-system, BlinkMacSystemFont;
  --font-mono: var(--font-mono), 'Courier New', monospace;
}
```

**Tasks:**
- [ ] Configure Google Fonts
- [ ] Add font preloading
- [ ] Update CSS variables
- [ ] Test font loading performance

#### 3.8.4 Bundle Analysis

**File:** Update `apps/lc_apps/web-portal/next.config.ts`

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  // ... existing config
  
  webpack: (config, { isServer }) => {
    // Bundle analyzer (only in development)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    return config;
  },
};

export default config;
```

**Add Script to package.json:**
```json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

**Tasks:**
- [ ] Install webpack-bundle-analyzer
- [ ] Configure bundle analysis
- [ ] Run initial analysis
- [ ] Identify optimization opportunities
- [ ] Document findings

---

## 4. Testing Strategy

### 4.1 Unit Testing

**Reference:** LC_WEBSITE_NEXT_ANALYSIS.md Section 6.5

**Current State:** Basic tests needed

**Framework:** Vitest (already in use in lc_website_next)

**Setup:**
```bash
cd apps/lc_apps/web-portal
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
```

**Config:** `apps/lc_apps/web-portal/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Tests to Create:**
```
apps/lc_apps/web-portal/__tests__/
├── components/
│   ├── Header.test.tsx
│   ├── Footer.test.tsx
│   └── ui/
│       ├── Button.test.tsx
│       └── Input.test.tsx
├── lib/
│   ├── api-client.test.ts
│   ├── env.test.ts
│   └── stores/
│       ├── auth-store.test.ts
│       └── cart-store.test.ts
└── utils/
    └── format.test.ts
```

**Tasks:**
- [ ] Setup Vitest
- [ ] Create test utilities
- [ ] Write component tests
- [ ] Write store tests
- [ ] Write utility tests
- [ ] Achieve 80%+ coverage

### 4.2 E2E Testing

**Framework:** Playwright (already in use in lc_website_next)

**Setup:**
```bash
cd apps/lc_apps/web-portal
pnpm add -D @playwright/test
pnpm exec playwright install
```

**Config:** `apps/lc_apps/web-portal/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**E2E Tests to Create:**
```
apps/lc_apps/web-portal/e2e/
├── auth/
│   ├── login.spec.ts
│   ├── register.spec.ts
│   ├── password-reset.spec.ts
│   └── mfa-setup.spec.ts
├── dashboard/
│   ├── overview.spec.ts
│   └── security-settings.spec.ts
├── shop/
│   ├── browse.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
└── public/
    ├── news.spec.ts
    └── rankings.spec.ts
```

**Tasks:**
- [ ] Setup Playwright
- [ ] Create auth flow tests
- [ ] Create dashboard tests
- [ ] Create shop tests
- [ ] Create public page tests
- [ ] Run tests in CI

---

## 5. Documentation Requirements

### 5.1 Integration Report

**File:** `docs/LC_WEBSITE_NEXT_INTEGRATION_REPORT.md` (Create after completion)

**Contents:**
- Summary of changes
- Architecture improvements
- Component additions
- Performance benchmarks (before/after)
- Security enhancements
- Known issues
- Future recommendations

### 5.2 Component Documentation

**File:** `docs/COMPONENT_LIBRARY.md` (Create)

**Contents:**
- Complete component catalog
- Usage examples
- Props documentation
- Accessibility notes
- Design variants

### 5.3 API Client Documentation

**File:** `docs/API_CLIENT_GUIDE.md` (Create)

**Contents:**
- API client architecture
- Endpoint reference
- Authentication handling
- Error handling
- Usage examples
- TypeScript types

### 5.4 Migration Log

**File:** `docs/LC_WEBSITE_MIGRATION_LOG.md` (Create during process)

**Contents:**
- Date-stamped log of changes
- Files modified
- Features added
- Breaking changes
- Rollback procedures

---

## 6. Implementation Timeline

### Phase 1: Foundation (Week 1-2) - HIGH PRIORITY
- [x] Fix turbo.json configuration
- [ ] Environment validation (env.ts)
- [ ] Error boundaries
- [ ] Authentication middleware
- [ ] API client refactor
- [ ] State management setup (stores)
- [ ] CI/CD pipeline setup

### Phase 2: Security & Auth UI (Week 2-3) - HIGH PRIORITY
- [ ] MFA setup wizard UI
- [ ] Password reset flow UI
- [ ] Security settings page
- [ ] Backup codes management
- [ ] Active sessions viewer
- [ ] Security audit log viewer

### Phase 3: Component Library Enhancement (Week 3-4) - MEDIUM PRIORITY
- [ ] Add missing form components
- [ ] Add feedback components
- [ ] Add layout components
- [ ] Add navigation components
- [ ] Add data display components
- [ ] Component documentation

### Phase 4: Performance & Optimization (Week 4-5) - MEDIUM PRIORITY
- [ ] Image optimization
- [ ] Dynamic imports
- [ ] Font optimization
- [ ] Bundle analysis
- [ ] Lighthouse CI
- [ ] Performance benchmarks

### Phase 5: Testing & Quality (Week 5-6) - MEDIUM PRIORITY
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Coverage reports
- [ ] Test documentation

### Phase 6: Documentation & Polish (Week 6-7) - LOW PRIORITY
- [ ] Integration report
- [ ] Component library docs
- [ ] API client guide
- [ ] Migration log
- [ ] Update main README

### Phase 7: Advanced Features (Week 7+) - LOW PRIORITY
- [ ] Admin dashboard completion
- [ ] Storybook setup
- [ ] i18n support
- [ ] PWA features
- [ ] OAuth providers

---

## 7. Validation Checklist

### Pre-Deployment Validation

**Build & Compile:**
- [ ] `pnpm install` succeeds
- [ ] `pnpm lint` passes without errors
- [ ] `pnpm type-check` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] No console errors in development

**Functionality:**
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] MFA setup/disable works
- [ ] Password reset works
- [ ] Protected routes enforce auth
- [ ] API client handles errors
- [ ] State persists correctly
- [ ] Dark/light mode works

**Performance:**
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 95 (Accessibility)
- [ ] Lighthouse score > 95 (Best Practices)
- [ ] Lighthouse score > 90 (SEO)
- [ ] Bundle size < 300KB (initial)
- [ ] Time to Interactive < 3s

**Security:**
- [ ] All endpoints require authentication
- [ ] CSRF protection enabled
- [ ] XSS protection enabled
- [ ] CSP headers configured
- [ ] HTTPS enforced in production
- [ ] Secrets not in code
- [ ] Environment variables validated

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast ratio > 4.5:1
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Form labels associated

---

## 8. Rollback Plan

In case of issues during integration:

### Immediate Rollback (< 1 hour)
1. Revert last commit: `git revert HEAD`
2. Push revert: `git push`
3. Redeploy previous version

### Partial Rollback (1-4 hours)
1. Identify problematic feature
2. Create hotfix branch
3. Remove/disable specific feature
4. Test and redeploy

### Full Rollback (4+ hours)
1. Revert to previous stable tag
2. Analyze root cause
3. Create fix in separate branch
4. Re-test before merge

---

## 9. Success Metrics

### Technical Metrics
- ✅ All builds pass
- ✅ Zero linting errors
- ✅ Zero TypeScript errors
- ✅ 80%+ test coverage
- ✅ Lighthouse score > 90
- ✅ Bundle size < 300KB

### Feature Metrics
- ✅ MFA setup/disable functional
- ✅ Password reset functional
- ✅ All security features working
- ✅ Protected routes enforced
- ✅ Error handling graceful
- ✅ State management reliable

### User Experience Metrics
- ✅ Page load < 2s
- ✅ Time to Interactive < 3s
- ✅ No layout shift (CLS < 0.1)
- ✅ Smooth animations (60fps)
- ✅ Responsive on all devices
- ✅ Accessible (WCAG 2.1 AA)

---

## 10. Support & Contact

### Documentation References
- Main README: `/README.md`
- Architecture: `/docs/ARCHITECTURE.md`
- Frontend Guide: `/docs/FRONTEND_GUIDE.md`
- Security Policy: `/docs/SECURITY_POLICY.md`
- Original Analysis: `LC_WEBSITE_NEXT_ANALYSIS.md` (reference document)

### Team Contacts
- Lead Developer: [contact info]
- DevOps: [contact info]
- Security: [contact info]

---

## Appendix A: Quick Reference Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm dev --filter=web-portal  # Start specific app

# Building
pnpm build                  # Build all apps
pnpm lint                   # Lint all code
pnpm type-check            # TypeScript check
pnpm test                  # Run all tests

# Testing
pnpm test:unit             # Unit tests
pnpm test:e2e              # E2E tests
pnpm test:coverage         # Coverage report

# Analysis
pnpm analyze               # Bundle analysis
pnpm lighthouse            # Lighthouse audit

# Deployment
pnpm build:production      # Production build
pnpm deploy                # Deploy to production
```

---

## Appendix B: File Structure Reference

```
evs-lc-apps/
├── apps/
│   └── lc_apps/
│       ├── web-portal/              # Main portal app
│       │   ├── app/                 # Next.js pages
│       │   │   ├── auth/            # Auth pages (login, register, reset)
│       │   │   ├── dashboard/       # User dashboard
│       │   │   ├── account/         # Account settings
│       │   │   │   └── security/    # Security settings (NEW)
│       │   │   └── ...
│       │   ├── components/          # React components
│       │   │   ├── layout/          # Header, Footer
│       │   │   ├── auth/            # Auth forms (NEW)
│       │   │   ├── security/        # MFA, Security components (NEW)
│       │   │   └── ui/              # Shared UI components
│       │   ├── lib/                 # Utilities
│       │   │   ├── api-client.ts    # Centralized API client (NEW)
│       │   │   └── env.ts           # Environment validation (NEW)
│       │   ├── middleware.ts        # Auth middleware (NEW)
│       │   ├── __tests__/           # Unit tests (NEW)
│       │   ├── e2e/                 # E2E tests (NEW)
│       │   ├── vitest.config.ts     # Vitest config (NEW)
│       │   └── playwright.config.ts # Playwright config (NEW)
│       ├── shared/                  # Shared library
│       │   ├── ui/                  # Enhanced UI components
│       │   │   ├── form/            # Form components (NEW)
│       │   │   ├── feedback/        # Feedback components (NEW)
│       │   │   ├── layout/          # Layout components (NEW)
│       │   │   └── ...
│       │   ├── lib/                 # Shared utilities
│       │   │   ├── stores/          # Zustand stores (NEW)
│       │   │   │   ├── auth-store.ts
│       │   │   │   └── cart-store.ts
│       │   │   └── api-client.ts    # API client (NEW)
│       │   └── types/               # TypeScript types
│       │       └── api.ts           # API types (NEW)
│       └── ...
├── docs/                            # Documentation
│   ├── LC_WEBSITE_NEXT_INTEGRATION_MASTER.md  # This document
│   ├── LC_WEBSITE_NEXT_INTEGRATION_REPORT.md  # Post-integration report (NEW)
│   ├── LC_WEBSITE_MIGRATION_LOG.md            # Migration log (NEW)
│   ├── COMPONENT_LIBRARY.md                   # Component docs (NEW)
│   └── API_CLIENT_GUIDE.md                    # API client docs (NEW)
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI pipeline (NEW)
│       ├── deploy.yml           # Deployment pipeline (NEW)
│       └── lighthouse.yml       # Lighthouse CI (NEW)
└── ...
```

---

**End of Master Integration Plan**

**Next Steps:**
1. Review and approve this integration plan
2. Begin Phase 1 implementation
3. Track progress using this document as checklist
4. Update documentation as features are completed
5. Create final integration report upon completion

**Status:** ✅ Ready for Implementation  
**Last Updated:** 2025-10-16  
**Version:** 1.0.0

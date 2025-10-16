# Frontend Development Guide - EVS-LC Apps

**Version:** 1.0.0  
**Last Updated:** 2025-10-16

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Development Setup](#development-setup)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Styling Guide](#styling-guide)
9. [Best Practices](#best-practices)

## Overview

The EVS-LC frontend consists of two main applications built with Next.js 15:
- **web-portal**: Public-facing player portal
- **web-admin**: Administrative dashboard

Both applications share common code through the **shared** library.

## Project Structure

```
apps/lc_apps/
├── web-portal/              # Player portal (port 3000)
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and helpers
│   └── public/              # Static assets
├── web-admin/               # Admin dashboard (port 3001)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
└── shared/                  # Shared library
    ├── ui/                  # UI components
    ├── hooks/               # React hooks
    ├── lib/                 # Utilities
    └── types/               # TypeScript types
```

## Technology Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9+
- **Runtime**: Node.js 20+

### Styling
- **CSS Framework**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React

### State & Data
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Validation**: Zod (with React Hook Form)

### Development Tools
- **Package Manager**: pnpm
- **Build Tool**: Turbo
- **Linting**: ESLint
- **Formatting**: Prettier

## Development Setup

### Prerequisites
```bash
node -v  # v20.0.0 or higher
pnpm -v  # v10.0.0 or higher
```

### Installation
```bash
# Clone repository
git clone https://github.com/evervibe/evs-lc-apps.git
cd evs-lc-apps

# Install dependencies
pnpm install

# Setup environment
cp apps/lc_apps/web-portal/.env.example apps/lc_apps/web-portal/.env
cp apps/lc_apps/web-admin/.env.example apps/lc_apps/web-admin/.env
```

### Start Development Server
```bash
# Start all apps
pnpm dev

# Or start individually
cd apps/lc_apps/web-portal && pnpm dev
cd apps/lc_apps/web-admin && pnpm dev
```

## Component Architecture

### App Router Structure

Next.js 15 uses the App Router with file-based routing:

```
app/
├── layout.tsx          # Root layout (applies to all pages)
├── page.tsx           # Home page (/)
├── auth/
│   ├── layout.tsx     # Auth layout
│   ├── login/
│   │   └── page.tsx   # Login page (/auth/login)
│   └── register/
│       └── page.tsx   # Register page (/auth/register)
├── dashboard/
│   └── page.tsx       # Dashboard (/dashboard)
└── news/
    ├── page.tsx       # News list (/news)
    └── [id]/
        └── page.tsx   # News detail (/news/:id)
```

### Server vs Client Components

**Server Components** (default):
```tsx
// app/news/page.tsx
import { getNews } from '@/lib/api'

export default async function NewsPage() {
  const news = await getNews()
  
  return (
    <div>
      {news.map(article => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

**Client Components** (interactive):
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@lc-apps/shared/ui/button'

export function LoginForm() {
  const [email, setEmail] = useState('')
  
  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit">Login</Button>
    </form>
  )
}
```

### UI Components (shadcn/ui)

All UI components are in the shared library:

```tsx
import { Button } from '@lc-apps/shared/ui/button'
import { Card } from '@lc-apps/shared/ui/card'
import { Dialog } from '@lc-apps/shared/ui/dialog'
import { Input } from '@lc-apps/shared/ui/input'
import { Toast } from '@lc-apps/shared/ui/toast'
```

## State Management

### Zustand Store

Create stores in `lib/stores/`:

```tsx
// lib/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
```

Usage:
```tsx
'use client'

import { useAuthStore } from '@/lib/stores/authStore'

export function UserProfile() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  
  if (!user) return <p>Not logged in</p>
  
  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## API Integration

### API Client

The shared library provides a configured Axios client:

```tsx
// apps/lc_apps/shared/lib/api-client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        )
        
        localStorage.setItem('access_token', data.access_token)
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
```

### Using the API Client

```tsx
import apiClient from '@lc-apps/shared/lib/api-client'

// GET request
async function fetchNews() {
  const { data } = await apiClient.get('/news')
  return data
}

// POST request
async function createTicket(ticketData) {
  const { data } = await apiClient.post('/tickets', ticketData)
  return data
}

// PUT request
async function updateProfile(userData) {
  const { data } = await apiClient.put('/users/me', userData)
  return data
}

// DELETE request
async function deleteTicket(id) {
  await apiClient.delete(`/tickets/${id}`)
}
```

### Custom Hooks

Create reusable hooks in `shared/hooks/`:

```tsx
// shared/hooks/useFetch.ts
import { useState, useEffect } from 'react'
import apiClient from '@lc-apps/shared/lib/api-client'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.get(url)
        setData(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [url])
  
  return { data, loading, error }
}
```

Usage:
```tsx
'use client'

import { useFetch } from '@lc-apps/shared/hooks/useFetch'

export function NewsList() {
  const { data, loading, error } = useFetch('/news')
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  
  return (
    <div>
      {data.map(article => (
        <article key={article.id}>{article.title}</article>
      ))}
    </div>
  )
}
```

## Styling Guide

### Tailwind CSS

All styling uses Tailwind CSS v4:

```tsx
export function Button({ children }) {
  return (
    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
      {children}
    </button>
  )
}
```

### Theme Configuration

Theme is defined in `app/globals.css`:

```css
@theme {
  --color-primary: oklch(55% 0.21 263);
  --color-secondary: oklch(96% 0 0);
  --color-accent: oklch(78% 0.15 103);
  /* ... */
}
```

### Component Styling

Use the `cn` utility for conditional classes:

```tsx
import { cn } from '@lc-apps/shared/lib/utils'

export function Card({ className, children }) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-4",
      className
    )}>
      {children}
    </div>
  )
}
```

## Best Practices

### 1. File Organization
```
component-name/
├── index.ts                 # Exports
├── ComponentName.tsx        # Main component
├── ComponentName.test.tsx   # Tests
└── ComponentName.stories.tsx # Storybook (optional)
```

### 2. TypeScript
```tsx
// Always define types
interface User {
  id: string
  username: string
  email: string
}

// Use props interface
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}
```

### 3. Error Handling
```tsx
'use client'

import { useState } from 'react'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError(null)
      await loginUser(credentials)
    } catch (err) {
      setError(err.message)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      {/* form fields */}
    </form>
  )
}
```

### 4. Loading States
```tsx
export function NewsList() {
  const { data, loading } = useFetch('/news')
  
  if (loading) {
    return <Skeleton count={3} />
  }
  
  return (
    <div>
      {data.map(article => <NewsCard key={article.id} article={article} />)}
    </div>
  )
}
```

### 5. Environment Variables
```tsx
// Always use NEXT_PUBLIC_ prefix for client-side vars
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const appName = process.env.NEXT_PUBLIC_APP_NAME

// Validate required variables
if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is required')
}
```

---

**For more information, see:**
- [Architecture Documentation](./ARCHITECTURE.md)
- [API Guide](./API_GUIDE.md)
- [Environment Reference](./ENV_REFERENCE.md)

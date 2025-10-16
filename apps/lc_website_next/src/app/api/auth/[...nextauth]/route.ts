/**
 * Auth.js API Route Handler
 * 
 * Handles all authentication requests:
 * - GET /api/auth/signin
 * - POST /api/auth/signin
 * - GET /api/auth/signout
 * - POST /api/auth/signout
 * - GET /api/auth/session
 * - GET /api/auth/csrf
 * - GET /api/auth/providers
 * - GET /api/auth/callback/:provider
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;

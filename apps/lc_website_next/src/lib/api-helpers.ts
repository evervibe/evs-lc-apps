/**
 * API Helper Functions
 * 
 * Common utilities for API routes including error handling,
 * security headers, and response formatting
 */

import { NextResponse } from 'next/server';

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Create a JSON response with security headers
 */
export function createJsonResponse<T>(
  data: T,
  status: number = 200,
  additionalHeaders?: Record<string, string>
): NextResponse<T> {
  const headers = {
    ...SECURITY_HEADERS,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  return NextResponse.json(data, {
    status,
    headers,
  });
}

/**
 * Create an error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse {
  return createJsonResponse(
    {
      error: message,
      details: details || undefined,
    },
    status
  );
}

/**
 * Extract client IP from request
 */
export function getClientIp(request: Request): string {
  // Check common headers for IP (CloudFlare, Nginx, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Verify admin token from request
 */
export function verifyAdminToken(request: Request): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    console.warn('ADMIN_TOKEN not configured');
    return false;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return false;
  }

  // Support both "Bearer TOKEN" and just "TOKEN"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  return token === adminToken;
}

/**
 * Extract user ID from session using Auth.js
 */
export async function getUserIdFromSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request: Request
): Promise<string | null> {
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    return session?.user?.id || null;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

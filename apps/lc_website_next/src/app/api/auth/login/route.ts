/**
 * POST /api/auth/login
 * 
 * Login endpoint (skeleton for Auth.js integration)
 * For now, validates credentials and returns success/failure
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/crypto-portal';
import { createJsonResponse, createErrorResponse, getClientIp } from '@/lib/api-helpers';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit-log';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(
      `login:${clientIp}`,
      RATE_LIMIT_CONFIGS.auth
    );

    if (!rateLimit.allowed) {
      await createAuditLog({
        action: 'security.rate_limit',
        target: `login:${clientIp}`,
        metadata: { ip: clientIp },
      });

      return createErrorResponse(
        'Too many login attempts. Please try again later.',
        429,
        { resetAt: rateLimit.resetAt }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!user) {
      await createAuditLog({
        action: 'security.invalid_attempt',
        target: email,
        metadata: { reason: 'user_not_found', ip: clientIp },
      });

      return createErrorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      await createAuditLog({
        actorUserId: user.id,
        action: 'security.invalid_attempt',
        target: email,
        metadata: { reason: 'invalid_password', ip: clientIp },
      });

      return createErrorResponse('Invalid credentials', 401);
    }

    // Success - create session (TODO: integrate with Auth.js)
    await createAuditLog({
      actorUserId: user.id,
      action: 'user.login',
      target: email,
      metadata: { ip: clientIp },
    });

    // For now, just return success
    // Full session creation will be handled by Auth.js integration
    return createJsonResponse({
      success: true,
      message: 'Login successful (session creation pending Auth.js integration)',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Login failed', 500);
  }
}

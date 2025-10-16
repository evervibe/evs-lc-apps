/**
 * POST /api/auth/register
 * 
 * Register a new portal user with Argon2id password hashing
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/crypto-portal';
import { createJsonResponse, createErrorResponse, getClientIp } from '@/lib/api-helpers';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit-log';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(
      `register:${clientIp}`,
      RATE_LIMIT_CONFIGS.auth
    );

    if (!rateLimit.allowed) {
      await createAuditLog({
        action: 'security.rate_limit',
        target: `register:${clientIp}`,
        metadata: { ip: clientIp },
      });

      return createErrorResponse(
        'Too many registration attempts. Please try again later.',
        429,
        { resetAt: rateLimit.resetAt }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return createErrorResponse('Email already registered', 409);
    }

    // Hash password with Argon2id
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'user',
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Audit log
    await createAuditLog({
      actorUserId: user.id,
      action: 'user.register',
      target: email,
      metadata: { ip: clientIp },
    });

    return createJsonResponse(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Registration failed', 500);
  }
}

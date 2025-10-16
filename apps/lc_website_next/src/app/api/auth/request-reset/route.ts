/**
 * POST /api/auth/request-reset
 * 
 * Request a password reset email
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { createJsonResponse, createErrorResponse, getClientIp } from '@/lib/api-helpers';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit-log';
import { sendPasswordResetEmail } from '@/lib/email';

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(
      `password-reset:${clientIp}`,
      RATE_LIMIT_CONFIGS.auth
    );

    if (!rateLimit.allowed) {
      await createAuditLog({
        action: 'security.rate_limit',
        target: `password-reset:${clientIp}`,
        metadata: { ip: clientIp },
      });

      return createErrorResponse(
        'Too many reset attempts. Please try again later.',
        429,
        { resetAt: rateLimit.resetAt }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = requestResetSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { email } = validation.data;

    // Find user (but don't reveal if user exists or not for security)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (user) {
      // Generate reset token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      // Send email with reset link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        `${request.nextUrl.protocol}//${request.nextUrl.host}`;
      
      await sendPasswordResetEmail(user.email, token, baseUrl);

      await createAuditLog({
        actorUserId: user.id,
        action: 'user.password_reset_request',
        target: user.email,
        metadata: { ip: clientIp },
      });
    } else {
      // Log attempt even if user doesn't exist
      await createAuditLog({
        action: 'security.invalid_attempt',
        target: email,
        metadata: { reason: 'password_reset_unknown_email', ip: clientIp },
      });
    }

    // Always return success to prevent email enumeration
    return createJsonResponse({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return createErrorResponse('Failed to process password reset request', 500);
  }
}

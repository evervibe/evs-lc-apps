/**
 * POST /api/auth/reset
 * 
 * Reset password using token
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/crypto-portal';
import { createJsonResponse, createErrorResponse, getClientIp } from '@/lib/api-helpers';
import { createAuditLog } from '@/lib/audit-log';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Parse and validate input
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { token, newPassword } = validation.data;

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!resetToken) {
      await createAuditLog({
        action: 'security.invalid_attempt',
        target: 'password_reset',
        metadata: { reason: 'invalid_token', ip: clientIp },
      });

      return createErrorResponse('Invalid or expired reset token', 401);
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      await createAuditLog({
        actorUserId: resetToken.userId,
        action: 'security.invalid_attempt',
        target: resetToken.user.email,
        metadata: { reason: 'expired_token', ip: clientIp },
      });

      return createErrorResponse('Reset token has expired', 401);
    }

    // Check if token has already been used
    if (resetToken.usedAt) {
      await createAuditLog({
        actorUserId: resetToken.userId,
        action: 'security.invalid_attempt',
        target: resetToken.user.email,
        metadata: { reason: 'token_already_used', ip: clientIp },
      });

      return createErrorResponse('Reset token has already been used', 401);
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    await createAuditLog({
      actorUserId: resetToken.userId,
      action: 'user.password_reset_complete',
      target: resetToken.user.email,
      metadata: { ip: clientIp },
    });

    return createJsonResponse({
      success: true,
      message: 'Password has been successfully reset',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return createErrorResponse('Failed to reset password', 500);
  }
}

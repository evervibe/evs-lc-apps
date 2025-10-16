/**
 * POST /api/mfa/disable
 * 
 * Disable MFA for user account
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/crypto-portal';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';
import { createAuditLog } from '@/lib/audit-log';

const disableSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Parse and validate input
    const body = await request.json();
    const validation = disableSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { password } = validation.data;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true,
        passwordHash: true,
        mfaTotp: true,
      },
    });

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Verify password for security
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      await createAuditLog({
        actorUserId: userId,
        action: 'security.invalid_attempt',
        target: user.email,
        metadata: { reason: 'invalid_password_for_mfa_disable' },
      });

      return createErrorResponse('Invalid password', 401);
    }

    if (!user.mfaTotp) {
      return createErrorResponse('MFA is not enabled', 400);
    }

    // Delete MFA configuration and backup codes
    await prisma.$transaction([
      prisma.mfaTotp.delete({
        where: { userId },
      }),
      prisma.mfaBackupCode.deleteMany({
        where: { userId },
      }),
    ]);

    await createAuditLog({
      actorUserId: userId,
      action: 'mfa.disabled',
      target: user.email,
    });

    return createJsonResponse({
      success: true,
      message: 'MFA has been successfully disabled',
    });
  } catch (error) {
    console.error('MFA disable error:', error);
    return createErrorResponse('Failed to disable MFA', 500);
  }
}

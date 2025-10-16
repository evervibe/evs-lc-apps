/**
 * POST /api/mfa/verify
 * 
 * Verify TOTP code and enable MFA
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticator } from 'otplib';
import { prisma } from '@/lib/prisma';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';
import { createAuditLog } from '@/lib/audit-log';
import { sendMfaEnabledEmail } from '@/lib/email';

const verifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
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
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { code } = validation.data;

    // Get user and MFA config
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true,
        mfaTotp: true,
      },
    });

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    if (!user.mfaTotp) {
      return createErrorResponse('MFA not initialized. Please setup MFA first.', 400);
    }

    if (user.mfaTotp.enabledAt) {
      return createErrorResponse('MFA is already enabled', 400);
    }

    // Verify the TOTP code
    const secret = user.mfaTotp.secretEncrypted; // Currently stored as plaintext
    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
      await createAuditLog({
        actorUserId: userId,
        action: 'mfa.verify_failed',
        target: user.email,
        metadata: { reason: 'invalid_code' },
      });

      return createErrorResponse('Invalid verification code', 401);
    }

    // Enable MFA
    await prisma.mfaTotp.update({
      where: { userId },
      data: {
        enabledAt: new Date(),
      },
    });

    await createAuditLog({
      actorUserId: userId,
      action: 'mfa.enabled',
      target: user.email,
    });

    // Send notification email (non-blocking)
    sendMfaEnabledEmail(user.email).catch(err => 
      console.error('Failed to send MFA enabled email:', err)
    );

    return createJsonResponse({
      success: true,
      message: 'MFA has been successfully enabled',
    });
  } catch (error) {
    console.error('MFA verify error:', error);
    return createErrorResponse('Failed to verify MFA', 500);
  }
}

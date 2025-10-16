/**
 * POST /api/mfa/backup-codes
 * 
 * Generate backup codes for MFA recovery
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/crypto-portal';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';
import { createAuditLog } from '@/lib/audit-log';

/**
 * Generate a random backup code (8 characters, alphanumeric)
 */
function generateBackupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Get user and check if MFA is enabled
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

    if (!user.mfaTotp?.enabledAt) {
      return createErrorResponse('MFA must be enabled first', 400);
    }

    // Generate 8 backup codes
    const codes = Array.from({ length: 8 }, () => generateBackupCode());

    // Delete old backup codes
    await prisma.mfaBackupCode.deleteMany({
      where: { userId },
    });

    // Store hashed backup codes
    const backupCodePromises = codes.map(async (code) => {
      const codeHash = await hashPassword(code);
      return prisma.mfaBackupCode.create({
        data: {
          userId,
          codeHash,
        },
      });
    });

    await Promise.all(backupCodePromises);

    await createAuditLog({
      actorUserId: userId,
      action: 'mfa.verify_success',
      target: user.email,
      metadata: { action: 'backup_codes_generated', count: codes.length },
    });

    return createJsonResponse({
      success: true,
      codes, // Return plaintext codes only once
      message: 'Save these backup codes in a secure location. They will not be shown again.',
    });
  } catch (error) {
    console.error('Backup codes generation error:', error);
    return createErrorResponse('Failed to generate backup codes', 500);
  }
}

/**
 * POST /api/mfa/setup
 * 
 * Generate TOTP secret and QR code for MFA setup
 */

import { NextRequest } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';
import { createAuditLog } from '@/lib/audit-log';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Check if user already has MFA enabled
    const existingMfa = await prisma.mfaTotp.findUnique({
      where: { userId },
    });

    if (existingMfa?.enabledAt) {
      return createErrorResponse('MFA is already enabled for this account', 400);
    }

    // Get user email for QR code label
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    
    // Create OTP Auth URL for QR code
    const otpauthUrl = authenticator.keyuri(
      user.email,
      'LC Portal',
      secret
    );

    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Store or update the TOTP config (not enabled yet)
    // Note: In production, the secret should be encrypted before storage
    // For MVP, we store it as-is temporarily for verification
    await prisma.mfaTotp.upsert({
      where: { userId },
      create: {
        userId,
        secretEncrypted: secret, // TODO: Encrypt in production
        enabledAt: null,
      },
      update: {
        secretEncrypted: secret, // TODO: Encrypt in production
        enabledAt: null,
      },
    });

    await createAuditLog({
      actorUserId: userId,
      action: 'mfa.verify_success',
      target: user.email,
      metadata: { step: 'setup_initiated' },
    });

    return createJsonResponse({
      success: true,
      secret, // Return secret for manual entry
      qrCode: qrCodeDataUrl,
      message: 'Scan QR code with your authenticator app and verify with a code',
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return createErrorResponse('Failed to setup MFA', 500);
  }
}

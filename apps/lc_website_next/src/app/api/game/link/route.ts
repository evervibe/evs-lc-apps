/**
 * POST /api/game/link
 * 
 * Link a game account to portal user by verifying legacy credentials
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { detectAndVerify } from '@/lib/crypto-legacy';
import { createJsonResponse, createErrorResponse, getClientIp, getUserIdFromSession } from '@/lib/api-helpers';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit-log';
import { executeReadOnlyQuery, getOrCreatePool } from '@/lib/legacy-db';

// Validation schemas
const linkAccountSchema = z.object({
  serverId: z.string().uuid('Invalid server ID'),
  gameUsername: z.string().min(1, 'Game username is required'),
  password: z.string().min(1, 'Password is required'),
});

const unlinkAccountSchema = z.object({
  linkId: z.string().uuid('Invalid link ID'),
});

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session (TODO: implement with Auth.js)
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(
      `game-link:${userId}`,
      RATE_LIMIT_CONFIGS.gameLink
    );

    if (!rateLimit.allowed) {
      await createAuditLog({
        actorUserId: userId,
        action: 'security.rate_limit',
        target: `game-link:${userId}`,
        metadata: { ip: clientIp },
      });

      return createErrorResponse(
        'Too many link attempts. Please try again later.',
        429,
        { resetAt: rateLimit.resetAt }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = linkAccountSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { serverId, gameUsername, password } = validation.data;

    // Check if server exists
    const server = await prisma.gameServer.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      return createErrorResponse('Server not found', 404);
    }

    // Check if link already exists
    const existingLink = await prisma.gameAccountLink.findUnique({
      where: {
        serverId_gameUsername: {
          serverId,
          gameUsername,
        },
      },
    });

    if (existingLink) {
      return createErrorResponse(
        'This game account is already linked to a portal account',
        409
      );
    }

    // Initialize connection pool for server
    getOrCreatePool({
      id: server.id,
      name: server.name,
      host: server.host,
      port: server.port,
      database: server.database,
      user: server.roUser,
      password: server.roPassEncrypted, // TODO: Decrypt in real implementation
    });

    // Query legacy database for user
    interface LegacyUser {
      user_code: number;
      user_id: string;
      passwd: string;
      activated: number;
    }

    const legacyUsers = await executeReadOnlyQuery<LegacyUser>(
      serverId,
      'SELECT user_code, user_id, passwd, activated FROM bg_user WHERE user_id = ? LIMIT 1',
      [gameUsername]
    );

    if (legacyUsers.length === 0) {
      await createAuditLog({
        actorUserId: userId,
        action: 'security.invalid_attempt',
        target: `game-link:${gameUsername}`,
        metadata: { reason: 'user_not_found', serverId },
      });

      return createErrorResponse('Game account not found', 404);
    }

    const legacyUser = legacyUsers[0];

    // Verify password using legacy hash detection
    const verifyResult = detectAndVerify({
      username: gameUsername,
      password,
      storedHash: legacyUser.passwd,
    });

    if (!verifyResult.matched) {
      await createAuditLog({
        actorUserId: userId,
        action: 'security.invalid_attempt',
        target: `game-link:${gameUsername}`,
        metadata: { reason: 'invalid_password', serverId },
      });

      return createErrorResponse('Invalid game account credentials', 401);
    }

    // Create link
    const link = await prisma.gameAccountLink.create({
      data: {
        userId,
        serverId,
        gameUsername,
        verifiedAt: new Date(),
        legacyAlgo: verifyResult.algo || 'unknown',
        lastCheckAt: new Date(),
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            region: true,
          },
        },
      },
    });

    // Audit log
    await createAuditLog({
      actorUserId: userId,
      action: 'game.link_account',
      target: gameUsername,
      metadata: {
        serverId,
        serverName: server.name,
        legacyAlgo: verifyResult.algo,
      },
    });

    return createJsonResponse(
      {
        success: true,
        link: {
          id: link.id,
          gameUsername: link.gameUsername,
          server: link.server,
          verifiedAt: link.verifiedAt,
          legacyAlgo: link.legacyAlgo,
        },
      },
      201
    );
  } catch (error) {
    console.error('Game account link error:', error);
    return createErrorResponse('Failed to link game account', 500);
  }
}

/**
 * DELETE /api/game/link
 * 
 * Unlink a game account from portal user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Parse and validate input
    const body = await request.json();
    const validation = unlinkAccountSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const { linkId } = validation.data;

    // Find the link and verify ownership
    const link = await prisma.gameAccountLink.findUnique({
      where: { id: linkId },
      include: {
        server: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!link) {
      return createErrorResponse('Game account link not found', 404);
    }

    // Verify the link belongs to the requesting user
    if (link.userId !== userId) {
      return createErrorResponse('Unauthorized - You can only unlink your own accounts', 403);
    }

    // Delete the link
    await prisma.gameAccountLink.delete({
      where: { id: linkId },
    });

    // Audit log
    await createAuditLog({
      actorUserId: userId,
      action: 'game.unlink_account',
      target: link.gameUsername,
      metadata: {
        serverId: link.serverId,
        serverName: link.server.name,
        linkId,
      },
    });

    return createJsonResponse({
      success: true,
      message: 'Game account unlinked successfully',
    });
  } catch (error) {
    console.error('Game account unlink error:', error);
    return createErrorResponse('Failed to unlink game account', 500);
  }
}

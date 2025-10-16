/**
 * GET /api/game/links
 * 
 * List all game account links for the authenticated user
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (TODO: implement with Auth.js)
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Fetch all links for user
    const links = await prisma.gameAccountLink.findMany({
      where: {
        userId,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            region: true,
            host: true,
            database: true,
          },
        },
      },
      orderBy: {
        verifiedAt: 'desc',
      },
    });

    return createJsonResponse({
      links: links.map((link: typeof links[0]) => ({
        id: link.id,
        gameUsername: link.gameUsername,
        server: link.server,
        verifiedAt: link.verifiedAt,
        legacyAlgo: link.legacyAlgo,
        lastCheckAt: link.lastCheckAt,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch game links:', error);
    return createErrorResponse('Failed to fetch game links', 500);
  }
}

/**
 * GET /api/servers - List game servers (without secrets)
 * POST /api/servers - Add a new game server (admin only)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createJsonResponse, createErrorResponse, verifyAdminToken } from '@/lib/api-helpers';
import { createAuditLog } from '@/lib/audit-log';
import { getOrCreatePool } from '@/lib/legacy-db';

// Validation schema for creating a server
const createServerSchema = z.object({
  name: z.string().min(1, 'Server name is required'),
  region: z.string().optional(),
  driver: z.string().default('mysql'),
  host: z.string().min(1, 'Host is required'),
  port: z.number().int().min(1).max(65535).default(3306),
  database: z.string().min(1, 'Database name is required'),
  roUser: z.string().min(1, 'Read-only user is required'),
  roPassEncrypted: z.string().min(1, 'Password is required'),
});

/**
 * GET /api/servers
 * List all game servers (without sensitive data)
 */
export async function GET() {
  try {
    const servers = await prisma.gameServer.findMany({
      select: {
        id: true,
        name: true,
        region: true,
        driver: true,
        host: true,
        port: true,
        database: true,
        createdAt: true,
        // Exclude roUser and roPassEncrypted
      },
      orderBy: {
        name: 'asc',
      },
    });

    return createJsonResponse({ servers });
  } catch (error) {
    console.error('Failed to fetch servers:', error);
    return createErrorResponse('Failed to fetch servers', 500);
  }
}

/**
 * POST /api/servers
 * Add a new game server (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    if (!verifyAdminToken(request)) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Parse and validate input
    const body = await request.json();
    const validation = createServerSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        400,
        validation.error.issues
      );
    }

    const data = validation.data;

    // Create server in database
    const server = await prisma.gameServer.create({
      data: {
        name: data.name,
        region: data.region,
        driver: data.driver,
        host: data.host,
        port: data.port,
        database: data.database,
        roUser: data.roUser,
        roPassEncrypted: data.roPassEncrypted, // TODO: Encrypt this before storing
      },
      select: {
        id: true,
        name: true,
        region: true,
        driver: true,
        host: true,
        port: true,
        database: true,
        createdAt: true,
      },
    });

    // Initialize connection pool
    try {
      getOrCreatePool({
        id: server.id,
        name: server.name,
        host: server.host,
        port: server.port,
        database: server.database,
        user: data.roUser,
        password: data.roPassEncrypted, // In real implementation, decrypt first
      });
    } catch (error) {
      console.error('Failed to create connection pool:', error);
      // Don't fail the request, pool will be created on first use
    }

    // Audit log
    await createAuditLog({
      action: 'server.add',
      target: server.name,
      metadata: {
        serverId: server.id,
        host: server.host,
        database: server.database,
      },
    });

    return createJsonResponse({ server }, 201);
  } catch (error) {
    console.error('Failed to create server:', error);
    return createErrorResponse('Failed to create server', 500);
  }
}

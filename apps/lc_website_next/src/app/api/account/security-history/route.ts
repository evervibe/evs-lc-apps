/**
 * GET /api/account/security-history
 * 
 * Get recent security events for the authenticated user
 */

import { NextRequest } from 'next/server';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';
import { queryAuditLogs } from '@/lib/audit-log';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Get recent security events (last 10)
    const logs = await queryAuditLogs({
      actorUserId: userId,
      limit: 10,
    });

    // Format logs for client
    const formattedLogs = logs.map((log: { id: string; action: string; target: string; metaJson: string | null; createdAt: Date }) => {
      let metaData = null;
      if (log.metaJson) {
        try {
          metaData = JSON.parse(log.metaJson);
        } catch {
          // Ignore parse errors
        }
      }

      return {
        id: log.id,
        action: log.action,
        target: log.target,
        metadata: metaData,
        createdAt: log.createdAt,
      };
    });

    return createJsonResponse({
      success: true,
      logs: formattedLogs,
    });
  } catch (error) {
    console.error('Security history error:', error);
    return createErrorResponse('Failed to fetch security history', 500);
  }
}

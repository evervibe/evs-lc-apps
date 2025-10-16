/**
 * GET /api/admin/stats
 * 
 * Get admin dashboard statistics
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createJsonResponse, createErrorResponse, getUserIdFromSession } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return createErrorResponse('Unauthorized - Please log in first', 401);
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'admin') {
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    // Get statistics
    const [
      totalUsers,
      totalGameLinks,
      failedLoginsLast24h,
      recentUsers,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total game account links
      prisma.gameAccountLink.count(),

      // Failed logins in last 24 hours
      prisma.auditLog.count({
        where: {
          action: 'security.invalid_attempt',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Recent user registrations (last 7 days, grouped by day)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    // Group users by day for the chart
    const usersByDay = recentUsers.reduce((acc: Record<string, number>, user: { createdAt: Date }) => {
      const day = user.createdAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for charting
    const registrationsChart = Object.entries(usersByDay).map(([date, count]) => ({
      date,
      count,
    }));

    // Get MFA adoption stats
    const mfaEnabled = await prisma.mfaTotp.count({
      where: {
        enabledAt: {
          not: null,
        },
      },
    });

    return createJsonResponse({
      success: true,
      stats: {
        totalUsers,
        totalGameLinks,
        failedLoginsLast24h,
        mfaEnabled,
        mfaAdoptionRate: totalUsers > 0 ? (mfaEnabled / totalUsers * 100).toFixed(1) : '0',
        registrationsChart,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return createErrorResponse('Failed to fetch admin statistics', 500);
  }
}

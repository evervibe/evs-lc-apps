/**
 * GET /api/rankings/summary
 * 
 * Example read-only query to legacy database
 * Returns top N characters by level as proof-of-concept
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createJsonResponse, createErrorResponse } from '@/lib/api-helpers';
import { executeReadOnlyQuery } from '@/lib/legacy-db';

// Query parameters schema
const querySchema = z.object({
  serverId: z.string().uuid('Invalid server ID'),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const validation = querySchema.safeParse({
      serverId: searchParams.get('serverId'),
      limit: searchParams.get('limit'),
    });

    if (!validation.success) {
      return createErrorResponse(
        'Invalid query parameters',
        400,
        validation.error.issues
      );
    }

    const { serverId, limit } = validation.data;

    // Example read-only query to get top characters
    interface CharacterRanking {
      a_index: number;
      a_name: string;
      a_level: number;
      a_job: number;
      a_exp: number;
    }

    const rankings = await executeReadOnlyQuery<CharacterRanking>(
      serverId,
      `SELECT a_index, a_name, a_level, a_job, a_exp 
       FROM t_characters 
       WHERE a_enable = 1 
       ORDER BY a_level DESC, a_exp DESC 
       LIMIT ?`,
      [limit]
    );

    return createJsonResponse({
      serverId,
      rankings: rankings.map((char, index) => ({
        rank: index + 1,
        characterId: char.a_index,
        name: char.a_name,
        level: char.a_level,
        job: char.a_job,
        experience: char.a_exp,
      })),
      total: rankings.length,
    });
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
    
    // Provide more specific error message
    if (error instanceof Error) {
      if (error.message.includes('No connection found')) {
        return createErrorResponse('Server connection not found', 404);
      }
      if (error.message.includes('SECURITY VIOLATION')) {
        return createErrorResponse('Invalid query', 403);
      }
    }
    
    return createErrorResponse('Failed to fetch rankings', 500);
  }
}

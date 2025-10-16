/**
 * Character Search API
 * GET /api/characters/search?q=name
 */

import { NextResponse } from 'next/server';
import { searchCharacters, getJobName } from '@/lib/game-db';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, 10, 60); // 10 requests per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Query too short (min 2 characters)' },
        { status: 400 }
      );
    }
    
    if (limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Limit too high (max 100)' },
        { status: 400 }
      );
    }
    
    // For development without actual game DB
    try {
      const characters = await searchCharacters(query, limit);
      
      return NextResponse.json({
        success: true,
        characters: characters.map(c => ({
          ...c,
          jobName: getJobName(c.job),
        })),
        total: characters.length,
      });
    } catch (dbError) {
      console.error('Game DB error:', dbError);
      
      // Return mock data for development
      return NextResponse.json({
        success: true,
        characters: [],
        total: 0,
        mock: true,
        message: 'Game database not connected - using mock data',
      });
    }
  } catch (error) {
    console.error('Character search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search characters' },
      { status: 500 }
    );
  }
}

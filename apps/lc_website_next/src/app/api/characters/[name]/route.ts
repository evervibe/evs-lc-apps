/**
 * Character Details API
 * GET /api/characters/:name
 */

import { NextResponse } from 'next/server';
import { getCharacterByName, getJobName } from '@/lib/game-db';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, 20, 60); // 20 requests per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const params = await context.params;
    const characterName = decodeURIComponent(params.name);
    
    if (!characterName) {
      return NextResponse.json(
        { success: false, error: 'Character name required' },
        { status: 400 }
      );
    }
    
    // For development without actual game DB
    try {
      const character = await getCharacterByName(characterName);
      
      if (!character) {
        return NextResponse.json(
          { success: false, error: 'Character not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        character: {
          ...character,
          jobName: getJobName(character.job),
        },
      });
    } catch (dbError) {
      console.error('Game DB error:', dbError);
      
      // Return mock data for development
      return NextResponse.json({
        success: true,
        character: {
          id: 1,
          name: characterName,
          level: 255,
          job: 0,
          jobName: 'Knight',
          exp: 999999999,
          gold: 100000000,
          guildName: 'Elite Warriors',
        },
        mock: true,
        message: 'Game database not connected - using mock data',
      });
    }
  } catch (error) {
    console.error('Character fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch character' },
      { status: 500 }
    );
  }
}

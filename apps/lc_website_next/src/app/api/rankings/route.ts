/**
 * Rankings API
 * GET /api/rankings?type=level|pvp|guild&limit=100
 */

import { NextResponse } from 'next/server';
import {
  getLevelRankings,
  getPvPRankings,
  getGuildRankings,
  getJobName,
} from '@/lib/game-db';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
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
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'level';
    const limit = parseInt(searchParams.get('limit') || '100');
    
    if (!['level', 'pvp', 'guild'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ranking type' },
        { status: 400 }
      );
    }
    
    if (limit > 500) {
      return NextResponse.json(
        { success: false, error: 'Limit too high (max 500)' },
        { status: 400 }
      );
    }
    
    try {
      let rankings;
      
      switch (type) {
        case 'level':
          rankings = await getLevelRankings(limit);
          rankings = rankings.map(r => ({
            ...r,
            jobName: getJobName(r.job),
          }));
          break;
        
        case 'pvp':
          rankings = await getPvPRankings(limit);
          rankings = rankings.map(r => ({
            ...r,
            jobName: getJobName(r.job),
          }));
          break;
        
        case 'guild':
          rankings = await getGuildRankings(limit);
          break;
        
        default:
          rankings = [];
      }
      
      return NextResponse.json({
        success: true,
        type,
        rankings,
        total: rankings.length,
      });
    } catch (dbError) {
      console.error('Game DB error:', dbError);
      
      // Return mock data for development
      const mockRankings = generateMockRankings(type, Math.min(limit, 10));
      
      return NextResponse.json({
        success: true,
        type,
        rankings: mockRankings,
        total: mockRankings.length,
        mock: true,
        message: 'Game database not connected - using mock data',
      });
    }
  } catch (error) {
    console.error('Rankings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}

function generateMockRankings(type: string, limit: number) {
  if (type === 'guild') {
    return Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      guildName: `Guild ${i + 1}`,
      level: 100 - i,
      memberCount: 50 - i,
      totalScore: 1000000 - i * 10000,
    }));
  }
  
  return Array.from({ length: limit }, (_, i) => ({
    rank: i + 1,
    characterName: `Player${i + 1}`,
    level: 255 - i,
    job: i % 7,
    jobName: getJobName(i % 7),
    guildName: i % 3 === 0 ? `Guild ${Math.floor(i / 3) + 1}` : undefined,
    score: type === 'pvp' ? 1000 - i * 10 : 999999999 - i * 1000000,
  }));
}

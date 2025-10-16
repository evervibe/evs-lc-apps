/**
 * Voting API
 * POST /api/voting - Submit vote
 * GET /api/voting - Check vote status
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

// Mock voting sites
const VOTING_SITES = [
  {
    id: 'site_1',
    name: 'TopMMOSites',
    url: 'https://topmmosites.com/vote/12345',
    cooldown: 86400, // 24 hours in seconds
  },
  {
    id: 'site_2',
    name: 'PrivateServerList',
    url: 'https://privateserverlist.com/vote/54321',
    cooldown: 43200, // 12 hours in seconds
  },
  {
    id: 'site_3',
    name: 'MMOTopList',
    url: 'https://mmotoplist.com/vote/67890',
    cooldown: 86400, // 24 hours in seconds
  },
];

// In-memory vote tracking (use Redis in production)
const voteTracker = new Map<string, { userId: string; site: string; timestamp: number }[]>();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id as string;
    const now = Date.now();
    
    // Get user's votes
    const userVotes = voteTracker.get(userId) || [];
    
    // Calculate cooldown status for each site
    const sites = VOTING_SITES.map(site => {
      const lastVote = userVotes.find(v => v.site === site.id);
      const canVote = !lastVote || (now - lastVote.timestamp) >= site.cooldown * 1000;
      const nextVoteTime = lastVote 
        ? lastVote.timestamp + (site.cooldown * 1000)
        : now;
      
      return {
        id: site.id,
        name: site.name,
        url: site.url,
        canVote,
        nextVoteTime: canVote ? now : nextVoteTime,
        cooldown: site.cooldown,
      };
    });
    
    return NextResponse.json({
      success: true,
      sites,
    });
  } catch (error) {
    console.error('Vote status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vote status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, 5, 60); // 5 votes per minute max
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many vote attempts' },
        { status: 429 }
      );
    }
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { siteId } = body;
    
    if (!siteId) {
      return NextResponse.json(
        { success: false, error: 'Site ID required' },
        { status: 400 }
      );
    }
    
    const site = VOTING_SITES.find(s => s.id === siteId);
    if (!site) {
      return NextResponse.json(
        { success: false, error: 'Invalid site' },
        { status: 400 }
      );
    }
    
    const userId = session.user.id as string;
    const now = Date.now();
    
    // Get user's votes
    let userVotes = voteTracker.get(userId) || [];
    
    // Check cooldown
    const lastVote = userVotes.find(v => v.site === siteId);
    if (lastVote && (now - lastVote.timestamp) < site.cooldown * 1000) {
      const remainingTime = Math.ceil((site.cooldown * 1000 - (now - lastVote.timestamp)) / 1000);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Vote cooldown active',
          remainingSeconds: remainingTime,
        },
        { status: 400 }
      );
    }
    
    // Record vote
    userVotes = userVotes.filter(v => v.site !== siteId);
    userVotes.push({
      userId,
      site: siteId,
      timestamp: now,
    });
    voteTracker.set(userId, userVotes);
    
    // TODO: Save to database
    // TODO: Award rewards
    
    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      redirectUrl: site.url,
      rewards: {
        coins: 10,
        exp: 1000,
      },
    });
  } catch (error) {
    console.error('Vote submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}

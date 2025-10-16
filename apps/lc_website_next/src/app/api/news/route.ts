/**
 * News API
 * GET /api/news - List published news posts
 */

import { NextResponse } from 'next/server';

// Mock news posts
const MOCK_POSTS = [
  {
    id: 'post_1',
    title: 'Server Grand Opening!',
    slug: 'server-grand-opening',
    excerpt: 'Welcome to our LastChaos server! Join thousands of players in this epic adventure.',
    content: `# Server Grand Opening!

We are thrilled to announce the grand opening of our LastChaos server!

## What to Expect

- **High Rates:** Enjoy 10x experience rates for fast leveling
- **Custom Events:** Weekly events with exclusive rewards
- **Active Community:** Join our Discord with 5000+ members
- **Fair Play:** Strong anti-cheat measures

## Getting Started

1. Download the game client
2. Create your account
3. Choose your class
4. Start your adventure!

We look forward to seeing you in game!`,
    published: true,
    publishedAt: new Date('2025-01-01').toISOString(),
    authorId: 'admin',
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'post_2',
    title: 'New Year Event 2025',
    slug: 'new-year-event-2025',
    excerpt: 'Celebrate the new year with special events, double drops, and exclusive items!',
    content: `# New Year Event 2025

Happy New Year! Join us for special celebrations.

## Event Details

- **Duration:** Jan 1-15, 2025
- **Double EXP:** All week long
- **Special Boss:** Spawns every 2 hours
- **Exclusive Rewards:** Unique cosmetics

Don't miss out!`,
    published: true,
    publishedAt: new Date('2025-01-02').toISOString(),
    authorId: 'admin',
    createdAt: new Date('2025-01-02').toISOString(),
    updatedAt: new Date('2025-01-02').toISOString(),
  },
  {
    id: 'post_3',
    title: 'Maintenance Scheduled',
    slug: 'maintenance-scheduled',
    excerpt: 'Server maintenance on January 10th for system upgrades and bug fixes.',
    content: `# Scheduled Maintenance

Server will be down for maintenance on January 10th.

## Maintenance Window

- **Date:** January 10, 2025
- **Time:** 02:00 - 06:00 UTC
- **Duration:** Approximately 4 hours

## What's Being Updated

- Database optimization
- Security patches
- Bug fixes
- Performance improvements

Thank you for your patience!`,
    published: true,
    publishedAt: new Date('2025-01-03').toISOString(),
    authorId: 'admin',
    createdAt: new Date('2025-01-03').toISOString(),
    updatedAt: new Date('2025-01-03').toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    
    // Filter published posts only
    const publishedPosts = MOCK_POSTS.filter(p => p.published);
    
    // Sort by published date (newest first)
    publishedPosts.sort((a, b) => 
      new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
    
    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = publishedPosts.slice(start, end);
    
    return NextResponse.json({
      success: true,
      posts: paginatedPosts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
      })),
      pagination: {
        page,
        limit,
        total: publishedPosts.length,
        totalPages: Math.ceil(publishedPosts.length / limit),
      },
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

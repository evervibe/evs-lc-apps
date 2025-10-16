/**
 * News Post API
 * GET /api/news/:slug - Get single news post
 */

import { NextResponse } from 'next/server';

// Import from parent route
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

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = decodeURIComponent(params.slug);
    
    const post = MOCK_POSTS.find(p => p.slug === slug && p.published);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('News post fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

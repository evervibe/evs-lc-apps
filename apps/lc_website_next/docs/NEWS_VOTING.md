# News & Voting System Documentation

## Overview

The News & Voting system provides content management for announcements and a voting rewards system to promote server growth. It includes markdown-based blog posts and integration with top server listing sites.

## Architecture

### News System

#### Components

1. **API Routes**
   - `GET /api/news` - List published news posts (paginated)
   - `GET /api/news/:slug` - Get single news post with full content

2. **Data Structure**
   ```typescript
   interface Post {
     id: string;
     title: string;
     slug: string;
     content: string;        // Markdown content
     excerpt: string;
     published: boolean;
     publishedAt: Date;
     authorId: string;
   }
   ```

3. **UI Pages**
   - `/news` - News listing with category filters
   - `/news/:slug` - Individual post view (planned)

#### Features

- **Markdown Support:** Rich text formatting with markdown
- **Categories:** News, Events, Updates
- **Pagination:** Efficient browsing of historical posts
- **SEO Optimization:** Meta tags, OG images, structured data
- **Publishing Workflow:** Draft → Review → Publish

### Voting System

#### Components

1. **API Routes**
   - `GET /api/voting` - Check vote status and cooldowns
   - `POST /api/voting` - Submit vote and award rewards

2. **Vote Sites**
   ```typescript
   interface VoteSite {
     id: string;
     name: string;
     url: string;
     cooldown: number;    // Seconds between votes
   }
   ```

3. **UI Pages**
   - `/vote` - Interactive voting dashboard

#### Features

- **Multiple Sites:** 3+ voting sites supported
- **Cooldown System:** 12-24 hour cooldowns per site
- **Automatic Rewards:** Coins and EXP on successful vote
- **Rate Limiting:** Prevents abuse
- **Real-time Status:** Shows when next vote is available

## Database Schema

### Post Model

```prisma
model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    @db.Text
  excerpt     String?   @db.Text
  published   Boolean   @default(false)
  publishedAt DateTime?
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([authorId])
  @@index([published])
  @@index([publishedAt])
  @@map("posts")
}
```

### Vote Model

```prisma
model Vote {
  id        String   @id @default(cuid())
  userId    String
  site      String
  votedAt   DateTime @default(now())
  rewarded  Boolean  @default(false)
  ipAddress String?
  user      User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([votedAt])
  @@map("votes")
}
```

## News Management

### Creating Posts

**Admin Interface (Future):**
```typescript
// POST /api/admin/news
{
  title: "New Event Announcement",
  slug: "new-event-announcement",
  content: "# Event Details\n\n...",
  excerpt: "Short description",
  published: false  // Draft
}
```

**Markdown Editor:**
- Visual editor with preview
- Image upload support
- Syntax highlighting
- Auto-save drafts

### Publishing Workflow

1. **Draft:** Author creates post
2. **Review:** Admin reviews content
3. **Schedule:** Set publish date/time
4. **Publish:** Post goes live
5. **Update:** Edit and republish

### SEO Best Practices

```typescript
// Page metadata
export const metadata: Metadata = {
  title: 'Post Title - LastChaos',
  description: 'Post excerpt...',
  openGraph: {
    title: 'Post Title',
    description: 'Post excerpt...',
    images: ['/og-image.jpg'],
    type: 'article',
  },
};
```

## Voting System

### Vote Flow

1. **User Clicks Vote:** Check authentication
2. **Check Cooldown:** Verify site is available
3. **Record Vote:** Save to database
4. **Open Site:** Redirect to voting site in new tab
5. **Award Rewards:** Add coins and EXP to account
6. **Update Status:** Refresh cooldown timer

### Rewards Structure

| Action | Coins | Experience | Cooldown |
|--------|-------|------------|----------|
| Site 1 | 10 | 1,000 | 24h |
| Site 2 | 10 | 1,000 | 12h |
| Site 3 | 10 | 1,000 | 24h |

### Cooldown Management

```typescript
// Check if user can vote
const lastVote = getLastVote(userId, siteId);
const cooldown = site.cooldown * 1000; // Convert to ms
const canVote = !lastVote || (now - lastVote.timestamp) >= cooldown;

if (!canVote) {
  const remainingTime = cooldown - (now - lastVote.timestamp);
  return { error: 'Cooldown active', remainingSeconds: remainingTime / 1000 };
}
```

### Rate Limiting

- **Per IP:** 5 vote attempts per minute
- **Per User:** 3 votes per day maximum
- **Global:** 1000 votes per hour

## API Reference

### News API

**List Posts**
```
GET /api/news?page=1&limit=10

Response:
{
  "success": true,
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Get Single Post**
```
GET /api/news/server-grand-opening

Response:
{
  "success": true,
  "post": {
    "id": "post_1",
    "title": "Server Grand Opening!",
    "slug": "server-grand-opening",
    "content": "# Server Grand Opening...",
    "publishedAt": "2025-01-01T00:00:00Z"
  }
}
```

### Voting API

**Check Vote Status**
```
GET /api/voting

Response:
{
  "success": true,
  "sites": [
    {
      "id": "site_1",
      "name": "TopMMOSites",
      "url": "https://...",
      "canVote": true,
      "nextVoteTime": 1704326400000,
      "cooldown": 86400
    }
  ]
}
```

**Submit Vote**
```
POST /api/voting
{
  "siteId": "site_1"
}

Response:
{
  "success": true,
  "message": "Vote recorded",
  "redirectUrl": "https://...",
  "rewards": {
    "coins": 10,
    "exp": 1000
  }
}
```

## Security

### Rate Limiting
- Prevent voting spam
- IP-based tracking
- User-based limits
- Redis for distributed rate limiting

### Validation
```typescript
// Validate vote request
if (!session?.user) {
  return error('Unauthorized');
}

if (!isValidSite(siteId)) {
  return error('Invalid site');
}

if (hasActiveCooldown(userId, siteId)) {
  return error('Cooldown active');
}
```

### Anti-Cheat
- IP address logging
- Browser fingerprinting
- Vote pattern analysis
- Suspicious activity alerts

## Caching Strategy

### News Cache
```typescript
// Redis caching for news list
const cacheKey = 'news:page:1:limit:10';
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const posts = await fetchPosts();
await redis.setex(cacheKey, 300, JSON.stringify(posts)); // 5 minutes
return posts;
```

### Vote Cache
```typescript
// Cache vote status per user
const cacheKey = `votes:${userId}`;
await redis.setex(cacheKey, 60, JSON.stringify(votes)); // 1 minute
```

## Development Mode

### Mock Data

When database is unavailable, the system uses mock data:

- 3 sample news posts
- 3 voting sites with mock cooldowns
- In-memory vote tracking

### Testing

```bash
# Test news API
curl http://localhost:3000/api/news

# Test voting API (requires auth)
curl -X POST http://localhost:3000/api/voting \
  -H "Content-Type: application/json" \
  -d '{"siteId": "site_1"}'
```

## Deployment

### Environment Variables

```env
# Optional: Redis for vote tracking
REDIS_URL=redis://localhost:6379

# Base URL for absolute URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Production Checklist

- [ ] Set up Redis for vote tracking
- [ ] Configure actual voting site URLs
- [ ] Set up OG image generation
- [ ] Enable sitemap caching
- [ ] Configure CDN for images
- [ ] Set up analytics tracking
- [ ] Test voting reward delivery
- [ ] Monitor vote fraud

## Future Enhancements

### News System
- [ ] Rich text editor with WYSIWYG
- [ ] Image upload and management
- [ ] Video embedding
- [ ] Comments system
- [ ] Like/reaction system
- [ ] RSS feed
- [ ] Email notifications
- [ ] Social media auto-posting

### Voting System
- [ ] Voting leaderboards
- [ ] Bonus rewards for vote streaks
- [ ] Monthly voting contests
- [ ] Vote point shop
- [ ] Multiple reward tiers
- [ ] Referral bonuses
- [ ] Discord integration
- [ ] Vote verification webhooks

## Troubleshooting

### News Not Showing
```
Check:
- Post is published (published: true)
- publishedAt date is in the past
- API endpoint is accessible
- Mock data is being returned
```

### Vote Not Recording
```
Check:
- User is authenticated
- Cooldown has expired
- Rate limit not exceeded
- Site ID is valid
- Database/Redis is accessible
```

### Rewards Not Delivered
```
Check:
- Vote was recorded successfully
- User account exists
- Reward system is configured
- Database transactions completed
- Error logs for failures
```

## Analytics

### Key Metrics

- **News:** Views per post, time on page, bounce rate
- **Voting:** Vote rate, completion rate, reward redemption
- **Growth:** New votes per day, returning voters

### Tracking

```typescript
// Track news view
await analytics.track('news_view', {
  postId: post.id,
  postTitle: post.title,
  userId: session?.user?.id,
});

// Track vote
await analytics.track('vote_submitted', {
  siteId: site.id,
  siteName: site.name,
  userId: session.user.id,
  rewards: data.rewards,
});
```

## References

- [Markdown Spec](https://daringfireball.net/projects/markdown/)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Sitemap Protocol](https://www.sitemaps.org/)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

---

**Last Updated:** 2025-01-04  
**Version:** v0.9.0

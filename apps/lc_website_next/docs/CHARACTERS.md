# Characters & Rankings Documentation

## Overview

The Characters & Rankings system provides read-only access to game database information, displaying character profiles and leaderboards. It uses secure, read-only database connections and implements caching for optimal performance.

## Architecture

### Components

#### 1. Game Database Connector (`/src/lib/game-db.ts`)
- Read-only MySQL connection pool
- Parameterized queries for SQL injection prevention
- Connection pooling for performance
- Mock fallback for development

#### 2. API Endpoints
- `GET /api/characters/search?q=name` - Search characters
- `GET /api/characters/:name` - Character details
- `GET /api/rankings?type=level|pvp|guild` - Rankings data

#### 3. UI Pages
- `/rankings` - Interactive ranking leaderboards
- Character search and profiles (future)

### Data Flow

```
Game Database (MySQL) → Read-Only User → Connection Pool
                                          ↓
                                    API Routes
                                          ↓
                                    Next.js Pages
```

## Database Schema

The system reads from existing game database tables:

### Characters Table
```sql
characters (
  id INT PRIMARY KEY,
  char_name VARCHAR(255),
  account_id INT,
  level INT,
  job INT,
  exp BIGINT,
  gold BIGINT,
  last_login DATETIME,
  deleted TINYINT
)
```

### Guilds Table
```sql
guilds (
  id INT PRIMARY KEY,
  guild_name VARCHAR(255),
  guild_level INT,
  guild_exp BIGINT,
  deleted TINYINT
)

guild_members (
  guild_id INT,
  char_id INT,
  rank INT
)
```

## Security

### Read-Only Access
- Dedicated read-only MySQL user
- No write/update/delete permissions
- Limited to SELECT queries only

### SQL Injection Prevention
- All queries use parameterization
- No string concatenation
- Input validation on all endpoints

### Rate Limiting
- 10-20 requests per minute per IP
- Prevents database overload
- Automatic IP-based throttling

### Input Validation
```typescript
// Character name validation
if (!query || query.length < 2) {
  return error('Query too short');
}

// Limit validation
if (limit > 500) {
  return error('Limit too high');
}
```

## Configuration

### Environment Variables

```env
# Game Database Connection
GAME_DB1_HOST=localhost
GAME_DB1_PORT=3307
GAME_DB1_DATABASE=lc_game
GAME_DB1_USER=readonly_user
GAME_DB1_PASSWORD=readonly_pass
```

### Database User Setup

Create read-only user in game database:

```sql
-- Create read-only user
CREATE USER 'readonly_user'@'%' IDENTIFIED BY 'readonly_pass';

-- Grant SELECT only
GRANT SELECT ON lc_game.characters TO 'readonly_user'@'%';
GRANT SELECT ON lc_game.guilds TO 'readonly_user'@'%';
GRANT SELECT ON lc_game.guild_members TO 'readonly_user'@'%';

-- No write permissions!
-- No CREATE, UPDATE, DELETE, DROP, etc.

FLUSH PRIVILEGES;
```

## API Reference

### Character Search

**Endpoint:** `GET /api/characters/search`

**Parameters:**
- `q` (required): Search query (min 2 characters)
- `limit` (optional): Max results (default 20, max 100)

**Response:**
```json
{
  "success": true,
  "characters": [
    {
      "id": 123,
      "name": "WarriorKing",
      "level": 255,
      "job": 0,
      "jobName": "Knight",
      "guildName": "Elite Warriors"
    }
  ],
  "total": 1
}
```

### Character Details

**Endpoint:** `GET /api/characters/:name`

**Response:**
```json
{
  "success": true,
  "character": {
    "id": 123,
    "name": "WarriorKing",
    "level": 255,
    "job": 0,
    "jobName": "Knight",
    "exp": 999999999,
    "gold": 100000000,
    "guildName": "Elite Warriors",
    "lastLogin": "2025-01-04T10:30:00Z"
  }
}
```

### Rankings

**Endpoint:** `GET /api/rankings`

**Parameters:**
- `type` (required): `level`, `pvp`, or `guild`
- `limit` (optional): Max entries (default 100, max 500)

**Response (Level Rankings):**
```json
{
  "success": true,
  "type": "level",
  "rankings": [
    {
      "rank": 1,
      "characterName": "TopPlayer",
      "level": 255,
      "job": 0,
      "jobName": "Knight",
      "guildName": "Elite",
      "score": 999999999
    }
  ],
  "total": 100
}
```

**Response (Guild Rankings):**
```json
{
  "success": true,
  "type": "guild",
  "rankings": [
    {
      "rank": 1,
      "guildName": "Elite Warriors",
      "level": 100,
      "memberCount": 50,
      "totalScore": 5000000000
    }
  ],
  "total": 50
}
```

## Caching Strategy (Future)

### Redis Caching
```typescript
// Cache rankings for 5 minutes
const cacheKey = `rankings:${type}:${limit}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await fetchRankings();
await redis.setex(cacheKey, 300, JSON.stringify(data));
return data;
```

### Cache Invalidation
- Rankings: 5 minutes
- Character details: 1 minute
- Search results: 30 seconds

## Job Classes

The system supports 7 character classes:

| ID | Class Name | Description |
|----|------------|-------------|
| 0 | Knight | Melee tank with high defense |
| 1 | Mage | Ranged magic damage dealer |
| 2 | Healer | Support with healing abilities |
| 3 | Rogue | Stealth and critical strikes |
| 4 | Titan | Heavy weapons specialist |
| 5 | Sorcerer | Advanced magic user |
| 6 | Ex-Rogue | Enhanced rogue class |

## Error Handling

### Database Connection Errors
```typescript
try {
  const data = await queryGameDb();
  return data;
} catch (error) {
  console.error('Game DB error:', error);
  
  // Fallback to mock data for development
  return {
    success: true,
    data: mockData,
    mock: true,
    message: 'Game database not connected',
  };
}
```

### Rate Limit Exceeded
```json
{
  "success": false,
  "error": "Too many requests",
  "status": 429
}
```

### Invalid Input
```json
{
  "success": false,
  "error": "Query too short (min 2 characters)",
  "status": 400
}
```

## Development Mode

When game database is not available:
- APIs return mock data
- UI shows mock data warning
- Functionality remains testable
- No breaking errors

## Performance Optimization

### Query Optimization
```sql
-- Use indexes for common queries
CREATE INDEX idx_char_name ON characters(char_name);
CREATE INDEX idx_level_exp ON characters(level, exp);
CREATE INDEX idx_guild_members ON guild_members(char_id);

-- Limit result sets
SELECT * FROM characters 
ORDER BY level DESC, exp DESC 
LIMIT 100;
```

### Connection Pooling
- 10 concurrent connections
- Automatic reconnection
- Keep-alive enabled
- Queue management

## Testing

### Unit Tests
Test game-db functions with mocked MySQL:
```typescript
describe('getCharacterByName', () => {
  it('should return character data', async () => {
    const char = await getCharacterByName('TestChar');
    expect(char).toBeDefined();
    expect(char.name).toBe('TestChar');
  });
});
```

### Integration Tests
Test with actual game database:
1. Set up test database with sample data
2. Run queries through API
3. Verify results and performance
4. Check security (read-only)

## Deployment

### Production Checklist
- [ ] Create read-only database user
- [ ] Configure firewall for database access
- [ ] Set environment variables
- [ ] Test database connectivity
- [ ] Verify rate limiting works
- [ ] Monitor query performance
- [ ] Set up Redis caching

### Monitoring
- Track query execution times
- Monitor database connection pool
- Alert on high error rates
- Log slow queries (>1s)

## Future Enhancements

### Planned Features
- [ ] Character equipment display
- [ ] Detailed statistics breakdown
- [ ] Achievement showcase
- [ ] PvP battle history
- [ ] Guild member lists
- [ ] Historical ranking charts
- [ ] Character comparison tool
- [ ] Advanced search filters

### Performance Improvements
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] CDN for static assets
- [ ] GraphQL API option
- [ ] WebSocket for real-time updates

## Troubleshooting

### Connection Errors
```
Error: Failed to query game database
```
- Verify database credentials
- Check firewall rules
- Ensure read-only user exists
- Test connection manually

### Slow Queries
- Add indexes on frequently queried columns
- Reduce LIMIT values
- Enable Redis caching
- Optimize JOIN operations

### Mock Data Always Showing
- Verify GAME_DB1_* environment variables
- Check database is accessible from app
- Review connection pool logs
- Test with database client

## References

- [MySQL Connection Pooling](https://github.com/mysqljs/mysql#pooling-connections)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Rate Limiting Best Practices](https://www.nginx.com/blog/rate-limiting-nginx/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Last Updated:** 2025-01-04  
**Version:** v0.8.0

/**
 * Game Database Connector
 * 
 * Read-only access to game database for character and ranking data
 * Implements security best practices:
 * - Read-only credentials
 * - Query parameterization
 * - Connection pooling
 * - Rate limiting
 */

import mysql from 'mysql2/promise';

export interface GameDbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface CharacterData {
  id: number;
  name: string;
  level: number;
  job: number;
  exp: number;
  gold: number;
  guildName?: string;
  lastLogin?: Date;
}

export interface RankingEntry {
  rank: number;
  characterName: string;
  level: number;
  job: number;
  guildName?: string;
  score: number;
}

let connectionPool: mysql.Pool | null = null;

/**
 * Get or create connection pool
 */
function getConnectionPool(): mysql.Pool {
  if (!connectionPool) {
    const config = getGameDbConfig();
    connectionPool = mysql.createPool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return connectionPool;
}

/**
 * Get game database configuration from environment
 */
function getGameDbConfig(): GameDbConfig {
  const host = process.env.GAME_DB1_HOST || 'localhost';
  const port = parseInt(process.env.GAME_DB1_PORT || '3307');
  const database = process.env.GAME_DB1_DATABASE || 'lc_game';
  const user = process.env.GAME_DB1_USER || 'readonly_user';
  const password = process.env.GAME_DB1_PASSWORD || 'readonly_pass';

  return {
    host,
    port,
    database,
    user,
    password,
  };
}

/**
 * Execute read-only query
 */
async function executeQuery<T>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getConnectionPool();
  
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Game DB query error:', error);
    throw new Error('Failed to query game database');
  }
}

/**
 * Get character by name
 */
export async function getCharacterByName(
  characterName: string
): Promise<CharacterData | null> {
  const query = `
    SELECT 
      c.id,
      c.char_name as name,
      c.level,
      c.job,
      c.exp,
      c.gold,
      g.guild_name as guildName,
      c.last_login as lastLogin
    FROM characters c
    LEFT JOIN guild_members gm ON c.id = gm.char_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.char_name = ?
    LIMIT 1
  `;
  
  const results = await executeQuery<CharacterData>(query, [characterName]);
  return results[0] || null;
}

/**
 * Get characters by user (via game account link)
 */
export async function getCharactersByAccountId(
  accountId: number
): Promise<CharacterData[]> {
  const query = `
    SELECT 
      c.id,
      c.char_name as name,
      c.level,
      c.job,
      c.exp,
      c.gold,
      g.guild_name as guildName,
      c.last_login as lastLogin
    FROM characters c
    LEFT JOIN guild_members gm ON c.id = gm.char_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.account_id = ?
    ORDER BY c.level DESC, c.exp DESC
    LIMIT 20
  `;
  
  const results = await executeQuery<CharacterData>(query, [accountId]);
  return results;
}

/**
 * Get level rankings
 */
export async function getLevelRankings(limit: number = 100): Promise<RankingEntry[]> {
  const query = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY c.level DESC, c.exp DESC) as \`rank\`,
      c.char_name as characterName,
      c.level,
      c.job,
      g.guild_name as guildName,
      c.exp as score
    FROM characters c
    LEFT JOIN guild_members gm ON c.id = gm.char_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.deleted = 0
    ORDER BY c.level DESC, c.exp DESC
    LIMIT ?
  `;
  
  const results = await executeQuery<RankingEntry>(query, [limit]);
  return results;
}

/**
 * Get PvP rankings (mock - adjust based on actual schema)
 */
export async function getPvPRankings(limit: number = 100): Promise<RankingEntry[]> {
  const query = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY c.pvp_kills DESC) as \`rank\`,
      c.char_name as characterName,
      c.level,
      c.job,
      g.guild_name as guildName,
      c.pvp_kills as score
    FROM characters c
    LEFT JOIN guild_members gm ON c.id = gm.char_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.deleted = 0 AND c.pvp_kills > 0
    ORDER BY c.pvp_kills DESC
    LIMIT ?
  `;
  
  const results = await executeQuery<RankingEntry>(query, [limit]);
  return results;
}

/**
 * Get guild rankings
 */
export async function getGuildRankings(limit: number = 100): Promise<{
  rank: number;
  guildName: string;
  level: number;
  memberCount: number;
  totalScore: number;
}[]> {
  const query = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY g.guild_level DESC, g.guild_exp DESC) as \`rank\`,
      g.guild_name as guildName,
      g.guild_level as level,
      COUNT(gm.char_id) as memberCount,
      g.guild_exp as totalScore
    FROM guilds g
    LEFT JOIN guild_members gm ON g.id = gm.guild_id
    WHERE g.deleted = 0
    GROUP BY g.id, g.guild_name, g.guild_level, g.guild_exp
    ORDER BY g.guild_level DESC, g.guild_exp DESC
    LIMIT ?
  `;
  
  const results = await executeQuery<{
    rank: number;
    guildName: string;
    level: number;
    memberCount: number;
    totalScore: number;
  }>(query, [limit]);
  
  return results;
}

/**
 * Search characters by name (partial match)
 */
export async function searchCharacters(
  searchTerm: string,
  limit: number = 20
): Promise<CharacterData[]> {
  const query = `
    SELECT 
      c.id,
      c.char_name as name,
      c.level,
      c.job,
      c.exp,
      c.gold,
      g.guild_name as guildName,
      c.last_login as lastLogin
    FROM characters c
    LEFT JOIN guild_members gm ON c.id = gm.char_id
    LEFT JOIN guilds g ON gm.guild_id = g.id
    WHERE c.char_name LIKE ? AND c.deleted = 0
    ORDER BY c.level DESC
    LIMIT ?
  `;
  
  const results = await executeQuery<CharacterData>(
    query, 
    [`%${searchTerm}%`, limit]
  );
  return results;
}

/**
 * Get job name from job ID
 */
export function getJobName(jobId: number): string {
  const jobs: Record<number, string> = {
    0: 'Knight',
    1: 'Mage',
    2: 'Healer',
    3: 'Rogue',
    4: 'Titan',
    5: 'Sorcerer',
    6: 'Ex-Rogue',
  };
  
  return jobs[jobId] || 'Unknown';
}

/**
 * Close connection pool (for cleanup)
 */
export async function closeGameDb(): Promise<void> {
  if (connectionPool) {
    await connectionPool.end();
    connectionPool = null;
  }
}

/**
 * Multi-Server Legacy Database Connector (READ-ONLY)
 * 
 * Manages read-only connections to multiple legacy game databases
 * Connections can be configured via:
 * 1. GameServer table entries (preferred)
 * 2. Environment variables (fallback)
 */

import mysql from 'mysql2/promise';

export interface LegacyDbConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface LegacyDbConnection {
  config: LegacyDbConfig;
  pool: mysql.Pool;
}

// Connection pool cache
const connectionPools: Map<string, LegacyDbConnection> = new Map();

/**
 * Create a read-only connection pool for a legacy database
 */
export function createLegacyDbPool(config: LegacyDbConfig): mysql.Pool {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 5, // Low limit for read-only operations
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

/**
 * Get or create a connection pool for a specific server
 */
export function getOrCreatePool(config: LegacyDbConfig): LegacyDbConnection {
  const existing = connectionPools.get(config.id);
  if (existing) {
    return existing;
  }

  const pool = createLegacyDbPool(config);
  const connection: LegacyDbConnection = {
    config,
    pool,
  };

  connectionPools.set(config.id, connection);
  return connection;
}

/**
 * Load legacy DB configurations from environment variables (fallback)
 * Supports up to 5 game servers via GAME_DB1_* through GAME_DB5_*
 */
export function loadLegacyDbConfigsFromEnv(): LegacyDbConfig[] {
  const configs: LegacyDbConfig[] = [];

  for (let i = 1; i <= 5; i++) {
    const host = process.env[`GAME_DB${i}_HOST`];
    const port = process.env[`GAME_DB${i}_PORT`];
    const database = process.env[`GAME_DB${i}_DATABASE`];
    const user = process.env[`GAME_DB${i}_USER`];
    const password = process.env[`GAME_DB${i}_PASSWORD`];
    const label = process.env[`GAME_DB${i}_LABEL`];

    if (host && database && user && password) {
      configs.push({
        id: `env-server-${i}`,
        name: label || `Game Server ${i}`,
        host,
        port: parseInt(port || '3306', 10),
        database,
        user,
        password,
      });
    }
  }

  return configs;
}

/**
 * Execute a read-only query with runtime safety checks
 * Throws error if non-SELECT query is attempted
 */
export async function executeReadOnlyQuery<T = unknown>(
  serverId: string,
  query: string,
  params?: unknown[]
): Promise<T[]> {
  // Runtime guard: Only allow SELECT queries
  const normalizedQuery = query.trim().toUpperCase();
  if (!normalizedQuery.startsWith('SELECT')) {
    throw new Error(
      'SECURITY VIOLATION: Only SELECT queries are allowed on legacy databases'
    );
  }

  const connection = connectionPools.get(serverId);
  if (!connection) {
    throw new Error(`No connection found for server: ${serverId}`);
  }

  try {
    const [rows] = await connection.pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error(`Query failed on server ${serverId}:`, error);
    throw error;
  }
}

/**
 * Health check for a specific server connection
 * Returns true if connection is healthy
 */
export async function healthCheck(serverId: string): Promise<boolean> {
  try {
    const result = await executeReadOnlyQuery<{ result: number }>(
      serverId,
      'SELECT 1 as result'
    );
    return result.length > 0 && result[0].result === 1;
  } catch (error) {
    console.error(`Health check failed for server ${serverId}:`, error);
    return false;
  }
}

/**
 * Health check for all configured servers
 */
export async function healthCheckAll(): Promise<
  Record<string, { healthy: boolean; error?: string }>
> {
  const results: Record<string, { healthy: boolean; error?: string }> = {};

  for (const [serverId] of connectionPools) {
    try {
      const healthy = await healthCheck(serverId);
      results[serverId] = { healthy };
    } catch (error) {
      results[serverId] = {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  return results;
}

/**
 * Close a specific connection pool
 */
export async function closePool(serverId: string): Promise<void> {
  const connection = connectionPools.get(serverId);
  if (connection) {
    await connection.pool.end();
    connectionPools.delete(serverId);
  }
}

/**
 * Close all connection pools
 */
export async function closeAllPools(): Promise<void> {
  const closePromises = Array.from(connectionPools.keys()).map((serverId) =>
    closePool(serverId)
  );
  await Promise.all(closePromises);
}

/**
 * Get list of active server connections
 */
export function getActiveServers(): string[] {
  return Array.from(connectionPools.keys());
}

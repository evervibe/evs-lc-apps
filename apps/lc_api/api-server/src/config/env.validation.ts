import { z } from 'zod';

/**
 * Environment variable validation schema
 * Validates all required environment variables at application startup
 */
const envSchema = z.object({
  // Server Configuration
  API_PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // PostgreSQL Portal Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  
  // Redis Configuration
  REDIS_URL: z.string().url('REDIS_URL must be a valid Redis connection string'),

  // JWT Configuration
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters long'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  JWT_ISSUER: z.string().default('lc-api'),
  JWT_AUDIENCE: z.string().default('lc-clients'),

  // TOTP Configuration
  TOTP_ISSUER: z.string().default('LastChaos'),
  TOTP_WINDOW: z.coerce.number().default(1),

  // CORS Configuration
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  // MySQL AUTH Database
  MYSQL_AUTH_HOST: z.string().default('127.0.0.1'),
  MYSQL_AUTH_PORT: z.coerce.number().default(3306),
  MYSQL_AUTH_USER: z.string(),
  MYSQL_AUTH_PASS: z.string(),
  MYSQL_AUTH_DB: z.string(),

  // MySQL GAME Database
  MYSQL_GAME_HOST: z.string().default('127.0.0.1'),
  MYSQL_GAME_PORT: z.coerce.number().default(3306),
  MYSQL_GAME_USER: z.string(),
  MYSQL_GAME_PASS: z.string(),
  MYSQL_GAME_DB: z.string(),

  // MySQL DATA Database
  MYSQL_DATA_HOST: z.string().default('127.0.0.1'),
  MYSQL_DATA_PORT: z.coerce.number().default(3306),
  MYSQL_DATA_USER: z.string(),
  MYSQL_DATA_PASS: z.string(),
  MYSQL_DATA_DB: z.string(),

  // MySQL LOGS Database
  MYSQL_LOGS_HOST: z.string().default('127.0.0.1'),
  MYSQL_LOGS_PORT: z.coerce.number().default(3306),
  MYSQL_LOGS_USER: z.string(),
  MYSQL_LOGS_PASS: z.string(),
  MYSQL_LOGS_DB: z.string(),

  // MySQL Write User
  MYSQL_EXEC_USER: z.string(),
  MYSQL_EXEC_PASS: z.string(),
});

export type Environment = z.infer<typeof envSchema>;

/**
 * Validates and parses environment variables
 * Throws an error if validation fails
 */
export function validateEnvironment(): Environment {
  try {
    const env = envSchema.parse(process.env);
    console.log('[ENV] Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[ENV] Environment validation failed:');
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid environment configuration. Please check your .env file.');
    }
    throw error;
  }
}

/**
 * Validated environment variables
 */
export const env = validateEnvironment();

#!/usr/bin/env node
/**
 * Seed Portal Database with Test Data
 * 
 * This script works independently of Prisma CLI and can run in restricted environments.
 * Uses mysql2 directly to insert test data.
 */

const mysql = require('mysql2/promise');
const { hash } = require('@node-rs/argon2');
const { randomUUID } = require('crypto');

const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

async function main() {
  console.log('🌱 Seeding Portal Database...');
  console.log('');

  // Get database credentials from environment
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306');
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'change_this_root_password';
  const database = process.env.DB_NAME || 'portal_db';

  console.log(`📡 Connecting to ${host}:${port}/${database}...`);

  // Connect to database
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
  });

  try {
    // Check if users already exist
    const [existingUsers] = await connection.execute(
      'SELECT email FROM users WHERE email IN (?, ?)',
      ['admin@example.com', 'user@example.com']
    );

    if (existingUsers.length > 0) {
      console.log('ℹ️  Test users already exist. Skipping user creation.');
      console.log('   To reset, delete the users and run again.');
    } else {
      // Hash passwords
      console.log('🔐 Hashing passwords...');
      const adminPasswordHash = await hash('admin123', ARGON2_OPTIONS);
      const userPasswordHash = await hash('user123', ARGON2_OPTIONS);

      // Create Admin User
      const adminId = randomUUID();
      await connection.execute(
        `INSERT INTO users (id, email, passwordHash, role, createdAt, updatedAt)
         VALUES (?, ?, ?, 'admin', NOW(3), NOW(3))`,
        [adminId, 'admin@example.com', adminPasswordHash]
      );
      console.log('✅ Admin user created: admin@example.com');

      // Create Normal User
      const userId = randomUUID();
      await connection.execute(
        `INSERT INTO users (id, email, passwordHash, role, createdAt, updatedAt)
         VALUES (?, ?, ?, 'user', NOW(3), NOW(3))`,
        [userId, 'user@example.com', userPasswordHash]
      );
      console.log('✅ Normal user created: user@example.com');
    }

    // Check if game server exists
    const [existingServers] = await connection.execute(
      'SELECT name FROM game_servers WHERE id = ?',
      ['legacy-local-docker']
    );

    if (existingServers.length > 0) {
      console.log('ℹ️  Game server already exists. Skipping server creation.');
    } else {
      // Create GameServer Entry for Legacy Local Docker
      const serverId = 'legacy-local-docker';
      await connection.execute(
        `INSERT INTO game_servers (id, name, region, driver, host, port, \`database\`, roUser, roPassEncrypted, createdAt)
         VALUES (?, ?, 'Local', 'mysql', 'localhost', 3307, 'lc_game', 'readonly_user', 'readonly_pass', NOW(3))`,
        [serverId, 'Legacy Local Docker']
      );
      console.log('✅ GameServer created: Legacy Local Docker');
    }

    console.log('');
    console.log('🎉 Seeding completed successfully!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Start the dev server: pnpm dev');
    console.log('   2. Access at: http://localhost:3000');
    console.log('   3. Check Mailhog UI: http://localhost:8025');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run with error handling
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

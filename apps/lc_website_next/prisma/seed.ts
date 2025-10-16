/**
 * Prisma Seed Script
 * 
 * Seeds the database with initial test data for local development:
 * - Admin user (admin@example.com / admin123)
 * - Normal user (user@example.com / user123)
 * - GameServer entry for Legacy Local Docker
 */

import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const adminPasswordHash = await hash('admin123', ARGON2_OPTIONS);
  const userPasswordHash = await hash('user123', ARGON2_OPTIONS);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Normal User
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'user',
    },
  });
  console.log('✅ Normal user created:', user.email);

  // Create GameServer Entry for Legacy Local Docker
  const gameServer = await prisma.gameServer.upsert({
    where: { id: 'legacy-local-docker' },
    update: {},
    create: {
      id: 'legacy-local-docker',
      name: 'Legacy Local Docker',
      region: 'Local',
      driver: 'mysql',
      host: 'localhost',
      port: 3307,
      database: 'lc_game',
      roUser: 'readonly_user',
      roPassEncrypted: 'readonly_pass', // In production, this should be encrypted
    },
  });
  console.log('✅ GameServer created:', gameServer.name);

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📝 Test Credentials:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User:  user@example.com / user123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

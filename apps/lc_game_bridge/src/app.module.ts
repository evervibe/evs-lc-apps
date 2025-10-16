import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { SyncController } from './controllers/sync.controller';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Task scheduling
    ScheduleModule.forRoot(),
    
    // Job queue with Redis
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0'),
      },
    }),
    
    // Register job queues
    BullModule.registerQueue(
      { name: 'character-sync' },
      { name: 'inventory-sync' },
      { name: 'guild-sync' },
    ),
  ],
  controllers: [SyncController],
  providers: [],
})
export class AppModule {}

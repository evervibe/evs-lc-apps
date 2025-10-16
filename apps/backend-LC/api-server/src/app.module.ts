import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RedeemModule } from './modules/redeem/redeem.module';
import { NewsModule } from './modules/news/news.module';
import { VotesModule } from './modules/votes/votes.module';
import { GameModule } from './modules/game/game.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    PaymentsModule,
    RedeemModule,
    NewsModule,
    VotesModule,
    GameModule,
  ],
})
export class AppModule {}

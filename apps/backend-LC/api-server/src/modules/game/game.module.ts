import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MySQLConnector } from '../../connectors/mysql.connector';

@Module({
  controllers: [GameController],
  providers: [GameService, MySQLConnector],
  exports: [GameService, MySQLConnector],
})
export class GameModule {}

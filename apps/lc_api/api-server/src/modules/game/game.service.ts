import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MySQLConnector } from '../../connectors/mysql.connector';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private mysqlConnector: MySQLConnector,
  ) {}

  async createGameAccount(portalUserId: bigint, username: string, password: string, email: string, serverId: string) {
    const execPool = this.mysqlConnector.getExecPool();
    
    try {
      // Call stored procedure to create game account
      await execPool.query(
        'CALL sp_create_game_account(?, ?, ?, @user_code)',
        [username, password, email]
      );
      
      const [userCodeResult] = await execPool.query('SELECT @user_code as userCode');
      const gameUserCode = (userCodeResult as any)[0]?.userCode;

      if (!gameUserCode) {
        throw new Error('Failed to create game account');
      }

      // Link account in portal
      await this.prisma.portalGameAccount.create({
        data: {
          portalUserId,
          gameUserCode: BigInt(gameUserCode),
          serverId,
          isPrimary: true,
        },
      });

      // Log activity
      await this.prisma.portalActivityLog.create({
        data: {
          userId: portalUserId,
          action: 'game_account_create',
          metadata: { gameUserCode, serverId },
        },
      });

      return { success: true, gameUserCode };
    } catch (error) {
      throw new Error(`Failed to create game account: ${error.message}`);
    }
  }

  async addCash(gameUserCode: number, amount: number, reason: string, portalUserId: bigint) {
    const execPool = this.mysqlConnector.getExecPool();

    try {
      await execPool.query(
        'CALL sp_add_cash(?, ?, ?)',
        [gameUserCode, amount, reason]
      );

      // Log activity
      await this.prisma.portalActivityLog.create({
        data: {
          userId: portalUserId,
          action: 'cash_grant',
          metadata: { gameUserCode, amount, reason },
        },
      });

      return { success: true, gameUserCode, amount };
    } catch (error) {
      throw new Error(`Failed to add cash: ${error.message}`);
    }
  }

  async getCharacters(serverId?: string, userCode?: number) {
    const gamePool = this.mysqlConnector.getGamePool();
    
    let query = 'SELECT char_id, char_name, user_code, level, exp, class, create_date FROM t_characters';
    const params: any[] = [];
    
    if (userCode) {
      query += ' WHERE user_code = ?';
      params.push(userCode);
    }
    
    query += ' ORDER BY level DESC LIMIT 100';
    
    const [rows] = await gamePool.query(query, params);
    return rows;
  }

  async getGuilds() {
    const gamePool = this.mysqlConnector.getGamePool();
    
    const [rows] = await gamePool.query(
      'SELECT guild_id, guild_name, guild_level, create_date FROM t_guild ORDER BY guild_level DESC LIMIT 100'
    );
    
    return rows;
  }

  async getRankings(type: 'level' | 'exp', limit = 100) {
    const gamePool = this.mysqlConnector.getGamePool();
    
    const orderBy = type === 'level' ? 'level DESC, exp DESC' : 'exp DESC';
    
    const [rows] = await gamePool.query(
      `SELECT char_id, char_name, level, exp, class FROM t_characters ORDER BY ${orderBy} LIMIT ?`,
      [limit]
    );
    
    return rows;
  }

  async getGameAccountLink(portalUserId: bigint) {
    return this.prisma.portalGameAccount.findFirst({
      where: { portalUserId },
    });
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySQLConnector implements OnModuleInit {
  private authPool: mysql.Pool;
  private gamePool: mysql.Pool;
  private dataPool: mysql.Pool;
  private logsPool: mysql.Pool;
  private execPool: mysql.Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Auth DB connection (read-only)
    this.authPool = mysql.createPool({
      host: this.configService.get('MYSQL_AUTH_HOST'),
      port: parseInt(this.configService.get('MYSQL_AUTH_PORT', '3306'), 10),
      user: this.configService.get('MYSQL_AUTH_USER'),
      password: this.configService.get('MYSQL_AUTH_PASS'),
      database: this.configService.get('MYSQL_AUTH_DB'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Game DB connection (read-only)
    this.gamePool = mysql.createPool({
      host: this.configService.get('MYSQL_GAME_HOST'),
      port: parseInt(this.configService.get('MYSQL_GAME_PORT', '3306'), 10),
      user: this.configService.get('MYSQL_GAME_USER'),
      password: this.configService.get('MYSQL_GAME_PASS'),
      database: this.configService.get('MYSQL_GAME_DB'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Data DB connection (read-only)
    this.dataPool = mysql.createPool({
      host: this.configService.get('MYSQL_DATA_HOST'),
      port: parseInt(this.configService.get('MYSQL_DATA_PORT', '3306'), 10),
      user: this.configService.get('MYSQL_DATA_USER'),
      password: this.configService.get('MYSQL_DATA_PASS'),
      database: this.configService.get('MYSQL_DATA_DB'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Logs DB connection (read-only)
    this.logsPool = mysql.createPool({
      host: this.configService.get('MYSQL_LOGS_HOST'),
      port: parseInt(this.configService.get('MYSQL_LOGS_PORT', '3306'), 10),
      user: this.configService.get('MYSQL_LOGS_USER'),
      password: this.configService.get('MYSQL_LOGS_PASS'),
      database: this.configService.get('MYSQL_LOGS_DB'),
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });

    // Exec pool for stored procedures (write)
    this.execPool = mysql.createPool({
      host: this.configService.get('MYSQL_AUTH_HOST'),
      port: parseInt(this.configService.get('MYSQL_AUTH_PORT', '3306'), 10),
      user: this.configService.get('MYSQL_EXEC_USER'),
      password: this.configService.get('MYSQL_EXEC_PASS'),
      database: this.configService.get('MYSQL_AUTH_DB'),
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }

  getAuthPool(): mysql.Pool {
    return this.authPool;
  }

  getGamePool(): mysql.Pool {
    return this.gamePool;
  }

  getDataPool(): mysql.Pool {
    return this.dataPool;
  }

  getLogsPool(): mysql.Pool {
    return this.logsPool;
  }

  getExecPool(): mysql.Pool {
    return this.execPool;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.authPool.query('SELECT 1');
      await this.gamePool.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
}

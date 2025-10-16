import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('account/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create game account' })
  async createAccount(@CurrentUser() user: any, @Body() body: any) {
    return this.gameService.createGameAccount(
      BigInt(user.userId),
      body.username,
      body.password,
      body.email,
      body.serverId || 'main'
    );
  }

  @Post('cash/grant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Grant cash to game account (admin only)' })
  async grantCash(@CurrentUser() user: any, @Body() body: any) {
    return this.gameService.addCash(
      body.gameUserCode,
      body.amount,
      body.reason || 'admin_grant',
      BigInt(user.userId)
    );
  }

  @Get('characters')
  @ApiOperation({ summary: 'Get characters' })
  async getCharacters(
    @Query('serverId') serverId?: string,
    @Query('userCode') userCode?: string,
  ) {
    const userCodeNum = userCode ? parseInt(userCode, 10) : undefined;
    return this.gameService.getCharacters(serverId, userCodeNum);
  }

  @Get('guilds')
  @ApiOperation({ summary: 'Get guilds' })
  async getGuilds() {
    return this.gameService.getGuilds();
  }

  @Get('rankings/level')
  @ApiOperation({ summary: 'Get level rankings' })
  async getLevelRankings(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.gameService.getRankings('level', limitNum);
  }

  @Get('account/link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get game account link' })
  async getAccountLink(@CurrentUser() user: any) {
    return this.gameService.getGameAccountLink(BigInt(user.userId));
  }
}

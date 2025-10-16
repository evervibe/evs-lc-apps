import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('votes')
@Controller('votes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user votes' })
  async findAll(@CurrentUser() user: any) {
    return this.votesService.findAll(BigInt(user.userId));
  }

  @Post()
  @ApiOperation({ summary: 'Register a vote' })
  async create(@CurrentUser() user: any, @Body() body: { site: string }, @Req() req: any) {
    return this.votesService.create(BigInt(user.userId), body.site, req.ip);
  }
}

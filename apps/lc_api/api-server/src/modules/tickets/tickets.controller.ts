import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a support ticket' })
  async create(@CurrentUser() user: any, @Body() body: any) {
    return this.ticketsService.create(BigInt(user.userId), body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user tickets' })
  async findAll(@CurrentUser() user: any) {
    return this.ticketsService.findAll(BigInt(user.userId));
  }
}

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RedeemService } from './redeem.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('redeem')
@Controller('redeem')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) {}

  @Post('claim')
  @ApiOperation({ summary: 'Claim a redeem code' })
  async claim(@CurrentUser() user: any, @Body() body: { code: string }) {
    return this.redeemService.claim(BigInt(user.userId), body.code);
  }
}

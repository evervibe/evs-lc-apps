import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedeemService {
  constructor(private prisma: PrismaService) {}

  async claim(userId: bigint, code: string) {
    const redeemCode = await this.prisma.portalRedeemCode.findUnique({
      where: { code },
    });

    if (!redeemCode) {
      throw new BadRequestException('Invalid code');
    }

    if (redeemCode.status !== 0) {
      throw new BadRequestException('Code already used');
    }

    // Mark as used
    await this.prisma.portalRedeemCode.update({
      where: { code },
      data: {
        status: 1,
        usedBy: userId,
        usedAt: new Date(),
      },
    });

    // Log activity
    await this.prisma.portalActivityLog.create({
      data: {
        userId,
        action: 'redeem_claim',
        metadata: { code, type: redeemCode.redeemType, value: redeemCode.value },
      },
    });

    return {
      success: true,
      type: redeemCode.redeemType,
      value: redeemCode.value,
    };
  }
}

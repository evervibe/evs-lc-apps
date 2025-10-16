import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: bigint) {
    return this.prisma.portalPayment.findMany({
      where: {
        custom: userId.toString(),
      },
      orderBy: { createdtime: 'desc' },
    });
  }
}

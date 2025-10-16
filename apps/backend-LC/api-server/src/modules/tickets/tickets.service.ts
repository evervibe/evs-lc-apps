import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: bigint, data: { category: string; description: string }) {
    return this.prisma.portalTicket.create({
      data: {
        account: userId,
        category: data.category,
        description: data.description,
        status: 'open',
        priority: 0,
      },
    });
  }

  async findAll(userId: bigint) {
    return this.prisma.portalTicket.findMany({
      where: { account: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

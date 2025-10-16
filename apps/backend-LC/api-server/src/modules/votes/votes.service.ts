import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: bigint) {
    return this.prisma.portalVote.findMany({
      where: { accountId: userId },
      orderBy: { votedAt: 'desc' },
    });
  }

  async create(userId: bigint, site: string, ipAddress: string) {
    return this.prisma.portalVote.create({
      data: {
        accountId: userId,
        site,
        accountIp: ipAddress,
        votedAt: new Date(),
      },
    });
  }
}

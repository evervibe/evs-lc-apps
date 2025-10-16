import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: number) {
    return this.prisma.portalNews.findMany({
      where: category ? { category } : undefined,
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
  }
}

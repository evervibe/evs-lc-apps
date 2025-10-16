import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: bigint) {
    return this.prisma.portalUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: bigint, data: { email?: string }) {
    return this.prisma.portalUser.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
      },
    });
  }
}

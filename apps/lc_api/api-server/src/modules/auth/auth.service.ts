import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.portalUser.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { email: dto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });

    // Create user
    const user = await this.prisma.portalUser.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash,
        status: 'active',
        security: {
          create: {},
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    // Log activity
    await this.prisma.portalActivityLog.create({
      data: {
        userId: user.id,
        action: 'register',
        metadata: { username: user.username },
      },
    });

    return user;
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    // Find user
    const user = await this.prisma.portalUser.findFirst({
      where: {
        OR: [
          { username: dto.usernameOrEmail },
          { email: dto.usernameOrEmail },
        ],
      },
      include: {
        security: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.security?.lockedUntil && user.security.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.prisma.portalUserSecurity.update({
        where: { userId: user.id },
        data: {
          failedLoginAttempts: { increment: 1 },
          lockedUntil: (user.security?.failedLoginAttempts || 0) >= 4
            ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
            : null,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check TOTP if enabled
    if (user.security?.totpEnabled && dto.totpCode) {
      const isValid = authenticator.verify({
        token: dto.totpCode,
        secret: user.security.totpSecret || '',
      });
      if (!isValid) {
        throw new UnauthorizedException('Invalid TOTP code');
      }
    } else if (user.security?.totpEnabled && !dto.totpCode) {
      throw new UnauthorizedException('TOTP code required');
    }

    // Reset failed attempts
    await this.prisma.portalUserSecurity.update({
      where: { userId: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Generate tokens
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles.map((ur: any) => ur.role.name),
      permissions: user.roles.flatMap((ur: any) =>
        ur.role.permissions.map((rp: any) => rp.permission.name)
      ),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TTL', '7d'),
    });

    // Log activity
    await this.prisma.portalActivityLog.create({
      data: {
        userId: user.id,
        action: 'login',
        ipAddress,
        userAgent,
        metadata: { success: true },
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    };
  }

  async setupTotp(userId: bigint) {
    const user = await this.prisma.portalUser.findUnique({
      where: { id: userId },
      include: { security: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    const issuer = this.configService.get<string>('TOTP_ISSUER', 'LastChaos');
    const otpauthUrl = authenticator.keyuri(user.username, issuer, secret);

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Save secret (but don't enable yet)
    await this.prisma.portalUserSecurity.update({
      where: { userId: user.id },
      data: { totpSecret: secret },
    });

    return {
      secret,
      qrCode,
      otpauthUrl,
    };
  }

  async verifyTotp(userId: bigint, token: string) {
    const security = await this.prisma.portalUserSecurity.findUnique({
      where: { userId },
    });

    if (!security?.totpSecret) {
      throw new UnauthorizedException('TOTP not set up');
    }

    const isValid = authenticator.verify({
      token,
      secret: security.totpSecret,
    });

    if (isValid) {
      // Enable TOTP
      await this.prisma.portalUserSecurity.update({
        where: { userId },
        data: { totpEnabled: true },
      });

      return { success: true, message: 'TOTP enabled successfully' };
    }

    throw new UnauthorizedException('Invalid TOTP code');
  }

  async validateUser(userId: bigint) {
    return this.prisma.portalUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
      },
    });
  }
}

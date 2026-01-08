import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
  ) {}

  /* ---------- REGISTER ---------- */
  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
      role: Role.CODER, // 🔒 FORZADO
    });

    return this.issueTokens(user);
  }

  /* ---------- LOGIN ---------- */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.issueTokens(user);
  }

  /* ---------- REFRESH TOKEN ---------- */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const storedTokens = await this.refreshRepo.find({
        where: { user: { id: payload.sub } },
        relations: ['user'],
      });

      let matchedToken: RefreshToken | null = null;

      for (const token of storedTokens) {
        const isMatch = await bcrypt.compare(refreshToken, token.token);
        if (isMatch) {
          matchedToken = token;
          break;
        }
      }

      if (!matchedToken) {
        throw new UnauthorizedException();
      }

      // 🔥 invalidamos todos los refresh anteriores
      await this.refreshRepo.delete({ user: { id: payload.sub } });

      return this.issueTokens(matchedToken.user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /* ---------- TOKEN GENERATION ---------- */
  private async issueTokens(user: any) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.refreshRepo.save({
      token: hashedRefresh,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

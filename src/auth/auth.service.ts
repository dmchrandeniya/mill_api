import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginSession } from './entities/login-session.entity';
import { RefreshSession } from './entities/refresh-session.entity';
import { AUTH_COOKIES, AuthCookiePayload } from './auth.types';

@Injectable()
export class AuthService {
  private accessTtlSeconds = 15 * 60; // 15m
  private refreshTtlSeconds = 30 * 24 * 60 * 60; // 30d

  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,

    @InjectRepository(LoginSession)
    private readonly sessionRepo: Repository<LoginSession>,

    @InjectRepository(RefreshSession)
    private readonly refreshRepo: Repository<RefreshSession>,
  ) {}

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const now = new Date();
    const session = await this.sessionRepo.save(
      this.sessionRepo.create({
        user_id: user.user_id,
        company_id: user.company_id,
        ip_address: ip ?? null,
        user_agent: userAgent ?? null,
        created_at: now,
        expires_at: new Date(now.getTime() + this.refreshTtlSeconds * 1000), // session lifetime can match refresh
        revoked_at: null,
      }),
    );

    const refresh = await this.refreshRepo.save(
      this.refreshRepo.create({
        session_id: session.session_id,
        expires_at: new Date(now.getTime() + this.refreshTtlSeconds * 1000),
        revoked_at: null,
      }),
    );

    const accessToken = this.signAccessToken({
      sid: session.session_id,
      uid: user.user_id,
      cid: user.company_id,
    });

    const refreshToken = this.signRefreshToken({
      sid: session.session_id,
      uid: user.user_id,
      cid: user.company_id,
      rid: refresh.refresh_id,
    });

    return {
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        company_id: user.company_id,
        branch_id: user.branch_id,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(sessionId: string) {
    await this.sessionRepo.update(
      { session_id: sessionId },
      { revoked_at: new Date() },
    );
    await this.refreshRepo.update(
      { session_id: sessionId },
      { revoked_at: new Date() },
    );
    return { message: 'Logged out' };
  }

  async refresh(refreshPayload: {
    sid: string;
    rid: string;
    uid: string;
    cid: string;
  }) {
    const session = await this.sessionRepo.findOne({
      where: {
        session_id: refreshPayload.sid,
        user_id: refreshPayload.uid,
        company_id: refreshPayload.cid,
        revoked_at: IsNull(),
        expires_at: MoreThan(new Date()),
      },
    });

    if (!session) throw new ForbiddenException('Session invalid');

    await this.sessionRepo.update(
      { session_id: session.session_id },
      { expires_at: new Date(Date.now() + this.refreshTtlSeconds * 1000) },
    );

    const refreshRow = await this.refreshRepo.findOne({
      where: {
        refresh_id: refreshPayload.rid,
        session_id: refreshPayload.sid,
        revoked_at: IsNull(),
        expires_at: MoreThan(new Date()),
      },
    });

    if (!refreshRow) throw new ForbiddenException('Refresh invalid');

    // Optional: rotate refresh token each time (recommended)
    await this.refreshRepo.update(
      { refresh_id: refreshRow.refresh_id },
      { revoked_at: new Date() },
    );

    const newRefresh = await this.refreshRepo.save(
      this.refreshRepo.create({
        session_id: session.session_id,
        expires_at: new Date(Date.now() + this.refreshTtlSeconds * 1000),
        revoked_at: null,
      }),
    );

    const accessToken = this.signAccessToken({
      sid: session.session_id,
      uid: refreshPayload.uid,
      cid: refreshPayload.cid,
    });

    const refreshToken = this.signRefreshToken({
      sid: session.session_id,
      uid: refreshPayload.uid,
      cid: refreshPayload.cid,
      rid: newRefresh.refresh_id,
    });

    return { accessToken, refreshToken };
  }

  async logoutAll(user_id: string) {
    await this.sessionRepo.update(
      { user_id, revoked_at: IsNull() },
      { revoked_at: new Date() },
    );

    await this.refreshRepo.update(
      {
        session_id: In(
          (await this.sessionRepo.find({ where: { user_id } })).map(
            (s) => s.session_id,
          ),
        ),
      },
      { revoked_at: new Date() },
    );

    return { message: 'All sessions revoked' };
  }

  async getActiveSessions(user_id: string) {
    return this.sessionRepo.find({
      where: {
        user_id,
        revoked_at: IsNull(),
        expires_at: MoreThan(new Date()),
      },
      order: { created_at: 'DESC' },
    });
  }

  // -------- token helpers --------
  private signAccessToken(data: { sid: string; uid: string; cid: string }) {
    const payload: AuthCookiePayload = {
      sid: data.sid,
      uid: data.uid,
      cid: data.cid,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.accessTtlSeconds,
    };

    return this.jwt.sign(payload, { secret: process.env.JWT_ACCESS_SECRET });
  }

  private signRefreshToken(data: {
    sid: string;
    uid: string;
    cid: string;
    rid: string;
  }) {
    return this.jwt.sign(
      { ...data },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: this.refreshTtlSeconds,
      },
    );
  }

  getCookieNames() {
    return AUTH_COOKIES;
  }
}

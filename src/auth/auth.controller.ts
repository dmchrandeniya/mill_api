import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { CurrentAuth } from './decorators/current-user.decorator';
import { AUTH_COOKIES } from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { CsrfGuard } from './guards/csrf.guard';
import { randomBytes } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
  ) {}

  // ---------- AUTH ----------

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ??
      req.socket.remoteAddress ??
      '';
    const ua = req.headers['user-agent'] ?? '';

    const { user, accessToken, refreshToken } = await this.auth.login(
      dto,
      ip,
      ua,
    );

    this.setAuthCookies(res, accessToken, refreshToken);

    return { message: 'Logged in', user };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[AUTH_COOKIES.REFRESH];
    if (!token) return { message: 'Missing refresh cookie' };

    const payload = this.jwt.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const out = await this.auth.refresh(payload);
    this.setAuthCookies(res, out.accessToken, out.refreshToken);

    return { message: 'Refreshed' };
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@CurrentAuth() auth: any) {
    return { auth };
  }

  // ---------- LOGOUT ----------

  @Post('logout')
  @UseGuards(SessionAuthGuard, CsrfGuard)
  async logout(
    @CurrentAuth() auth: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(auth.sid);
    this.clearAuthCookies(res);
    return { message: 'Logged out' };
  }

  @Post('logout-all')
  @UseGuards(SessionAuthGuard, CsrfGuard)
  async logoutAll(@CurrentAuth() auth: any) {
    await this.auth.logoutAll(auth.uid);
    return { message: 'Logged out from all sessions' };
  }

  // ---------- SESSIONS ----------

  @Get('sessions')
  @UseGuards(SessionAuthGuard) // ✅ NO CSRF
  sessions(@CurrentAuth() auth: any) {
    return this.auth.getActiveSessions(auth.uid);
  }

  // ---------- COOKIES ----------

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie(AUTH_COOKIES.ACCESS, accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(AUTH_COOKIES.REFRESH, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/api/auth', // ✅ FIXED
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('mill_csrf', randomBytes(32).toString('hex'), {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(AUTH_COOKIES.ACCESS, { path: '/' });
    res.clearCookie(AUTH_COOKIES.REFRESH, { path: '/api/auth' });
  }
}

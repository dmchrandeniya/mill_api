import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_COOKIES, AuthCookiePayload } from '../auth.types';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    const token = req.cookies?.[AUTH_COOKIES.ACCESS];
    if (!token) throw new UnauthorizedException('Missing access cookie');

    try {
      const payload = this.jwt.verify<AuthCookiePayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      req.auth = payload; // attach
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access cookie');
    }
  }
}
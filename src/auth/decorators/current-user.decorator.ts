import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAuth = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.auth; // { sid, uid, cid, iat, exp }
});
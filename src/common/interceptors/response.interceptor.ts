import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> {
    const httpCtx = context.switchToHttp();
    const response = httpCtx.getResponse<Response>();
    const request = httpCtx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
        data,
      })),
    );
  }
}

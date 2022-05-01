import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data.hasOwnProperty('data') || data.hasOwnProperty('error')) {
          return data;
        } else if (typeof data === 'string') {
          return { message: data };
        } else {
          return { data };
        }
      }),
    );
  }
}

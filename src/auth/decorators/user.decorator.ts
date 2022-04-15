import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../entities/userpayload.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

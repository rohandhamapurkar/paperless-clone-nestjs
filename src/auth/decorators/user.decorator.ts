import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../dto/user-payload.dto';

/**
 * User
 * To extract req.user property from request
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

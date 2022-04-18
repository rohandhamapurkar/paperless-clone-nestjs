import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadDto } from '../dto/user-payload.dto';

/**
 * User
 * To extract req.user property from request
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayloadDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

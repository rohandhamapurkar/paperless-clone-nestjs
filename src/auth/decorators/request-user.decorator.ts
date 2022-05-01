import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserTokenDto } from '../dto/user-token-payload.dto';
/**
 * RequestUser decorator is to extract req.user property from request
 */
export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserTokenDto => {
    const request = ctx.switchToHttp().getRequest();
    return { ...request.user, _id: request.user.sub };
  },
);

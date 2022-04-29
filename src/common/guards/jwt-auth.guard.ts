import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard which uses the jwt auth strategy for user authorization
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard is guard class that uses the passportjs local strategy for
 * username and password authentication
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

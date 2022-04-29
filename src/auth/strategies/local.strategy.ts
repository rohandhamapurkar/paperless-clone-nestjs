import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import mongoose from 'mongoose';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserPayloadDto } from '../dto/user-payload.dto';

/**
 * LocalStrategy which extends PassportStrategy to provide a strategy for
 * username and password based authentication
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserPayloadDto> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: new mongoose.Types.ObjectId(user._id),
      _id: new mongoose.Types.ObjectId(user._id),
      username: user.username,
      type: user.type,
    };
  }
}

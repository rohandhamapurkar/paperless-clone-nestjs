import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../auth/dto/user-payload.dto';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

/**
 * JwtStrategy extends the passport strategy to create a
 * jwt authorization strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: UserPayloadDto): Promise<UserPayloadDto> {
    return {
      _id: new mongoose.Types.ObjectId(payload._id),
      id: new mongoose.Types.ObjectId(payload.id),
      username: payload.username,
      type: payload.type,
    };
  }
}

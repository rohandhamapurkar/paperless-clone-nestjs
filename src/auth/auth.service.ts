import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from './entities/userpayload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: UserPayload) {
    const payload = {
      id: user._id,
      _id: user._id,
      username: user.username,
      type: user.type,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

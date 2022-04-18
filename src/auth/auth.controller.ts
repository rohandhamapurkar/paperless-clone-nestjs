import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { UserPayloadDto } from './dto/user-payload.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: UserPayloadDto) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserData(@User() user: UserPayloadDto) {
    return user;
  }
}

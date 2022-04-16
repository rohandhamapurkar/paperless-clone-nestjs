import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { UserPayload } from './dto/user-payload.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: UserPayload) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserData(@User() user: UserPayload) {
    return user;
  }
}

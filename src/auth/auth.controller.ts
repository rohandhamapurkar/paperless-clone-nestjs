import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { UserPayloadDto } from './dto/user-payload.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: UserPayloadDto) {
    return this.authService.login(user);
  }

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    await this.authService.register(body);
    return 'Sent otp email successfully';
  }

  @Post('/verify-otp')
  async verifyEmailOtp(@Body() body: VerifyOtpDto) {
    return await this.authService.verifyOtp(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserData(@User() user: UserPayloadDto) {
    return user;
  }
}

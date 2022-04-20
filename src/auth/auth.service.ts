import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { GoogleService } from 'src/google/google.service';
import { UsersService } from 'src/users/users.service';
import { OTP_EMAIL_TEMPLATE } from './constants';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserPayloadDto } from './dto/user-payload.dto';
import { OtpSession } from './entities/otp-session.entity';
import * as bcrypt from 'bcrypt';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private saltOrRounds = 10;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly googleService: GoogleService,
    @InjectModel(OtpSession.name)
    private readonly otpSessionRespository: mongoose.Model<OtpSession>,
    @InjectConnection('paperless-db')
    private readonly connection: mongoose.Connection,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltOrRounds);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: UserPayloadDto) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }

  async register(userCredentials: RegisterUserDto) {
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const session = await this.connection.startSession();
    try {
      await session.startTransaction();
      const otpSession = await this.otpSessionRespository.create(
        [
          {
            username: userCredentials.username,
            password: await this.hashPassword(userCredentials.password),
            createdOn: new Date(),
            otp,
          },
        ],
        { session },
      );

      await otpSession[0].save({ session });

      const templateVariables: Record<string, string> = {
        '{{to}}': userCredentials.username,
        '{{from}}': this.googleService.GMAIL_USERNAME,
        '{{otpCode}}': otp,
      };

      const emailBody = OTP_EMAIL_TEMPLATE.replace(
        /\{\{\w+\}\}/g,
        function (all) {
          return templateVariables[all] || all;
        },
      ).trim();

      await this.googleService.sendEmail(emailBody);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      if (err.code === 11000) {
        throw new BadRequestException(
          'Otp already sent please try again after few minutes',
        );
      } else {
        throw err;
      }
    } finally {
      await session.endSession();
    }
  }

  async verifyOtp(verifyPayload: VerifyOtpDto) {
    const session = await this.connection.startSession();
    try {
      await session.startTransaction();
      const otpSession = await this.otpSessionRespository.findOneAndDelete(
        {
          ...verifyPayload,
        },
        { session },
      );

      if (!otpSession) throw new BadRequestException('Invalid otp');

      await this.usersService.create(
        {
          username: otpSession.username,
          password: otpSession.password,
        },
        session,
      );

      await session.commitTransaction();
      return 'Verification success';
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
}

import { IsString, IsEmail, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Length(6)
  otp: string;

  @IsEmail()
  username: string;
}

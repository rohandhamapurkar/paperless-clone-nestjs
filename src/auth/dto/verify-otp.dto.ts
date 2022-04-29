import { IsString, IsEmail, Length } from 'class-validator';

/**
 * VerifyOtpDto is used for verify otp request body validation
 */
export class VerifyOtpDto {
  @IsString()
  @Length(6)
  otp: string;

  @IsEmail()
  username: string;
}

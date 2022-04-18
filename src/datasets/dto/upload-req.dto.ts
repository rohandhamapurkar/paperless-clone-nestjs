import { IsNotEmpty } from 'class-validator';

export class UploadReqBodyDto {
  @IsNotEmpty()
  'name': string;
}

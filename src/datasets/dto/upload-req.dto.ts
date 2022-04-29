import { IsNotEmpty } from 'class-validator';

/**
 * For dataset upload endpoint request body validation
 */
export class UploadReqBodyDto {
  @IsNotEmpty()
  'name': string;
}

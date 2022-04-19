import { IsString, IsNotEmpty } from 'class-validator';

export class DatasetParamDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

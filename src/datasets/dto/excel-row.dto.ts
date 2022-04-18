import { IsNotEmpty, IsString } from 'class-validator';

export class ExcelRowDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

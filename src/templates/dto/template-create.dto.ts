import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

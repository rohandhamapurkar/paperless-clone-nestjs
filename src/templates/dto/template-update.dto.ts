import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TemplateUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}

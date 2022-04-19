import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateQueryParamDto {
  @IsString()
  @IsNotEmpty()
  filename: string;
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}

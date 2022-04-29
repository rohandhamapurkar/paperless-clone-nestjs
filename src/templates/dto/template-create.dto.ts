import { IsNotEmpty, IsString } from 'class-validator';

/**
 * create template endpoint name property validation
 */
export class TemplateCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

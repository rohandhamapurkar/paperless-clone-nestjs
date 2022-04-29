import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * template name validation for update
 */
export class TemplateUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}

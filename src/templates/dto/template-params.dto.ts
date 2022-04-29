import { IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { IsObjectId } from 'src/common/decorators/isobjectid.decorator';

/**
 * dto for template id param validation
 */
export class TemplateParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsObjectId()
  id: string;
}

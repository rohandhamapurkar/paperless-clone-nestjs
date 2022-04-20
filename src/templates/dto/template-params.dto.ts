import { IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { isObjectId } from 'src/common/decorators/isobjectid.decorator';

export class TemplateParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @isObjectId()
  id: string;
}

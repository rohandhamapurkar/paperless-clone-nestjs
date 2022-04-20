import { IsString, IsNotEmpty } from 'class-validator';
import { isObjectId } from 'src/common/decorators/isobjectid.decorator';

export class DatasetParamsDto {
  @IsString()
  @IsNotEmpty()
  @isObjectId()
  id: string;
}

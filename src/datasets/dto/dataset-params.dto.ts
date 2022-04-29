import { IsString, IsNotEmpty } from 'class-validator';
import { IsObjectId } from 'src/common/decorators/isobjectid.decorator';

/**
 * For dataset endpoint param validation
 */
export class DatasetParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsObjectId()
  id: string;
}

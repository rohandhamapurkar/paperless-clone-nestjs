import { IsString, IsDefined } from 'class-validator';
import { IsObjectId } from 'src/common/decorators/isobjectid.decorator';

/**
 * job changelog endpoint query param validation
 */
export class GetJobsChangelogDto {
  @IsObjectId()
  @IsString()
  @IsDefined()
  id: string;
}

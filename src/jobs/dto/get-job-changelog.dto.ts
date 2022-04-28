import { IsString, IsDefined } from 'class-validator';
import { isObjectId } from 'src/common/decorators/isobjectid.decorator';

export class GetJobsChangelogDto {
  @isObjectId()
  @IsString()
  @IsDefined()
  id: string;
}

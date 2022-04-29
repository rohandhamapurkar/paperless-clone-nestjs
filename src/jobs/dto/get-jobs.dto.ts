import { IsNumber } from 'class-validator';

/**
 * jobs endpoint params validation
 */
export class GetJobsDto {
  @IsNumber()
  pageNo: number;

  @IsNumber()
  limit: number;
}

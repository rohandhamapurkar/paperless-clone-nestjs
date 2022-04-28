import { IsNumber } from 'class-validator';

export class GetJobsDto {
  @IsNumber()
  pageNo: number;

  @IsNumber()
  limit: number;
}

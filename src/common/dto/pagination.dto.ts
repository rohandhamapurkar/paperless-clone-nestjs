import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  pageNo = '1';

  @IsOptional()
  @IsNumberString()
  pageSize = '10';

  @IsString()
  @IsOptional()
  searchText = '';
}

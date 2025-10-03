import { Transform } from 'class-transformer';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class PaginationInDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt() @Min(1)
  page = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt() @Min(1) @Max(200)
  items_per_page = 20;
}
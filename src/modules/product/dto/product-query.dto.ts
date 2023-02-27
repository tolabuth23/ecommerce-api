import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { SortQueryEnum } from '../enum/sort-query.enum'
import { CategoryEnum } from '../enum/category.enum'

export class ProductQueryDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  page: number

  @ApiProperty({
    example: 20,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Max(100)
  @Min(1)
  perPage: number

  @ApiPropertyOptional({
    description: '',
    enum: [
      SortQueryEnum.ASC_ID,
      SortQueryEnum.ASC_TYPE,
      SortQueryEnum.ASC_RANK,
      SortQueryEnum.DESC_ID,
      SortQueryEnum.DESC_RANK,
      SortQueryEnum.DESC_TYPE,
    ],
  })
  @IsOptional()
  sort?: SortQueryEnum

  @ApiPropertyOptional({
    type: String,
    enum: CategoryEnum,
    example: CategoryEnum.COMPUTER,
  })
  @IsOptional()
  key: CategoryEnum
}

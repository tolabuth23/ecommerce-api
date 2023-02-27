import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { UnitEnum } from '../enum/unit.enum'
import { CategoryEnum } from '../enum/category.enum'

export class CreateProductDto {
  @ApiProperty({
    example: 'Ipad Gen 6',
  })
  @IsNotEmpty()
  @IsString()
  productName: string

  @ApiProperty({
    example: 'New Model of Ipad Series',
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    example: 400,
  })
  @Type(() => Number)
  @Min(10)
  @Max(1000)
  price: number

  @ApiPropertyOptional({
    type: String,
    enum: UnitEnum,
    example: UnitEnum.BAHT,
  })
  @IsOptional()
  unit: string

  @ApiPropertyOptional({
    type: String,
    enum: CategoryEnum,
    example: CategoryEnum.COMPUTER,
  })
  @IsOptional()
  category: string
}

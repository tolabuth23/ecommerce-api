import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ItemDto {
  @ApiProperty({
    example: 'objectId product',
  })
  @IsNotEmpty()
  @IsString()
  productId: string

  @ApiProperty({
    example: 'itemName',
  })
  @IsNotEmpty()
  @IsString()
  itemName: string

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  quantity: number

  @ApiProperty({
    example: 10,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  price: number
}

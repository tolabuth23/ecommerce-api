import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({
    example: 'email',
  })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}

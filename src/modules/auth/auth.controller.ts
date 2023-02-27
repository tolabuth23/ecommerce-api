import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import bcrypt from 'bcrypt'

import LoginEntity from './entities/login.entity'
import { LoginDto } from './dto/login.dto'
import { LoginValidationPipes } from './pipes/login-validation.pipe'
import { RegisterValidationPipe } from './pipes/register-validation.pipe'

import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LoggerService } from '../logger/logger.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger: LoggerService = new LoggerService(
    AuthController.name,
  )
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiOperation({
    description: 'Register System',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully register',
  })
  async register(
    @Body(RegisterValidationPipe) body: CreateUserDto,
  ): Promise<void> {
    body.password = await bcrypt.hash(body.password, 10)
    try {
      await this.userService.create(body)
    } catch (e) {
      this.logger.error(`catch on register: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Post('/login')
  @ApiOperation({
    description: 'login system',
  })
  @ApiResponse({
    status: 200,
    type: LoginEntity,
    description: 'The record has been successfully login',
  })
  @ApiBody({
    type: LoginDto,
  })
  async login(
    @Body(LoginValidationPipes) body: LoginDto,
  ): Promise<LoginEntity> {
    try {
      return this.userService.login(body)
    } catch (e) {
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}

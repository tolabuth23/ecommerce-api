import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common'
import omit from 'lodash/omit'

import { UserService } from './user.service'
import { User } from './schema/user.schema'
import { RoleEnum } from './enum/role.enum'

import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { ReqUser } from '../../decorator/req-user-decorator'
import { LoggerService } from '../logger/logger.service'

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger: LoggerService = new LoggerService(
    UserController.name,
  )
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN || RoleEnum.USER)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'get me',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully get me',
  })
  async getUser(@ReqUser() req: User): Promise<User> {
    try {
      return {
        ...omit(req, ['_id', 'password']),
      }
    } catch (e) {
      this.logger.error(`catch on GetUser: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  async getAllUser(): Promise<User[]> {
    try {
      return this.userService.getAllUser()
    } catch (e) {
      this.logger.error(
        `catch on getAllUser:${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}

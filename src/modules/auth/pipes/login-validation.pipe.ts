import {
  Injectable,
  InternalServerErrorException,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common'
import bcrypt from 'bcrypt'

import { LoginDto } from '../dto/login.dto'

import { UserService } from '../../user/user.service'
import { User } from '../../user/schema/user.schema'
import { LoggerService } from '../../logger/logger.service'

@Injectable()
export class LoginValidationPipes implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    LoginValidationPipes.name,
  )
  constructor(private readonly userService: UserService) {}

  async transform(body: LoginDto): Promise<LoginDto> {
    let user: User

    try {
      user = await this.userService.getByUsername(body.username)
    } catch (e) {
      this.logger.error(
        `catch on getByUsername: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
    if (!user) {
      throw new UnauthorizedException()
    }

    let matchPassword: boolean
    try {
      matchPassword = await bcrypt.compare(body.password, user.password)
    } catch (e) {
      this.logger.error(
        `catch on matchPassword: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
    if (!matchPassword) {
      throw new UnauthorizedException()
    }

    return body
  }
}

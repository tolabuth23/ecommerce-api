import {
  Injectable,
  InternalServerErrorException,
  PipeTransform,
  Scope,
} from '@nestjs/common'

import { UserService } from '../../user/user.service'
import { CreateUserDto } from '../../user/dto/create-user.dto'
import { LoggerService } from '../../logger/logger.service'

@Injectable({ scope: Scope.REQUEST })
export class RegisterValidationPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(
    RegisterValidationPipe.name,
  )
  constructor(private readonly userService: UserService) {}

  async transform(body: CreateUserDto): Promise<CreateUserDto> {
    try {
      const user = await this.userService.getByUsername(body.username)
      if (user) {
        throw new InternalServerErrorException({
          message: 'Username had already!!',
        })
      }
    } catch (e) {
      this.logger.error(
        `catch on getByUsername: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    try {
      const user = await this.userService.getByEmail(body.email)
      if (user) {
        throw new InternalServerErrorException({
          message: 'Email had already!!',
        })
      }
    } catch (e) {
      this.logger.error(
        `catch on getByEmail: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }

    return body
  }
}

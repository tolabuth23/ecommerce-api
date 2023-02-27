import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { nanoid } from 'nanoid'
import path = require('path')

import { CartService } from './cart.service'
import { ItemDto } from './dto/create-item.dto'

import { LoggerService } from '../logger/logger.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { RoleEnum } from '../user/enum/role.enum'
import { RolesGuard } from '../auth/guards/roles.guard'

import { User } from '../user/schema/user.schema'
import { Roles } from '../auth/decorators/roles.decorator'

import { ReqUser } from '../../decorator/req-user-decorator'

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + nanoid(5)
      const extension: string = path.parse(file.originalname).ext

      cb(null, `${filename}${extension}`)
    },
  }),
}

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  private readonly logger: LoggerService = new LoggerService(CartService.name)
  constructor(private readonly cartService: CartService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN || RoleEnum.USER)
  async addItemToCart(
    @ReqUser() req: User,
    @Body() body: ItemDto,
  ): Promise<void> {
    try {
      await this.cartService.addItemToCart(req.objectId, body)
    } catch (e) {
      this.logger.error(
        `catch on addItemToCart: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN || RoleEnum.USER)
  async removeItemCart(
    @ReqUser() req: User,
    @Param('productId') productId: string,
  ): Promise<void> {
    try {
      return this.cartService.removeItemCart(req.objectId, productId)
    } catch (e) {
      this.logger.error(
        `catch on GetByProductId: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', storage))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return of({ imagePath: file.path })
  // }
}

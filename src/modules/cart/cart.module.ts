import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CartService } from './cart.service'
import { CartController } from './cart.controller'

import { models } from '../../mongoose.providers'
import { DB_CONNECTION_NAME } from '../../constants'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

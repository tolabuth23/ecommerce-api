import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ProductController } from './product.controller'
import { ProductService } from './product.service'

import { models } from '../../mongoose.providers'
import { DB_CONNECTION_NAME } from '../../constants'

@Module({
  imports: [MongooseModule.forFeature(models, DB_CONNECTION_NAME)],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

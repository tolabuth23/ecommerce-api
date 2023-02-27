import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { LoggerModule } from '../logger/logger.module'
import { ProductModule } from '../product/product.module'
import { CartModule } from '../cart/cart.module'

import configuration from '../../config/configuration'
import { mongooseModuleAsyncOptions } from '../../mongoose.providers'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    AuthModule,
    UserModule,
    LoggerModule,
    ProductModule,
    CartModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DB_CONNECTION_NAME } from './constants'
import { User, UserSchema } from './modules/user/schema/user.schema'
import { Product, ProductSchema } from './modules/product/schema/product.schema'
import { Cart, CartSchema } from './modules/cart/schema/cart.schema'

export const models = [
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Product.name,
    schema: ProductSchema,
  },
  {
    name: Cart.name,
    schema: CartSchema,
  },
]
export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: DB_CONNECTION_NAME,
  useFactory: async (configService: ConfigService) =>
    ({
      uri: configService.get<string>('database.host'),
      ...configService.get<any>('database.options'),
      useNewUrlParser: true,
      useCreateIndex: true,
    } as MongooseModuleAsyncOptions),
}

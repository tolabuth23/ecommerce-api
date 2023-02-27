import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { nanoid } from 'nanoid'

import { UnitEnum } from '../enum/unit.enum'

export type ProductDocument = Document & Product
@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'products',
})
export class Product {
  @Prop({
    type: String,
    index: true,
    unique: true,
    default: () => nanoid(5),
  })
  objectId: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  productName: string

  @Prop({
    type: String,
    required: true,
  })
  description: string

  @Prop({
    type: Number,
    required: true,
  })
  price: number

  @Prop({
    type: String,
    enum: UnitEnum,
    required: true,
  })
  unit: string

  @Prop({
    type: String,
    required: true,
  })
  category: string
}
export const ProductSchema = SchemaFactory.createForClass(Product)
